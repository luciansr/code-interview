import Peer from 'peerjs';
import { CodeClient } from './CodeClient';

const codeClient = new CodeClient();

export class MultipleConnectionService {
    private myId: string;

    constructor() {
        this.myId = this.getMyLocalId();
        console.log(this.myId);
    }

    private getMyLocalId(): string {
        const key = `my-local-id`;

        const myId = sessionStorage.getItem(key);
        if (myId) return myId;

        const newId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });

        sessionStorage.setItem(key, newId);

        return newId;
    }

    public getConnection(workspaceId: string, messageCallbacks: DataMessageCallbacks): CommunicationManager {
        return new CommunicationManager(this.getMyLocalId(), workspaceId, messageCallbacks)
    }

    public async getNewInterviewCode(): Promise<string> {
        const workspace = await codeClient.CreateWorkspace({
            connectionId: "init",
            userId: this.getMyLocalId()
        })

        return workspace.id;
    }
}


interface ConnectionState {
    connection: Peer.DataConnection;
    onDataInitialized: boolean
}

interface ConnectionDictionary {
    [id: string]: ConnectionState
}


// export enum MessageType {
//     Code,
//     Chat,
//     RequestUpdate
// }

// export enum DestinationType {
//     All,
//     Single
// }

// export interface Destination {
//     type: DestinationType
//     connectionId: string
// }

// export interface Message {
//     type: MessageType
//     data: string
// }

// export interface DataMessage {
//     destination: Destination
//     data: Message
// }

export enum MessageType {
    Code,
    Chat,
    RequestUpdate
}

export interface DataMessage {
    type: MessageType;
    data: string;
}

class MultipleConnection {
    private peer: Peer;
    private peerConnections: ConnectionDictionary = {};
    private codeClient: CodeClient;
    private code: string = ``;

    constructor(
        private localId: string,
        private workspaceId: string,
        private receiveMessageCallback: (message: DataMessage) => void,
        private onConnectCallback: (myConnectionId: string) => void,
        private onConnectWithUserCallback: (userConnectionId: string) => void) {
        this.codeClient = new CodeClient();
        this.peer = new Peer();
        this.InitializePeer()
    }

    private async InitializePeer() {

        this.peer.on('open', async (id) => {
            console.log("ID: " + this.peer.id);
            console.log("Awaiting connection...");
            this.onConnectCallback(this.peer.id)
            await this.ConnectToAllUsers(id);
        });
        this.peer.on('connection', (newConnection) => {
            console.log("Connected to: " + newConnection.peer);
            this.AddConnection(newConnection);
        });
        this.peer.on('disconnected', () => {
            // status.innerHTML = "Connection lost. Please reconnect";
            console.log('Connection lost. Please reconnect');

            // Workaround for peer.reconnect deleting previous id
            // peer.id = lastPeerId;
            // peer._lastServerId = lastPeerId;
            this.peer.reconnect();
        });
        this.peer.on('close', function () {
            // conn = null;
            // status.innerHTML = "Connection destroyed. Please refresh";
            console.log('Connection destroyed');
        });
        this.peer.on('error', function (err) {
            console.log(err);
            alert('' + err);
        });
    }

    private AddConnection(newConnection: Peer.DataConnection) {
        this.peerConnections[newConnection.peer] = {
            connection: newConnection,
            onDataInitialized: false
        }

        this.InitializeDataConnection(this.peerConnections[newConnection.peer]);
    }

    private InitializeDataConnection(connectionState: ConnectionState) {
        if (!connectionState.onDataInitialized) {
            connectionState.connection.on('data', (data: DataMessage) => {
                this.receiveMessageCallback(data)
            })

            connectionState.onDataInitialized = true;
        }
    }

    private async ConnectToAllUsers(connectionId: string) {
        const workspaceState = await this.codeClient.UpdateWorkspace({
            connectionId: connectionId,
            userId: this.localId,
            workspaceId: this.workspaceId,
        })

        for (const id in workspaceState.users) {
            if (id === this.localId) continue;

            const user = workspaceState.users[id];

            const connection = this.peer.connect(user.connectionId);
            connection.on('open', () => {
                console.log("Connected to: " + connection.peer);
                this.onConnectWithUserCallback(connection.peer)
            });

            connection.on('close', function () {
                console.log("Connection closed");
            });

            this.AddConnection(connection);
        }
    }

    public SendMessage(message: DataMessage): void {
        if (message.type == MessageType.Code) {
            this.code = message.data;
        }

        for (var id in this.peerConnections) {
            const peerConnection = this.peerConnections[id].connection;
            peerConnection.send(message);
        }
    }

    public SendMessageToUser(userConnectionId: string, message: DataMessage): void {
        this.peerConnections[userConnectionId].connection.send(message);
    }
}

export interface DataMessageCallbacks {
    receiveCodeUpdate: (code: string) => void;
}

export class CommunicationManager {

    private myConnectionId?: string
    private code: string = ``
    private alreadyRequestedInitialState: boolean = false
    private connection: MultipleConnection

    constructor(
        private localId: string,
        private workspaceId: string,
        private messageCallbacks: DataMessageCallbacks) {
        this.connection = new MultipleConnection(localId, workspaceId, 
            (message: DataMessage) => this.ReceiveMessage(message),
            (myConnectionId: string) => this.OnConnect(myConnectionId),
            (userConnectionId: string) => this.OnConnectToUser(userConnectionId))
    }

    private OnConnect(myConnectionId: string) {
        console.log(`Service: connected with id ${myConnectionId}`)
        this.myConnectionId = myConnectionId;
    }

    private OnConnectToUser(userConnectionId: string) {
        console.log(`Service: connected with user id ${userConnectionId}`)
        if (this.code.length === 0 && !this.alreadyRequestedInitialState) {
            this.RequestStateUpdateToUser(userConnectionId)
            this.alreadyRequestedInitialState = true;
        }
    }

    private RequestStateUpdateToUser(userConnectionId: string) {
        this.connection.SendMessageToUser(userConnectionId, {
            data: this.myConnectionId || ``,
            type: MessageType.RequestUpdate
        })
    }

    private ReceiveMessage(message: DataMessage) {
        switch (message.type) {
            case MessageType.Code:
                console.log('Received', message.data);
                this.code = message.data;
                this.messageCallbacks.receiveCodeUpdate(message.data);
                break;
            case MessageType.RequestUpdate:
                this.SendCodeUpdateToUser(message.data)
                break;
        }
    }

    public SendCodeUpdateToUser(userConnectionId: string): void {
        this.connection.SendMessageToUser(userConnectionId, {
            type: MessageType.Code,
            data: this.code
        })
    }

    public SendCodeUpdate(code: string): void {
        this.code = code;
        this.connection.SendMessage({
            data: code,
            type: MessageType.Code
        })
    }
}