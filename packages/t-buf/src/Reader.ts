import { ProtocolTable, $$types, $$getShiftTable } from "./proto";

const types = new Map<string, number>([
    ['UInt8',       1],
    ['UInt16BE',    2],
    ['UInt32BE',    4],

    ['Int8',        1],
    ['Int16BE',     2],
    ['Int32BE',     4],

    ['FloatBE',     4],
    ['DoubleBE',    8],
]);

type BinaryMessage = ArrayBuffer;
type ByteShiftTable = Array<[string, string, number, number]>;

export abstract class Reader<T> {
    private readonly instance: T;
    private readonly protocolTable: ProtocolTable;

    constructor(private C: {new(): T;}){
        this.instance = new C();
        this.protocolTable = (this.instance as any)[$$getShiftTable]();
    }

    private calculateByteShiftTable(msg0: BinaryMessage): ByteShiftTable{
        let shift: number = 0;
        let size_before:  number = 0;
        const pt = this.protocolTable;
        return pt.map(([name, type], index) => {
            let size: number = types.has(type) ? types.get(type): -1;
            // let's find the actual size
            for(let i = index - 1; size === -1 && i >= 0; i--) {
                if(pt[i][0] === type) 
                    size = ((msg0 as any)[`read${pt[i][1]}`]()) as number;
            }
            shift += size_before;
            size_before = size;
            return [name, type, size, shift] as any;
        });
    };

    public read(msg0: BinaryMessage): T {
        const bst: ByteShiftTable = this.calculateByteShiftTable(msg0);
        const c = new this.C();
        const propType = (c as any)[$$types] || {};
        for (let propName of Object.keys(propType)){
            const [_, type, size, shift] = bst.find(([h]) => h === propName);
            if (size > 0) {
                const buf = msg0.slice(shift, shift + size);
                if(type === 'BSON'){
                    (c as any)[propName] = this.readAsJSON(buf as any);
                } else if(type === 'String'){
                    (c as any)[propName] = this.readAsString(buf as any);
                } else {
                    (c as any)[propName] = this.readAsNumber(buf as any);
                }
            }
        }
        return c;
    };

    public readAsNumber(msg: ArrayBuffer, type: string): number {
        return (msg as any)[`read${type}`]() as number;
    }

    public readAsString(msg: ArrayBuffer): string {
        return msg.toString();
    };
    
    public abstract readAsJSON<JSON>(msg: ArrayBuffer): JSON;
}
