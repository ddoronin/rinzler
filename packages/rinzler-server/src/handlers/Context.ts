import { TReq } from '../dto';
import { MongoClient } from "mongodb";

export interface IContext {
    ws: WebSocket,
    mongoClient: MongoClient
}

export interface IHandler {
    (req: TReq, reqBuf: any, context: IContext): void
}
