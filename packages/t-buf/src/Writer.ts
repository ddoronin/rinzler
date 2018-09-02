import { ProtoTable } from './ProtoTable';
import { $$getShiftTable } from "./proto";
import { byteMap } from './utils';

type ByteShiftTable = Array<[string, number, any]>;

export abstract class Writer<T, M> {
    private readonly instance: T;
    private readonly protocolTable: ProtoTable;

    constructor(private C: { new(): T }){
        this.instance = new C();
        this.protocolTable = (this.instance as any)[$$getShiftTable]();
    }

    private buildByteShiftTable(obj: T) {
        const o = obj as any;
        let n = this.protocolTable.length;
        let table = new Array(n).fill([]);
        while (n --> 0) {
            if(table[n].length !== 0) continue;

            const [ fieldName, type, dynamicType ] = this.protocolTable[n];
            if (dynamicType) {
                const binary = this.dynamicToBinary(dynamicType, o[fieldName]) as { byteLength: number };
                const byteLength = binary.byteLength
                table[n] = [
                    'binary', 
                    byteLength, 
                    binary
                ];
                let j = n; 
                while (j --> 0)
                    if (this.protocolTable[j][0] === type) {
                        table[j] = [
                            this.protocolTable[j][1], 
                            byteMap.get(this.protocolTable[j][1]), 
                            byteLength
                        ];
                        j = 0;
                    }
            } else {
                table[n] = [
                    type, 
                    byteMap.get(type), 
                    o[fieldName]
                ];
            }
        }
        return table;

    }

    public write(obj: T): M {
        const table = this.buildByteShiftTable(obj);
        const totalSize = table.reduce((size, [_, shift]) => size + shift,0);
        const buffer = this.alloc(totalSize);
        let shift = 0;
        table.forEach(([type, size, value]) => {
            this.writeAs(buffer, type, value, shift);
            shift += size as number;
        });
        return buffer;
    };

    protected abstract alloc(size: number): M;
    protected abstract dynamicToBinary(type: string, value: any): any;
    protected abstract writeAs(m: M, type: string, value: any, shift: number): any;
}
