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

const bson = new BSON();
const ws = new WebSocket('ws://localhost:8080/');
ws.binaryType = 'arraybuffer';
console.info('Connecting...');
ws.onopen = function () {
    console.info('Connected!');

    // ['MARKER_SIZE', 'UInt8'],
    // ['MARKER',      'MARKER_SIZE'],
    // ['BODY_SIZE',   'UInt32BE'],
    // ['BODY',        'BODY_SIZE'],

    const marker = Buffer.from('request id');
    const markerSize = marker.length;

    const body = bson.serialize({
        collection:'startup_log',
        options: {
            fields: {_id: 0, startTime: 1}
        }
    });
    const bodySize = body.length;

    const msg = new Buffer(1 + markerSize + 4 + bodySize);
    msg.writeUInt8(markerSize, 0);
    console.info(`markerSize ${markerSize}`);
    msg.fill(marker, 1);
    msg.writeUInt32BE(bodySize, 1 + markerSize);
    console.info(`bodySize ${markerSize}`);
    msg.fill(body, 1 + markerSize + 4);

    ws.send(msg);
    // ws.onmessage = ({data}) => {
    //     if(data instanceof ArrayBuffer){
    //         const buffer = Buffer.from(data);
    //         console.log(`STATUS CODE:       ${buffer.readUInt8(0)}`);
    //         console.log(`DOCUMENT INDEX:    ${buffer.readUInt16BE(1)}`);
    //         const size = buffer.readUInt32BE(3);
    //         console.log(`DOCUMENT SIZE:     ${size}`);
    //         console.info('DOCUMENT', size > 0 ? fromBSON(buffer.slice(7)): 0);
    //     }
    // };
}
