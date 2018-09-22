import { FindRequest, findRequestCodec } from '../protocol/FindRequest';
import { FindResponse, findResponseCodec } from '../protocol/FindResponse';

export function createFindRequest<T>(
    api: {
        ws: WebSocket,
        term: any,
    },
    req: {
        db: string, 
        collection: string, 
        find: {}, 
        options?: {}
    }): string {

    const msg = new FindRequest<T>();
    msg.db = req.db;
    msg.collection = req.collection;
    msg.find = req.find;
    msg.options = req.options;
    const find$msg = findRequestCodec.write(msg);
    api.term.printLine(`sending ${find$msg.byteLength} bytes...`);
    api.ws.send(find$msg);
    return msg.id;
}

export function handleFindResponse(api: {
    ws: WebSocket,
    term: any,
}, data: any) {
    api.term.printLine(JSON.stringify(findResponseCodec.read(data)));
}