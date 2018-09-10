import { proto, str, bson } from 'bytable';
import { DataViewReader } from 'bytable-client/lib/DataViewReader';

@proto
export class Response {
    @str
    id: string;
}

export const responseReader = new DataViewReader(Response);