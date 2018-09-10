import { proto, str, bson } from 'bytable';
import { Codec } from 'bytable-node';
import uuidv4 from 'uuid/v4';
import { FilterQuery, FindOneOptions } from 'mongodb';

@proto
export class FindRequest<T> {
    @str
    id: string = uuidv4();

    @str
    db: string;

    @str
    collection: string;

    @bson
    find: FilterQuery<T>;

    @bson
    options: FindOneOptions;
}

export const findRequestCodec = new Codec(FindRequest);
