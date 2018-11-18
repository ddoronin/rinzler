'use strict';

import { proto, str, bson, binary } from 'bytable';
import { Codec } from 'bytable-node';
import { MongoClient } from 'mongodb';
import { Server } from 'ws';
import * as zlib from 'zlib';
import { yorker } from 'yorker';
import { TReq } from './dto/TReq';
import { DBListReq, DBList } from './dto/DBList';
import { ColListReq, ColList } from './dto/ColList';
import { FindReq, Found } from './dto/FindReq';
import { REQUEST_TYPE } from './dto/common';

export class App {
    private connectionsCount: number = 0;

    private readonly reqC = new Codec(TReq);

    private readonly dbListReqC = new Codec(DBListReq);
    private readonly dbListC = new Codec(DBList);

    private readonly colsReqC = new Codec(ColListReq);
    private readonly colsC = new Codec(ColList);
    
    private readonly findReqC = new Codec(FindReq);
    private readonly foundC = new Codec(Found);

    constructor(
        private mongoClient: MongoClient, 
        private wss: Server) {
    }

    handleDBList = (req: TReq, reqBuf: any, ws: WebSocket) => {
        const say = yorker.see('request db list')
        this.mongoClient.db('admin').admin().listDatabases((err, result) => {
            const dbList = new DBList();
            dbList.id = req.id;
            dbList.list = result.databases;
            ws.send(this.dbListC.write(dbList));
            say(JSON.stringify(dbList, null, '\t'));
        });
    }

    handleDBCollections = (req: TReq, reqBuf: any, ws: WebSocket) => {
        const recol = this.colsReqC.read(reqBuf);
        const say = yorker.see(`request db collections for ${recol.db}`);
        this.mongoClient.db(recol.db).collections((err, result) => {
            let cols = result.map(_ => _.collectionName);
            say(JSON.stringify(cols, null, '\t'));
            const dbCol = new ColList();
            dbCol.id = req.id;
            dbCol.list = cols;
            ws.send(this.colsC.write(dbCol));
        });
    }

    handleDBFind = (req: TReq, reqBuf: any, ws: WebSocket) => {
        const self = this;
        const {
            db, collection, find, options
        } = this.findReqC.read(reqBuf);
        const say = yorker.see(`find in ${db} | ${collection}`);

        const readable = this.mongoClient
            .db(db)
            .collection(collection)
            .find(find, options);
    
        readable.on('readable', function() {
            const cursor = this;
            let chunk;
            while (null !== (chunk = cursor.read())) {
                const found = new Found();
                found.id = req.id;
                found.data = chunk;//zlib.gzipSync(chunk);
                const buf = self.foundC.write(found);
                say('response');
                (ws as any).send(buf, { binary: true });
            }
        });
    }

    handleMessage = (reqBuf: any, ws: WebSocket, say: (s: string) => void) => {
        const self = this;
        const req = this.reqC.read(reqBuf);
        switch (req.type) {
            case REQUEST_TYPE.DBLIST: this.handleDBList(req, reqBuf, ws);
                break;

            case REQUEST_TYPE.DBCOLLECTIONS: this.handleDBCollections(req, reqBuf, ws);
                break;

            case REQUEST_TYPE.DBFIND: this.handleDBFind(req, reqBuf, ws);
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
