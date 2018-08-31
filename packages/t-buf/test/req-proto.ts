import { proto } from './index';

export interface IFindQuery {
}

export interface IProjection {
}

export interface IPayload {
    readonly collection: string;
    readonly find?: IFindQuery;
    readonly projection?: IProjection;
}

@proto
export class Req {
    readonly requestId: string;
    readonly payload: IPayload;
}
