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

    public getConnection(workspaceId: string, messageCallbacks: DataMessageCallbacks): MultipleConnection {
        return new MultipleConnection(this.getMyLocalId(), workspaceId, messageCallbacks)
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

export interface DataMessageCallbacks {
    receiveCodeUpdate: (code: string) => void;
}

export interface DataMessage {
    type: MessageType;
    data: string;
}

export class MultipleConnection {
    private peer: Peer;
    private peerConnections: ConnectionDictionary = {};
    private codeClient: CodeClient;
    private code: string = ``;

    constructor(
        private localId: string,
        private workspaceId: string,
        private messageCallbacks: DataMessageCallbacks) {
        this.codeClient = new CodeClient();
        this.peer = new Peer();
        this.InitializePeer()
    }

    private async InitializePeer() {

        this.peer.on('open', async (id) => {
            console.log("ID: " + this.peer.id);
            console.log("Awaiting connection...");
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
                this.ReceiveMessage(data)
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

        let requestUpdate = true;

        for (const id in workspaceState.users) {
            if (id === this.localId) continue;

            const user = workspaceState.users[id];

            const connection = this.peer.connect(user.connectionId);
            connection.on('open', () => {
                console.log("Connected to: " + connection.peer);
                if (requestUpdate) {
                    // setTimeout(() => {
                        connection.send({
                            type: MessageType.RequestUpdate,
                            data: connectionId
                        })
                        requestUpdate = false
                    // }, 3000)
                }
            });

            connection.on('close', function () {
                console.log("Connection closed");
            });

            this.AddConnection(connection);
        }
    }

    public SendMessage(message: DataMessage): void {
        if(message.type == MessageType.Code) {
            this.code = message.data;
        }

        for (var id in this.peerConnections) {
            const peerConnection = this.peerConnections[id].connection;
            peerConnection.send(message);
        }
    }

    public SendMessageToUser(userId: string, message: DataMessage): void {
        this.peerConnections[userId].connection.send(message);
    }

    private ReceiveMessage(message: DataMessage) {
        switch (message.type) {
            case MessageType.Code:
                console.log('Received', message.data);
                this.code = message.data;
                this.messageCallbacks.receiveCodeUpdate(message.data);
                break;
            case MessageType.RequestUpdate:
                this.SendMessageToUser(message.data, {
                    type: MessageType.Code,
                    data: this.code
                })
                break;
        }
    }
}

// export class ConnectionService {

//     private code: string = ``;

//     constructor(
//         private connection: MultipleConnection,
//         private messageCallbacks: DataMessageCallbacks) {
//     }

//     private ReceiveMessage(message: DataMessage) {
//         switch (message.type) {
//             case MessageType.Code:
//                 console.log('Received', message.data);
//                 this.messageCallbacks.receiveCodeUpdate(message.data);
//             case MessageType.RequestUpdate:
//             // this.SendMessageToUser(message.data, message)                
//         }
//     }
// }