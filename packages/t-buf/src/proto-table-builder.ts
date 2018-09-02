import { ProtoTable } from './ProtoTable';
import { byteMap } from './utils';

export type FieldName = string;
export type FieldType = string;
export type TypedFieldsMap = Map<FieldName, FieldType>;

/**
 * Static Types - 
 * types with fixed memory space, e.g. 
 * UInt8, Int8, UInt16, etc.
 */
const staticTypes = new Set(byteMap.keys());

/**
 * Dynamic Types - 
 * should be prefixed with UInt32BE describing the memory space requirements.
 * Example of dynamic types: String, BSON.
 */
const getDynamicSizeField = (fieldName: string) => `${fieldName}_SIZE`;
export const DYNAMIC_SIZE_TYPE = 'UInt32BE';

const validateInput = (typedFields: TypedFieldsMap) => {
    if(!typedFields || typedFields.size === 0) {
        throw new Error('No fields to map found. Please use decorators to mark the fields.');
    }
};

/**
 * Returns ProtoTable describing types of given fields.
 * @param { TypedFieldsMap } typedFields - mapping between feilds and their types.
 */
export function build(typedFields: TypedFieldsMap): ProtoTable {
    validateInput(typedFields);

    const protoTable: ProtoTable = [];
    for (let field of typedFields.keys()){
        const type = typedFields.get(field);
        if (staticTypes.has(type)) protoTable.push([field, type]);
        else {
            const dsField = getDynamicSizeField(field);

            /** Example:
             * [ 'requestId_SIZE', 'UInt32BE' ], 
             * [ 'requestId',      'requestId_SIZE',   'String' ],
             */
            protoTable.push([dsField,   DYNAMIC_SIZE_TYPE]);
            protoTable.push([field,     dsField,            type]);
        }
    }
    return protoTable;
}