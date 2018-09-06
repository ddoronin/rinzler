import React, { Component } from 'react';
import { PluginBase } from 'terminal-in-react';
import { createFindRequest } from './terminal/executor';
import { find } from './terminal/dsl';

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

    constructor(private api: {
        printLine: (s: string) => void
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
        method: (args) => {
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
        method: (args) => {
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

    createFindRequest = (db: string, collection: string, find: {}, options?: {}) => createFindRequest(
        { ws: this.ws, term: this.api }, 
        { db, collection, find, options }
    );

    find = () => ({
        method: (args, print) => {
            if (!this.database) {
                return 'Please connect to database first:\nconnect [name]';
            }
            if (!this.collection) {
                return 'Please use collection:\nuse [collection name]';
            }
            if (args._.length > 0) {
                const f = find(args._);
                print(JSON.stringify(f[0]) + ' with ' + JSON.stringify(f[1]));
                this.createFindRequest(this.database, this.collection, f[0], f[1]);
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
        find: '[FilterQuery] [FindOneOptions?]'
    };
}
