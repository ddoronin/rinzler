import { ProtoTable } from './ProtoTable';
import { $$types, $$getShiftTable } from './proto';
import { fromBinary } from './byte-table-builder';

export abstract class Reader<T, M extends { slice(start: number, end: number): M }> {
    private readonly instance: T;
    private readonly protocolTable: ProtoTable;

    constructor(private C: { new(): T }) {
        this.instance = new C();
        this.protocolTable = (this.instance as any)[$$getShiftTable]();
    }

    public read(msg0: M): T {
        // Create empty instance of class "C".
        const c = new this.C();

        // Compute byte table from binary message.
        const byteTable = fromBinary(msg0, this.protocolTable, this.readAs as any, (_, s, e) => msg0.slice(s,e));
        const typedFields = (c as any)[$$types] as Map<string, string>;

        // Iterate through the byte table and assign parsed values to object properties.
        for (let [index, [field, type, size, shift]] of byteTable.entries()) {
            // Assign only typed fields!
            // Don't assign fields-companions created for dynamics.
            if (typedFields.has(field) && size > 0) {
                const buf = msg0.slice(shift, shift + size);
                (c as any)[field] = this.readAs(buf as M, type);
            }
        }

        return c;
    };

    protected abstract readAs<T>(msg: M, type: string): T;
}
