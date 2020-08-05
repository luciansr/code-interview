import Peer from 'peerjs';

export class CodeService {
    private static setMyId(id: string): void {
        localStorage.setItem('my-id', id);
    }

    private static getMyId(): string {
        return localStorage.getItem('my-id') || '';
    }

    public static isItMyId(id: string): boolean {
        return CodeService.getMyId() === id;
    }

    static async getNewInterviewCode(): Promise<string> {
        return new Promise((resolve) => {
            const peer = new Peer()

            peer.on('open', (id: string) => {
                CodeService.setMyId(id);
                resolve(id)
            })
        })
    }
}