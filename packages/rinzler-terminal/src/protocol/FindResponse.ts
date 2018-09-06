import { Codec, proto, str, bson } from 'bytable-node';
import { DataViewReader } from 'bytable-client/lib/DataViewReader';

@proto
export class FindResponse {
    @str
    id: string;

    @bson
    data: {};
}

export const findResponseReader = new DataViewReader(FindResponse);