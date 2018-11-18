import { yorker } from 'yorker';
import { TReq, Found, findReqC, foundC } from '../dto';
import { IContext } from "./Context";

export function handleDBFind(req: TReq, reqBuf: any, context: IContext) {
    const {
        db, collection, find, options
    } = findReqC.read(reqBuf);
    const say = yorker.see(`find in ${db} | ${collection}`);

    const readable = context.mongoClient
        .db(db)
        .collection(collection)
        .find(find, options);

    readable.on('readable', function() {
        const cursor = this;
        let chunk;
        while (null !== (chunk = cursor.read())) {
            const found = new Found();
            found.id = req.id;
            found.data = chunk;//zlib.gzipSync(chunk);
            const buf = foundC.write(found);
            say('response');
            (context.ws as any).send(buf, { binary: true });
        }
    });
}
