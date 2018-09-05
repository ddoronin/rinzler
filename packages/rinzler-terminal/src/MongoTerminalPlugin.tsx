import React, { Component } from 'react';
import { PluginBase } from 'terminal-in-react';
import { Codec, proto, str, bson } from 'bytable-node';
import { DataViewReader } from 'bytable-client/lib/DataViewReader';

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

    @bson
    data: {};
}

const requestCodec = new Codec(Request);
const responseCodec = new Codec(Response);
const reader = new DataViewReader(Request);
const responseReader = new DataViewReader(Response);

export class MongoTerminalPlugin extends PluginBase {
    static displayName: string = 'Mongo Terminal';
    static version: string = '0.0.1';
    private database: string;
    private collection: string;
    private ws: WebSocket;

    get prefix(): string {
        if (this.database && this.collection) return `${this.database} \\ ${this.collection} `;
        if (this.database)                    return `${this.database} \\ --- `;
        return ' ';
    }

    createRequest = (id, db, collection, find, options) => {
        const msg = new Request();
        msg.id = id;
        msg.db = db;
        msg.collection = collection;
        msg.find = find;
        msg.options = options;
        const b = requestCodec.write(msg);
        this.api.printLine(`sending ${b.byteLength} bytes...`);
        this.ws.send(b);
        this.ws.onmessage = ({data}) => {
            if(data instanceof ArrayBuffer){
                this.api.printLine(`receving ${data.byteLength} bytes...`);
                this.api.printLine(JSON.stringify(responseReader.read(data)));
            }
        };
    }

    constructor(private api: {
        setPromptPrefix: (s: string) => void
    }, config: {}) {
      super(api, config);
      api.setPromptPrefix(this.prefix);

      const ws = new WebSocket('ws://localhost:8080/');
        ws.binaryType = 'arraybuffer';
        ws.onopen = () => {
            this.ws = ws;
        }
    }

    connect = () => ({
        method: (args, print) => {
            if (args._.length > 0) {
                this.database = args._[0];
                this.collection = null;
            }
            if (args._.length > 1) {
                this.collection = args._[1];
            }
            this.api.setPromptPrefix(this.prefix);
        },
    });

    use = () => ({
        method: (args, print) => {
            if (args._.length > 1) {
                this.database = args._[0];
                this.collection = args._[1];
            } else if (args._.length > 0) {
                if (!this.database) {
                    return 'Please connect to database first:\nconnect [name]';
                }
                this.collection = args._[0];
            }
            this.api.setPromptPrefix(this.prefix);
        },
    });

    find = () => ({
        method: (args, print) => {
            if (!this.database) {
                return 'Please connect to database first:\nconnect [name]';
            }
            if (!this.collection) {
                return 'Please use collection:\nuse [collection name]';
            }
            if (args._.length > 0) {
                const f = JSON.parse(args._.join(''));
                print(JSON.stringify(f));
                this.createRequest('123', this.database, this.collection, f, { limit: 10 });
            }
        },
    });

    commands = {
      connect: this.connect(),
      use: this.use(),
      find: this.find()
    };

    descriptions = {
        connect: 'database name',
        use: 'collection name',
        
    };
}
