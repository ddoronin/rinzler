export const $$getShiftTable: symbol = Symbol('getShiftTable');
export const $$types: symbol = Symbol('types');

const DYNAMIC_FIELD_TYPES = ['BSON', 'String'];
export const DYNAMIC_FIELD_SIZE_TYPE = 'UInt32BE';
const DYNAMIC_FIELD_SIZE_NAME = (ref: string) => `${ref}_SIZE`;

export type ProtocolTable = Array<[string, string, string?]>;

export function proto<T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
        [$$getShiftTable](): ProtocolTable {
            const shiftTable: ProtocolTable = [];
            const propType = (this as any)[$$types] || {};
            for (let propName of Object.keys(propType)){
                const shift = [propName];
                const type = propType[propName];
                if (!DYNAMIC_FIELD_TYPES.includes(type)) shift.push(type);
                else {
                    const dynamicSize = DYNAMIC_FIELD_SIZE_NAME(propName);
                    shiftTable.push([dynamicSize, DYNAMIC_FIELD_SIZE_TYPE] as any);
                    shift.push(dynamicSize);
                    shift.push(type);
                }
                shiftTable.push(shift as any);
            }
            return shiftTable;
        }
    }
}
