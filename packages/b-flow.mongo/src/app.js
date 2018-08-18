'use strict';

const chalk                 = require('chalk');
const { ProtoReader }       = require('./transport/proto-reader');
const { REQ, RES, STATUS }  = require('./transport/proto');
const { Codec }             = require('./transport/codec');

const reqProtoReader = new ProtoReader(REQ);

class App {
    constructor(mongoClient, wss) {
        this.mongoClient = mongoClient;
        this.wss = wss;
    }

    start() {
        console.info(chalk.yellow('Starting App'));
        this.wss.on('connection', function(ws) {
            console.log(chalk.cyanBright('(+1) connection'));
            ws.on('message', function (msg0) {
                const msg0_bst = reqProtoReader.getByteShiftTable(msg0);
                console.log(msg0, msg0_bst);
    
                const reqCodec = new Codec(reqProtoReader, msg0);
                const requestId = reqCodec.readAsString('MARKER');
                const payload = reqCodec.readAsJSON('BODY');
    
                console.log('requestId', chalk.green(requestId));
                console.log('payload  ', chalk.green(
                    JSON.stringify(payload, null, '\t')
                ));
                // TODO: connect to mongo.
            });
        });
    }
}

exports.App = App;