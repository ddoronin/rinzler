import { proto, bson, str } from 'bytable';
import { Codec } from 'bytable-client';
import { v4 } from 'uuid';
import { IRequest } from './Request';

@proto
export class DataBaseListRequest implements IRequest {
    @str 
    public id: string = v4();

    @str
    public type: string = 'db_list';

    public write = () => Codec.create(DataBaseListRequest).write(this);
}

export interface IDB {
    name: string,
    sizeOnDisk: number,
    empty: boolean
}

@proto
export class DataBaseList {
    @str
    public id!: string;

    @bson
    public list!: IDB[];

    public static read = (buf: ArrayBuffer): DataBaseList => Codec.create(DataBaseList).read(buf);
}
