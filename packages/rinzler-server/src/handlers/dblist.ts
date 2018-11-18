import { yorker } from 'yorker';
import { TReq , DBList, dbListC } from '../dto';
import { IContext } from './Context';

export function handleDBList(req: TReq, reqBuf: any, context: IContext) {
    const say = yorker.see('request db list')
    context.mongoClient.db('admin').admin().listDatabases((err, result) => {
        const dbList = new DBList();
        dbList.id = req.id;
        dbList.list = result.databases;
        context.ws.send(dbListC.write(dbList));
        say(JSON.stringify(dbList, null, '\t'));
    });
}