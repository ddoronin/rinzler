'use strict';

import chalk from 'chalk';
import { proto, str, bson, binary } from 'bytable';
import { Codec } from 'bytable-node';
import { MongoClient } from 'mongodb';
import { Server } from 'ws';

@proto
class Request {
    @str
    id: string;

    @str
    db: string;

    @str
    collection: string;

    @bson
    find: {};

    @bson
    options: {};
}

@proto
class Response {
    @str
    id: string;

    @binary
    data: {};
}

export class App {
    private readonly requestCodec = new Codec(Request);
    private readonly responseCodec = new Codec(Response);

    constructor(
        private mongoClient: MongoClient, 
        private wss: Server) {
    }

    handleConnection() {
        console.log(chalk.cyanBright('(+1) connection'));
    }

    handleMessage = (msg0: any, ws: WebSocket) => {
        const self = this;
        const req = this.requestCodec.read(msg0);
        console.log(chalk.green(
            JSON.stringify(req, null, '\t')
        ));
        const db = this.mongoClient.db(req.db);
        const collection = db.collection(req.collection);
        const readable = collection.find(req.find, req.options);
        readable.on('readable', function() {
            const cursor = this;
            let chunk;
            while (null !== (chunk = cursor.read())) {
                const resp = new Response();
                resp.id = req.id;
                resp.data = chunk;
                const b = self.responseCodec.write(resp);
                console.log(chalk.green(`> sending ${b.byteLength} bytes`));
                (ws as any).send(b, { binary: true });
            }
        });
    }

    start() {
        console.info(chalk.yellow('Starting App'));
        this.wss.on('connection', (ws) => {
            this.handleConnection();
            ws.on('message', (msg0) => {
                this.handleMessage(msg0, ws as any);
            });
        });
    }
}