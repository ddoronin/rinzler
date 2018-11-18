import { proto, bson, str } from 'bytable';
import { Codec } from 'bytable-client';
import { v4 } from 'uuid';
import { IRequest } from './Request';

@proto
export class FindRequest implements IRequest {
    @str 
    public id: string = v4();

    @str
    public type: string = 'db_find';

    @str
    public db!: string;

    @str
    public collection!: string;

    @bson
    public find!: {};

    @bson
    public options!: {};

    public write = () => Codec.create(FindRequest).write(this);
}

@proto
export class Found {
    @str
    public id!: string;

    @bson
    public data!: {};

    public static read = (buf: ArrayBuffer): Found => Codec.create(Found).read(buf);
}
