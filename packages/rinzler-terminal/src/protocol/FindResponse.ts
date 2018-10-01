import { proto, str, b } from 'bytable';
import { Codec } from 'bytable-client';

@proto
export class FindResponse {
    @str
    id: string;

    @b
    data: ArrayBuffer;
}

export const findResponseCodec = new Codec(FindResponse);
