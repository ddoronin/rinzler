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

    start() {
        const { requestCodec } = this;
        console.info(chalk.yellow('Starting App'));
        this.wss.on('connection', function(ws) {
            console.log(chalk.cyanBright('(+1) connection'));
            ws.on('message', function (msg0) {
                const req = requestCodec.read(msg0 as any);
                console.log('payload  ', chalk.green(
                    JSON.stringify(req, null, '\t')
                ));
                // TODO: connect to mongo.
            });
        });
    }
}
