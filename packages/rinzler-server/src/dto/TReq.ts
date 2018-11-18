import { proto, str } from 'bytable';
import { REQUEST_TYPE } from  './common';

@proto
export class TReq {
    @str 
    id: string;

    @str
    type: REQUEST_TYPE;
}