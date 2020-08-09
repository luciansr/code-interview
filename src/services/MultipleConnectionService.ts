import Peer from 'peerjs';

export class MultipleConnectionService {
    private static setMyId(id: string): void {
        sessionStorage.setItem('my-id', id);
    }

    private static getMyId(): string {
        return sessionStorage.getItem('my-id') || '';
    }

    private static isItMyId(id: string): boolean {
        return MultipleConnectionService.getMyId() === id;
    }

    public static async getConnection(id: string): Promise<Connection> {
        return new Promise(async (resolve) => {

            if (this.isItMyId(id)) {
                // const peer = new Peer(id);

                // peer.on('connection', (conn) => {
                //     // resolve(conn)
                //     console.log('connection', conn)
                //     resolve(new Connection(conn));
                // });


                // peer.on('open', () => {
                //     // resolve(new Connection(peer));
                //     console.log(peer.id)
                // });


                const peer = new Peer(id, {
                    debug: 2
                });

                peer.on('open', function (id) {
                    // Workaround for peer.reconnect deleting previous id
                    // if (peer.id === null) {
                    //     console.log('Received null id from peer open');
                    //     peer.id = lastPeerId;
                    // } else {
                    //     lastPeerId = peer.id;
                    // }

                    console.log("ID: " + peer.id);
                    console.log("Awaiting connection...");
                });
                peer.on('connection', function (c) {
                    // Allow only a single connection
                    // if (conn && conn.open) {
                    //     c.on('open', function() {
                    //         c.send("Already connected to another client");
                    //         setTimeout(function() { c.close(); }, 500);
                    //     });
                    //     return;
                    // }

                    // conn = c;
                    console.log("Connected to: " + c.peer);
                    // status.innerHTML = "Connected";
                    resolve(new Connection(c));
                    // ready();
                });
                // peer.on('disconnected', function () {
                //     status.innerHTML = "Connection lost. Please reconnect";
                //     console.log('Connection lost. Please reconnect');

                //     // Workaround for peer.reconnect deleting previous id
                //     peer.id = lastPeerId;
                //     peer._lastServerId = lastPeerId;
                //     peer.reconnect();
                // });
                peer.on('close', function () {
                    // conn = null;
                    // status.innerHTML = "Connection destroyed. Please refresh";
                    console.log('Connection destroyed');
                });
                peer.on('error', function (err) {
                    console.log(err);
                    alert('' + err);
                });


            } else {
                // const peer = new Peer();
                const peer = new Peer(undefined, {
                    debug: 2
                });

                peer.on('open', function (id) {
                    // Workaround for peer.reconnect deleting previous id
                    // if (peer.id === null) {
                    //     console.log('Received null id from peer open');
                    //     peer.id = lastPeerId;
                    // } else {
                    //     lastPeerId = peer.id;
                    // }

                    console.log('ID: ' + peer.id);




                    // if (conn) {
                    //     conn.close();
                    // }

                    // Create connection to destination peer specified in the input field


                });
                peer.on('connection', function (c) {
                    // Disallow incoming connections
                    c.on('open', function () {
                        c.send("Sender does not accept incoming connections");
                        setTimeout(function () { c.close(); }, 500);
                    });
                });

                setTimeout(() => {
                    const conn = peer.connect(id, {
                        // reliable: true
                    });

                    conn.on('open', function () {
                        // status.innerHTML = "Connected to: " + conn.peer;
                        console.log("Connected to: " + conn.peer);
                        resolve(new Connection(conn));
                        // Check URL params for comamnds that should be sent immediately
                        // var command = getUrlParam("command");
                        // if (command)
                        //     conn.send(command);
                    });
                    // Handle incoming data (messages only since this is the signal sender)
                    // conn.on('data', function (data) {
                    //     // addMessage("<span class=\"peerMsg\">Peer:</span> " + data);
                    // });
                    conn.on('close', function () {
                        console.log("Connection closed");
                    });
                }, 3000);


                // peer.on('disconnected', function () {
                //     // status.innerHTML = "Connection lost. Please reconnect";
                //     console.log('Connection lost. Please reconnect');

                //     // Workaround for peer.reconnect deleting previous id
                //     // peer.id = lastPeerId;
                //     // peer._lastServerId = lastPeerId;
                //     peer.reconnect();
                // });
                peer.on('close', function () {
                    // conn = null;
                    // status.innerHTML = "Connection destroyed. Please refresh";
                    console.log('Connection destroyed');
                });
                peer.on('error', function (err) {
                    console.log(err);
                    alert('' + err);
                });
            }
        })
    }


    private static uuidv4(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    public static async getNewInterviewCode(): Promise<string> {



        return new Promise((resolve) => {
            const id = this.uuidv4();
            // const peer = new Peer()

            // peer.on('open', (id: string) => {
            MultipleConnectionService.setMyId(id);
            resolve(id)
            // })
        })
    }


    // public static async getNewInterviewCode(): Promise<string> {



    //     return new Promise((resolve) => {
    //         const peer = new Peer()

    //         peer.on('open', (id: string) => {
    //             CodeService.setMyId(id);
    //             resolve(id)
    //         })
    //     })
    // }
}

export class Connection {
    constructor(
        private peerConnection: Peer.DataConnection) {
    }

    public onReceiveData(onReceiveDataCallback: (message: string) => void) {
        // Receive messages
        this.peerConnection.on('data', (data) => {
            console.log('Received', data);
            onReceiveDataCallback(data);
        });
    }

    public sendMessage(message: string): void {
        this.peerConnection.send(message)
    }
}