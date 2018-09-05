'use strict';

import chalk from 'chalk';
import { Server } from 'ws';

export function startWss(config: {port: number}): Promise<Server> {
    console.info(chalk.yellow('Starting Web Socket Server'));
    return new Promise((resolve, reject) => {
        console.info(`Running WSS on ${config.port}`);
        try {
            const wss = new Server({ port: config.port });
            console.log('WSS is listening on', config.port);
            resolve(wss);
        } catch(error) {
            reject(error);
        }
    });
}
