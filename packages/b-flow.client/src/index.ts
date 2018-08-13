import { BSON } from 'bson';
import { Buffer } from 'buffer';

const fromBSON = (data: Buffer): Object => {
    const before = Date.now();
    try{
        return bson.deserialize(data);
    } finally{
        console.log(`${Date.now() - before}ms`);
    }
}

const PAYLOAD_SIZE = 1; // byte

const bson = new BSON();
const ws = new WebSocket('ws://localhost:8080/');
ws.binaryType = 'arraybuffer';
console.info('Connecting...');
ws.onopen = function () {
    console.info('Connected!');
    const buffer = bson.serialize({
        collection:'startup_log',
        options: {
            fields: {_id: 0, startTime: 1}
        }
    });
    console.log('Buffer.isBuffer', Buffer.isBuffer(buffer));
    const bodySize = buffer.length;
    console.log('bodySize', bodySize)
    const msg = new Buffer(PAYLOAD_SIZE + bodySize);
    msg.writeUInt8(bodySize, 0);
    msg.fill(buffer, PAYLOAD_SIZE)
    ws.send(msg);
    ws.onmessage = ({data}) => {
        if(data instanceof ArrayBuffer){
            const buffer = Buffer.from(data);
            console.log(`STATUS CODE:       ${buffer.readUInt8(0)}`);
            console.log(`DOCUMENT INDEX:    ${buffer.readUInt16BE(1)}`);
            const size = buffer.readUInt32BE(3);
            console.log(`DOCUMENT SIZE:     ${size}`);
            console.info('DOCUMENT', size > 0 ? fromBSON(buffer.slice(7)): 0);
        }
    };
}
