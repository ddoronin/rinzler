import { webSocket } from 'rxjs/webSocket';

const subject = webSocket({
    url: 'ws://localhost:8080', 
    binaryType: 'arraybuffer',
    serializer: m => m as any,
    deserializer: (e: MessageEvent) => e as any
});

export const api = subject;
