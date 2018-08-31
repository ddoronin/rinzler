export const $$getShiftTable: symbol = Symbol('getShiftTable');
export const $$types: symbol = Symbol('types');

const DYNAMIC_FIELD_TYPE = 'BSON';
const DYNAMIC_FIELD_SIZE_TYPE = 'UInt32BE';

export function proto<T extends {new(...args:any[]):{}}>(constructor: T) {
    return class extends constructor {
        [$$getShiftTable]() {
            const shiftTable = [];
            const propType = (this as any)[$$types] || {};
            const propNames =  Object.keys(propType);
            for(let i = 0, len = propNames.length; i < len; i++) {
                const propName = propNames[i];
                const shift = [propName];
                const type = propType[propName];
                if (type !== DYNAMIC_FIELD_TYPE) shift.push(type);
                else {
                    const dynamicSize = `${propName}_SIZE`;
                    shiftTable.push([dynamicSize, DYNAMIC_FIELD_SIZE_TYPE]);
                    shift.push(dynamicSize);
                }
                shiftTable.push(shift);
            }
            return shiftTable;
        }
    }
}
