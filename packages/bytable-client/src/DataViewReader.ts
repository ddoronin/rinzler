import { Reader, byteMap } from 'bytable';
import { BSON } from 'bson';
import { Buffer } from 'buffer';

const bson = new BSON();

export class DataViewReader<C> extends Reader<C, ArrayBuffer> {
    // TODO: instead of sliced array buffer pass shifts!
    readAs<T>(msg0: ArrayBuffer, type: string): T {
        if(byteMap.has(type)) {
            const msg = new DataView(msg0);
            switch(type){
                case 'UInt8': 
                    return msg.getUint8(0) as any;
                case 'UInt16BE':
                    return msg.getUint16(0) as any;
                case 'UInt32BE':
                    return msg.getUint32(0) as any;

                case 'Int8': 
                    return msg.getInt8(0) as any;
                case 'Int16BE':
                    return msg.getInt16(0) as any;
                case 'Int32BE':
                    return msg.getInt32(0) as any;

                case 'FloatBE': 
                    return msg.getFloat32(0) as any;
                case 'DoubleBE':
                    return msg.getFloat64(0) as any;
            }
        }
        if(type === 'BSON') {
            return bson.deserialize(Buffer.from(msg0));
        }
        return Buffer.from(msg0).toString('UTF8') as any;
    }
}
