import { Codec, proto, str, bson } from 'bytable-node';
import uuidv4 from 'uuid/v4';

@proto
export class FindRequest {
    @str
    id: string = uuidv4();

    @str
    db: string;

    @str
    collection: string;

    @bson
    find: {};

    @bson
    options: {};
}

export const findRequestCodec = new Codec(FindRequest);
