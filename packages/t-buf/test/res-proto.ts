import { proto, uint8, uint32 } from './index';

export interface IDocument {
}

@proto
export class Res {
    readonly requestId: string;
    readonly document: IDocument;

    @uint8
    readonly status: number;

    @uint32
    readonly index: number;
}
