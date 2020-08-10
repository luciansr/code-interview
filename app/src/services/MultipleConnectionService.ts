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

    public getConnection(workspaceId: string, onReceiveDataCallback: (message: CustomDataMessage) => void): MultipleConnection {
        return new MultipleConnection(this.getMyLocalId(), workspaceId, onReceiveDataCallback)
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

export enum MessageType {
    Code,
    Chat,
    RequestUpdate
}

export interface CustomDataMessage {
    type: MessageType;
    data: string;
}

export class MultipleConnection {
    private peer: Peer;
    private peerConnections: ConnectionDictionary = {};
    private codeClient: CodeClient;

    constructor(
        private localId: string,
        private workspaceId: string,
        private onReceiveDataCallback: (message: CustomDataMessage) => void) {
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
            connectionState.connection.on('data', (data) => {
                console.log('Received', data);
                this.onReceiveDataCallback(data);
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
            });

            connection.on('close', function () {
                console.log("Connection closed");
            });

            this.AddConnection(connection);
        }
    }

    public SendMessage(message: CustomDataMessage): void {
        for (var id in this.peerConnections) {
            const peerConnection = this.peerConnections[id].connection;
            peerConnection.send(message);
        }
    }
}