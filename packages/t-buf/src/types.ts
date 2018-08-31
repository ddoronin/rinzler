import { $$types } from './proto';

const _ = (t: string) => (o: any, propertyKey: string | symbol): void => {
    o[$$types] = o[$$types] || {};
    o[$$types][propertyKey] = t;
}

// Integer
export const uint8 = _('UInt8');
export const uint16 = _('UInt16BE');
export const uint32 = _('UInt32BE');

// BSON
export const bson = _('BSON');

// alias
export const u8 = uint8;
export const u16 = uint16;
export const u32 = uint32;
