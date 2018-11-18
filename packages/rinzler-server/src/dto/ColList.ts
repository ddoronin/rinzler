import { proto, str, bson } from 'bytable';
import { REQUEST_TYPE } from  './common';

@proto
export class ColListReq {
    @str 
    id: string;

    @str
    type: REQUEST_TYPE;

    @str
    db: string;
}

@proto
export class ColList {
    @str
    id: string;

    @bson
    list: {};
}
