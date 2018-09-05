'use strict';

import chalk from 'chalk';
import { MongoClient } from 'mongodb';

export function startMongo(config: {url: string}): Promise<MongoClient> {
    console.info(chalk.yellow('Starting Mongo'));
    return new Promise((resolve, reject) => {
        console.info(`Connecting to mongo: "${config.url}"`);
        const client = new MongoClient(config.url, { raw: true, useNewUrlParser: true });
        client.connect((err, client) => {
            if(err) {
                console.error('Error while connecting to mongo', err);
                reject(err);
                return process.exit(1);
            }
            console.info('Connection to mongo succeeded');
            resolve(client);
        });
    });
}
