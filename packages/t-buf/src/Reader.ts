import { ProtoTable, ByteShiftProtoTable } from './ProtoTable';
import { byteMap, DYNAMIC_SIZE_TYPE } from './types';
import { $$types, $$getShiftTable } from './proto';

const SIZE_UNKNOWN = -1;

/**
 * Computes byte shift protocol table for static and dynamic types.
 * For dynamic types it reads size from a supplementary UInt32BE field.
 * @param { BinaryMessage } msg0 - binary message.
 * @param { ProtoTable } protoTable - protocol table.
 * @param readAsNumber - binary reader.
 * @param slice - binary slicer.
 */
export function buildByteShiftProtoTable<BinaryMessage>(
    msg0: BinaryMessage,
    protoTable: ProtoTable,
    readAsNumber: (m: BinaryMessage, type: string, size: number) => number,
    slice: (m: BinaryMessage, start: number, end: number) => BinaryMessage
): ByteShiftProtoTable {
    let shift: number = 0;
    let size_before:  number = 0;
    let byteShift: ByteShiftProtoTable = [];
    for (let [index, [name, type, origin]] of protoTable.entries()) {
        const isStatic = byteMap.has(type);
        let size: number = isStatic ? byteMap.get(type): SIZE_UNKNOWN;
        /**
         * Example of dynamic:
         * [...
         *  [ 'requestId_SIZE', 'UInt32BE' ],
         *  [ 'requestId',      'requestId_SIZE',   'String' ],
         * ...]
         */
        for(let i = index - 1; size === SIZE_UNKNOWN && i >= 0; i--) {
            if(protoTable[i][0] === type) {
                const msg_shift = byteShift[i][3];
                const msg_size  = byteShift[i][2];
                const msg_type  = byteShift[i][1];
                const msg_slice = slice(msg0, msg_shift, msg_shift + msg_size);
                size = readAsNumber(msg_slice, msg_type, msg_size);
            }
        }
        shift += size_before;
        size_before = size;
        if (origin) byteShift.push([name, origin, size, shift]);
        else        byteShift.push([name, type,   size, shift]);
    }
    return byteShift;
}

export abstract class Reader<T, M extends { slice(start: number, end: number): M }> {
    private readonly instance: T;
    private readonly protocolTable: ProtoTable;

    constructor(private C: { new(): T }) {
        this.instance = new C();
        this.protocolTable = (this.instance as any)[$$getShiftTable]();
    }

    public read(msg0: M): T {
        const bspt = buildByteShiftProtoTable(msg0, this.protocolTable, this.readAs as any, (_, s, e) => msg0.slice(s,e));
        const c = new this.C();
        const propType = (c as any)[$$types] as Map<string, string>;
        for (let propName of propType.keys()){
            const [_, type, size, shift] = bspt.find(([h]) => h === propName);
            const cp = c as any;
            if (size > 0) {
                const buf = msg0.slice(shift, shift + size);
                cp[propName] = this.readAs(buf as M, type);
            }
        }
        return c;
    };

    protected abstract readAs<T>(msg: M, type: string): T;
}
