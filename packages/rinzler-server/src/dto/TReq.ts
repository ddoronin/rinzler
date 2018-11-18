import { proto, str } from 'bytable';
import { Codec } from 'bytable-node';
import { REQUEST_TYPE } from  './common';

@proto
export class TReq {
    @str 
    id: string;

    @str
    type: REQUEST_TYPE;
}

export const reqC = new Codec(TReq);
