import { webSocket } from 'rxjs/webSocket';

const { protocol, host } = window.location;

let url: string = process.env.VUE_APP_WSS_URL as string; 
if (!url || url.length === 0) {
    url = `${protocol.replace('http', 'ws')}//${host}`;
};

const subject = webSocket({
    url, 
    binaryType: 'arraybuffer',
    serializer: m => m as any,
    deserializer: (e: MessageEvent) => e as any
});

export const api = subject;
