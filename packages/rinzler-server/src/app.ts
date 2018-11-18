import { MongoClient } from 'mongodb';
import { Server } from 'ws';
import { yorker } from 'yorker';
import { reqC, REQUEST_TYPE } from './dto';
import { handleDBList, handleDBCollections, handleDBFind } from './handlers';

export class App {
    private connectionsCount: number = 0;

    constructor(
        private mongoClient: MongoClient, 
        private wss: Server) {
    }

    handleMessage = (reqBuf: any, ws: WebSocket, say: (s: string) => void) => {
        const req = reqC.read(reqBuf);
        const context = {mongoClient: this.mongoClient, ws};
        switch (req.type) {
            case REQUEST_TYPE.DBLIST: 
                handleDBList(req, reqBuf, context);
                break;

            case REQUEST_TYPE.DBCOLLECTIONS: 
                handleDBCollections(req, reqBuf, context);
                break;

            case REQUEST_TYPE.DBFIND: 
                handleDBFind(req, reqBuf, context);
                break;
        }
    }

    start() {
        yorker.see('Starting App');
        this.wss.on('connection', (ws) => {
            
            this.connectionsCount++;
            const say = yorker.see(`[+] ${this.connectionsCount} open connection(s)`);
            ws.on('message', (buf) => {
                this.handleMessage(buf, ws as any, say);
            });
            ws.on('close', () => {
                this.connectionsCount--;
                say(`[-] ${this.connectionsCount} open connection(s)`);
            });
        });
    }
}
