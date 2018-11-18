import { proto, bson, str } from 'bytable';
import { Codec } from 'bytable-client';

@proto
export class Response {
    @str
    public id!: string;

    public static read = (buf: ArrayBuffer): Response => Codec.create(Response).read(buf);
}