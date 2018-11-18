import { proto, str, bson, binary } from 'bytable';
import { REQUEST_TYPE } from  './common';
import { TReq } from './TReq';

// Find in collection
@proto
export class FindReq {
    @str
    id: string;

    @str
    type: REQUEST_TYPE;

    @str
    db: string;

    @str
    collection: string;

    @bson
    find: {};

    @bson
    options: {};
}

@proto
export class Found {
    @str
    id: string;

    @binary
    data: {};
}
