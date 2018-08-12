import { BSON } from 'bson';
import { Buffer } from 'buffer';

const bson = new BSON();
const ws = new WebSocket('ws://localhost:8080/');
ws.binaryType = 'arraybuffer';
console.info('Connecting...');
ws.onopen = function () {
    console.info('Connected!');
    ws.send('Hello, dude! I am javascript');
    ws.onmessage = ({data}) => {
        console.info('received:', data);
        if(typeof data === 'object'){
            const before = Date.now();
            console.info(bson.deserialize(Buffer.from(data)));
            console.log(`${Date.now() - before}ms`);
        }
    };
}
