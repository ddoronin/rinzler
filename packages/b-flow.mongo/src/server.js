'use strict';

const { BSON } = require('bson');
const { Server: WebSocketServer } = require('ws');
const { MongoClient } = require('mongodb');
const config = {
    url: 'mongodb://localhost:27017',
    db: 'local',
    collection: 'startup_log'
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
        ws.on('message', function (msg) {
            const now = Date.now();
            console.info('<', msg);

            const db = client.db(config.db);
            const collection = db.collection(config.collection);
            const readable = collection.find({});
            readable.on('readable', function() {
                const cursor = this;
                let chunk;
                while (null !== (chunk = cursor.read())) {
                    //console.log(chunk);
                    //console.log(new BSON().deserialize(chunk));
                    //ws.send(`Sending ${chunk.length} bytes of data.`);
                    console.log(`>> ${Date.now() - now}ms`);
                    ws.send(chunk, { binary: true });
                }
            });
        });
    });
});
