import { yorker } from 'yorker';
import { TReq, ColList, colsReqC, colsC } from '../dto';
import { IContext } from "./Context";

export function handleDBCollections(req: TReq, reqBuf: any, context: IContext) {
    const recol = colsReqC.read(reqBuf);
    const say = yorker.see(`request db collections for ${recol.db}`);
    context.mongoClient.db(recol.db).collections((err, result) => {
        let cols = result.map(_ => _.collectionName);
        say(JSON.stringify(cols, null, '\t'));
        const dbCol = new ColList();
        dbCol.id = req.id;
        dbCol.list = cols;
        context.ws.send(colsC.write(dbCol));
    });
}
    