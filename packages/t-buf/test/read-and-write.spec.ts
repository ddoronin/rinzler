import { expect, assert } from 'chai';
import { proto, uint8, uint16, uint32, bson, string } from '../src';
import { Reader } from '../src/Reader';
import { Writer } from '../src/Writer';

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

    class BufferWriter<T> extends Writer<T, Buffer> {
        protected alloc(size: number): Buffer {
            return Buffer.allocUnsafe(size);
        }

        protected dynamicToBinary(type: string, value: any): any {
            if(type === 'String'){
                return Buffer.from(value as string, 'UTF8');
            }
            return null;
        }
        protected writeAs(m: Buffer, type: string, value: any, shift: number): any {
            if(type === 'binary') {
                m.fill(value as Buffer, shift);
            } else (m as any)[`write${type}`](value, shift);
        }
    }

    @proto
    class TestMessage {
        @string
        str: string;

        @uint8
        index: number;

        @uint16
        count: number;
    }

    const reader = new BufferReader(TestMessage);
    const writer = new BufferWriter(TestMessage);

    it('should create a binary message and parse it back', () => {
        const message = new TestMessage();
        message.str = 'Hello, World!';
        message.index = 42;
        message.count = 777;
        const buf = writer.write(message);
        const actualMessage: TestMessage = reader.read(buf);
        expect(actualMessage).to.deep.eq(message);
    });
});