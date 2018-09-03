import { $$types } from './proto';

function isInitialize(map: any): map is Map<string, string> {
    return typeof map !== 'undefined';
}

const _ = (type: string) => (o: any, fieldName: string | symbol): void => {
    if(!isInitialize(o[$$types])) {
        o[$$types] = new Map<string, string>();
    }
    o[$$types].set(fieldName, type);
}

export const DYNAMIC_SIZE_TYPE = 'UInt32BE';

// Integer
export const uint8  = _('UInt8');
export const uint16 = _('UInt16BE');
export const uint32 = _('UInt32BE');

export const int8   = _('Int8');
export const int16  = _('Int16BE');
export const int32  = _('Int32BE');

// Float & Double
export const float  = _('FloatBE');
export const double  = _('DoubleBE');

// Boolean
export const boolean  = uint8;

// BSON
export const bson = _('BSON');

// String
export const string = _('String');

export const byteMap = new Map<string, number>([
    ['UInt8',       1],
    ['UInt16BE',    2],
    ['UInt32BE',    4],

    ['Int8',        1],
    ['Int16BE',     2],
    ['Int32BE',     4],

    ['FloatBE',     4],
    ['DoubleBE',    8],
]);
