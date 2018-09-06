import { FindRequest, findRequestCodec } from '../protocol/FindRequest';
import { FindResponse, findResponseReader } from '../protocol/FindResponse';

export function createFindRequest(
    api: {
        ws: WebSocket,
        term: any,
    },
    req: {
        db: string, 
        collection: string, 
        find: {}, 
        options?: {}
    }) {

    const msg = new FindRequest();
    msg.db = req.db;
    msg.collection = req.collection;
    msg.find = req.find;
    msg.options = req.options;
    const find$msg = findRequestCodec.write(msg);

    api.term.printLine(`sending ${find$msg.byteLength} bytes...`);
    api.ws.send(find$msg);
    api.ws.onmessage = ({data}) => {
        if(data instanceof ArrayBuffer){
            api.term.printLine(`receving ${data.byteLength} bytes...`);
            api.term.printLine(JSON.stringify(findResponseReader.read(data)));
        }
    };
}