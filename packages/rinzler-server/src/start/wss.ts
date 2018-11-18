import { yorker } from 'yorker';
import { Server } from 'ws';

export function startWss(config: {port: number}): Promise<Server> {
    return new Promise((resolve, reject) => {
        const say = yorker.sees(`🚕 Running WSS`);
        try {
            const wss = new Server({ port: config.port });
            say('WSS is listening on ' + config.port);
            resolve(wss);
        } catch(error) {
            say('Failed', error);
            reject(error);
        }
    });
}
