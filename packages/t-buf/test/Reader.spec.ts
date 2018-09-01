import { expect, assert } from 'chai';
import { proto, uint8, uint16, uint32, bson, string } from '../src';
import { Reader } from '../src/Reader';

describe('Reader for nodejs', () => {
    class BufferReader<T> extends Reader<T, Buffer> {
        public readAsNumber(msg: Buffer, type: string): number {
            return (msg as any)[`read${type}`]() as number;
        }

        public readAsString(msg: Buffer): string {
            return msg.toString();
        }
        
        public readAsJSON<JSON>(msg: Buffer): JSON {
            return {} as JSON;
        }
    }

    @proto
    class TestMessage {
        @string
        readonly str: string;

        @uint8
        readonly index: number;

        @uint16
        readonly count: number;
    }

    const reader = new BufferReader(TestMessage);

    it('should parse test message', () => {
        const b = Buffer.allocUnsafe(100);
        let s = Buffer.from('Hello, World!');
        b.writeUInt32BE(s.byteLength, 0);
        b.fill(s, 4);
        b.writeUInt8(42, s.byteLength + 4);
        b.writeUInt16BE(777, 1 + s.byteLength + 4);
        const m = reader.read(b);
        expect(m.str).to.eq('Hello, World!');
        expect(m.index).to.eq(42);
        expect(m.count).to.eq(777);
    });
});