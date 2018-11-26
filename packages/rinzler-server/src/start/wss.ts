import { yorker } from 'yorker';
import { Server } from 'ws';
import * as http  from 'http';
import * as https from 'https';

export function startWss(server: http.Server | https.Server) {
    const say = yorker.see(`🚕 Running WSS`);
    const wss = new Server({ server }, () => say('wss is ready'));
    return wss;
}
