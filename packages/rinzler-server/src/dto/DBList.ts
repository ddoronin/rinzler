import { proto, str, bson } from 'bytable';
import { Codec } from 'bytable-node';
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

export const dbListReqC = new Codec(DBListReq);
export const dbListC = new Codec(DBList);
