import { proto, bson, str } from 'bytable';
import { Codec } from 'bytable-client';
import { v4 } from 'uuid';
import { IRequest } from './Request';

@proto
export class DBCollectionsRequest implements IRequest {
    @str 
    public id: string = v4();

    @str
    public type: string = 'db_collections';

    @str
    public db!: string;

    public write = () => Codec.create(DBCollectionsRequest).write(this);
}

export type IDBCol = string;

@proto
export class DBCollections {
    @str
    public id!: string;

    @bson
    public list!: IDBCol[];

    public static read = (buf: ArrayBuffer): DBCollections => Codec.create(DBCollections).read(buf);
}
