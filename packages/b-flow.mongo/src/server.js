'use strict';

const { BSON } = require('bson');
const { Server: WebSocketServer } = require('ws');
const { MongoClient } = require('mongodb');
const config = {
    url: 'mongodb://localhost:27017',
    db: 'local',
    collection: 'startup_log'
}

const HEADER_SIZE = 7; //bytes
const STATUS = {
    OK: 0,
    ERROR: 1
}
/**
 * PROTOCOL
 * >-010101010101001010101010->
 * 
 * Request:
 * 
 * HEADER                   >> 0
 * +--------------------------+
 * | PAYLOAD_SIZE       UInt8 |
 * +--------------------------+
 * 
 * PAYLOAD                  >> 1
 * +--------------------------+
 * | BSON size = PAYLOAD_SIZE |
 * +--------------------------+
 * 
 * MARKER                   >> 1 + PAYLOAD_SIZE
 * +--------------------------+
 * | RequestID - UUID4        |
 * +--------------------------+
 * MARKER_SIZE = REQUEST_SIZE - (1 + PAYLOAD_SIZE)
 * 
 * Response:
 * 
 * HEADER                   >> 0
 * +--------------------------+
 * | STATUS_CODE        UInt8 |
 * | DOCUMENT_INDEX     UInt16|
 * | DOCUMENT_SIZE      UInt32|
 * +--------------------------+
 * 
 * DOCUMENT                 >> 6
 * +--------------------------+
 * | BSON size = DOCUMENT_SIZE|
 * +--------------------------+
 * 
 * MARKER                   >> 6 + DOCUMENT_SIZE
 * +--------------------------+
 * | RequestID - UUID4        |
 * +--------------------------+
 * 
 * METADATA                 >> 6 + DOCUMENT_SIZE + MARKER_SIZE
 * +--------------------------+
 * | <Buffer ...              |
 * +--------------------------+
 */

 /**
  * 
  */
const respond = (code, doci, doc) => {
    const docSize = doc ? doc.length: 0;
    console.log('docSize', HEADER_SIZE + docSize);
    const resp = Buffer.alloc(HEADER_SIZE + docSize);

    // status code
    resp.writeUInt8(code, 0);

    // document index
    resp.writeUInt16BE(doci, 1);

    // document size
    resp.writeUInt32BE(docSize, 3);

    if(docSize > 0) {
        resp.fill(doc, HEADER_SIZE, docSize);
    }

    return resp;
}

const client = new MongoClient(config.url, {raw: true, useNewUrlParser: true});
client.connect((err, client) => {
    if(err){
        console.error('Error while connecting to mongo', err);
        return process.exit(1);
    }

    const wss = new WebSocketServer({ port: 8080 });
    console.log('Listening on', 8080);
    wss.on('connection', function (ws) {
        ws.send('connected....');
        ws.on('message', function (msg0) {
            let now = Date.now();
            const size = msg0.readUInt8(0);
            const bson = new BSON();
            const req = bson.deserialize(msg0.slice(1, 1 + size));
            console.log(req);
            const db = client.db(config.db);
            const collection = db.collection(req.collection || config.collection);
            const cursor = collection.find(req.query || {}, req.options);
            let count = 0;
            cursor.on('readable', () => {
            });
            cursor.on('end', () => {
                console.log('!! count is ', count);
                const done0 = respond(STATUS.OK, count);
                ws.send(done0, { binary: true });
            });
            cursor.forEach(doc => {
                console.log(`>> ${Date.now() - now}ms`);
                now = Date.now();
                const res0 = respond(STATUS.OK, count++, doc);
                ws.send(res0, { binary: true });
            }, error => {
                console.error('error: ', error);
                if(error !== null){
                    const error0 = respond(STATUS.ERROR, 0, bson.serialize(error));
                    ws.send(error0, { binary: true });
                }
            });
        });
    });
});
