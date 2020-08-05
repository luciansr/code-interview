import Peer from 'peerjs';

export class CodeService {
    private static setMyId(id: string): void {
        sessionStorage.setItem('my-id', id);
    }

    private static getMyId(): string {
        return sessionStorage.getItem('my-id') || '';
    }

    private static isItMyId(id: string): boolean {
        return CodeService.getMyId() === id;
    }

    public static async getConnection(id: string): Promise<Connection> {
        return new Promise(async (resolve) => {

            if (this.isItMyId(id)) {
                const peer = new Peer(id);

                peer.on('connection', (conn) => {
                    // resolve(conn)
                    console.log('connection', conn)
                    resolve(new Connection(conn));
                });


                peer.on('open', () => {
                    // resolve(new Connection(peer));
                    console.log(peer.id)
                });
            } else {
                const peer = new Peer();
                var conn = peer.connect(id, {reliable: true});
                peer.on('open', () => {
                    console.log(peer.id)
                }); 
                conn.on('open', () => {
                    resolve(new Connection(conn));
                });           
            }
        })
    }

    public static async getNewInterviewCode(): Promise<string> {
        return new Promise((resolve) => {
            const peer = new Peer()

            peer.on('open', (id: string) => {
                CodeService.setMyId(id);
                resolve(id)
            })
        })
    }
}

export class Connection {
    private onReceiveMessage?: (message: string) => void

    constructor(private peerConnection: Peer.DataConnection) {
        this.init();
    }

    private init() {
        // Receive messages
        this.peerConnection.on('data', (data) => {
            console.log('Received', data);
            if(this.onReceiveMessage) {
                this.onReceiveMessage(data);
            }
        });
    }

    public sendMessage(message: string): void {
        this.peerConnection.send(message)
    }

    public setReceiveMessage(onReceiveMessage: (message: string) => void): void {
        this.onReceiveMessage = onReceiveMessage;
    }
}