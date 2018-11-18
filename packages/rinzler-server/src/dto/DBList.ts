import { proto, str, bson } from 'bytable';
import { REQUEST_TYPE } from  './common';
import { TReq } from './TReq';

// DB List
export const DBListReq = TReq;

@proto
export class DBList {
    @str
    id: string;

    @bson
    list: {};
}