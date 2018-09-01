import { ProtocolTable, $$types, $$getShiftTable, DYNAMIC_FIELD_SIZE_TYPE } from "./proto";

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

type ByteShiftTable = Array<[string, string, number, number, string?]>;

export abstract class Reader<T, M extends { slice(start: number, end: number): M }> {
    private readonly instance: T;
    private readonly protocolTable: ProtocolTable;

    constructor(private C: { new(): T }){
        this.instance = new C();
        this.protocolTable = (this.instance as any)[$$getShiftTable]();
    }

    private calculateByteShiftTable(msg0: M): ByteShiftTable{
        let shift: number = 0;
        let size_before:  number = 0;
        const pt = this.protocolTable;
        return pt.map(([name, type, originalType], index) => {
            let size: number = types.has(type) ? types.get(type): -1;
            console.log('size', size);
            // find the actual size for dynamic fields such as string or bson
            for(let i = index - 1; size === -1 && i >= 0; i--) {
                if(pt[i][0] === type) {
                    console.log('reading size', pt[i][0], DYNAMIC_FIELD_SIZE_TYPE);
                    size = this.readAsNumber(msg0, DYNAMIC_FIELD_SIZE_TYPE);
                }
            }
            shift += size_before;
            size_before = size;
            return [name, type, size, shift, originalType] as any;
        });
    };

    public read(msg0: M): T {
        const bst: ByteShiftTable = this.calculateByteShiftTable(msg0);
        console.log(bst);
        const c = new this.C();
        const propType = (c as any)[$$types] || {};
        for (let propName of Object.keys(propType)){
            const [_, type, size, shift, originalType] = bst.find(([h]) => h === propName);
            const cp = c as any;
            if (size > 0) {
                const buf = msg0.slice(shift, shift + size);
                cp[propName] = 
                    originalType === 'BSON' ?       this.readAsJSON(buf as M):
                    originalType === 'String' ?     this.readAsString(buf as M):
                    /* Everything else */   this.readAsNumber(buf as M, type);
            }
        }
        return c;
    };

    // ArrayBuffer implementation
    // return (msg as any)[`read${type}`]() as number;
    public abstract  readAsNumber(msg: M, type: string): number;

    // ArrayBuffer implementation
    // return msg.toString();
    public abstract readAsString(msg: M): string;
    
    public abstract readAsJSON<JSON>(msg: M): JSON;
}