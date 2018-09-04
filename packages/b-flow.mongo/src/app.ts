'use strict';

import chalk from 'chalk';
import { proto, str, bson } from 'bytable';
import { Codec } from 'bytable-node';
import { MongoClient } from 'mongodb';
import { Server } from 'ws';

@proto
class Request {
    @str
    id: string;

    @bson
    payload: {};
}

export class App {
    private readonly requestCodec = new Codec(Request);

    constructor(
        private mongoClient: MongoClient, 
        private wss: Server) {
    }

    handleConnection() {
        console.log(chalk.cyanBright('(+1) connection'));
    }

    handleMessage = (msg0: any, ws: WebSocket) => {
        const req = this.requestCodec.read(msg0);
        console.log('payload  ', chalk.green(
            JSON.stringify(req, null, '\t')
        ));

        // echo
        console.log(msg0);
        ws.send(this.requestCodec.write(req));
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
