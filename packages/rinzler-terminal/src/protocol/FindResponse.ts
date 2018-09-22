import { proto, str, bson } from 'bytable';
import { Codec } from 'bytable-client';

@proto
export class FindResponse {
    @str
    id: string;

    @bson
    data: {};
}

export const findResponseCodec = new Codec(FindResponse);
