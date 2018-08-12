import { BSON } from 'bson';
import { Buffer } from 'buffer';

const bson = new BSON();
const ws = new WebSocket('ws://localhost:8080/');
console.info('Connecting...');
ws.onopen = function () {
    console.info('Connected!');
    ws.send('Hello, dude! I am javascript');
    ws.onmessage = ({data}) => {
        console.info('received:', data);
        const before = Date.now();
        const reader = new FileReader();
        reader.onload = function(e) {
            console.info(bson.deserialize(Buffer.from(this.result)));
            console.log(`${Date.now() - before}ms`);
        }
        reader.readAsArrayBuffer(data);
    };
}
