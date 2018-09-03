import { Reader, byteMap } from 'bytable';
import { BSON } from 'bson';

const bson = new BSON();

export class BufferReader<C> extends Reader<C, Buffer> {
    readAs<T>(msg: Buffer, type: string): T {
        if(byteMap.has(type)) {
            return (msg as any)[`read${type}`]() as any;
        }
        if(type === 'BSON') {
            return bson.deserialize(msg);
        }
        return msg.toString('UTF8') as any;
    }
}
