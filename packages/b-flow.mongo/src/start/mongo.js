'use strict';

const chalk             = require('chalk');
const { MongoClient }   = require('mongodb');

function startMongo(config) {
    console.info(chalk.yellow('Starting Mongo'));
    return new Promise((resolve, reject) => {
        console.info(`Connecting to mongo: "${config.url}"`);
        const client = new MongoClient(config.url, { raw: true, useNewUrlParser: true });
        client.connect((err, client) => {
            if(err) {
                console.error('Error while connecting to mongo', err);
                reject(error);
                return process.exit(1);
            }
            console.info('Connection to mongo succeeded');
            resolve(client);
        });
    });
}

exports.startMongo = startMongo;
