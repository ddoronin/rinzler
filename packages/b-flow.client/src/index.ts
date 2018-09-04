import { Buffer } from 'buffer';
import { Codec, proto, str, bson } from 'bytable-node';

@proto
class Request {
    @str
    id: string;

    @bson
    payload: {};
}

const requestCodec = new Codec(Request);

const ws = new WebSocket('ws://localhost:8080/');
ws.binaryType = 'arraybuffer';
console.info('Connecting...');
ws.onopen = function () {
    console.info('Connected!');
    const msg = new Request();
    msg.id = 'guid123';
    msg.payload = {
        a: 'test'
    };
    ws.send(requestCodec.write(msg));
    ws.onmessage = ({data}) => {
        if(data instanceof ArrayBuffer){
            const buffer = Buffer.from(data);
            console.log(buffer);
            console.debug(requestCodec.read(buffer as any));
        }
    };
}
