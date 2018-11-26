import { MongoClient } from 'mongodb';
import { yorker } from 'yorker';

export async function startMongo(config: { url: string }) {
    const say = yorker.see(`🚂 Connecting to mongo: "${config.url}"`);
    const client = new MongoClient(config.url, { raw: true, useNewUrlParser: true });
    await client.connect();
    say('connected');
    return client;
}
