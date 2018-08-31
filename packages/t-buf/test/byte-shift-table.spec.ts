import { expect, assert } from 'chai';
import { proto, uint8, uint16, bson } from '../src';
import { $$getShiftTable } from '../src/proto';

interface IPayload {
    readonly collection: string;
    readonly find?: {};
    readonly projection?: {};
}

describe('byte shift table', () => {

    @proto
    class Req {
        @uint8
        requestId: string;

        @uint16
        readonly index: number;

        @uint16
        readonly count: number;

        @bson
        payload: IPayload;
    }

    it('should create ', () => {
        const req = new Req();
        req.payload = {collection: 'Hello', find: 'World!'};
        const shiftTable = (req as any)[$$getShiftTable]();
        expect(shiftTable).to.deep.eq([ 
            [ 'requestId',      'UInt8' ],
            [ 'index',          'UInt16BE' ],
            [ 'count',          'UInt16BE' ],
            [ 'payload_SIZE',   'UInt32BE' ],
            [ 'payload',        'payload_SIZE' ]
        ]);
    });
});
