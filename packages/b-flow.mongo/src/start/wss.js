'use strict';

const chalk                         = require('chalk');
const { Server: WebSocketServer }   = require('ws');

function startWss(config) {
    console.info(chalk.yellow('Starting Web Socket Server'));
    return new Promise((resolve, reject) => {
        console.info(`Running WSS on ${config.port}`);
        try {
            const wss = new WebSocketServer({ port: config.port });
            console.log('WSS is listening on', config.port);
            resolve(wss);
        } catch(error) {
            reject(error);
        }
    });
}

exports.startWss = startWss;
