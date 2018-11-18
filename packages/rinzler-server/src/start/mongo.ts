import { MongoClient } from 'mongodb';
import { yorker } from 'yorker';

export async function startMongo(config: { url: string }) {
    return new Promise<MongoClient>((resolve, reject) => {
        const say = yorker.sees(`🚂 Connecting to mongo: "${config.url}"`);
        const client = new MongoClient(config.url, { raw: true, useNewUrlParser: true });
        client.connect((err, client) => {
            if (err) {
                say('Run mongod --config /usr/local/etc/mongod.conf', err);
                reject(err);
                return process.exit(1);
            }
            say('Connection to mongo succeeded.');
            resolve(client);
        });
    });
}
