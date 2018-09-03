import { expect, assert } from 'chai';
import { proto, uint8, uint16, uint32, bson, string, u16 } from '../src';
import { Reader, buildByteShiftProtoTable } from '../src/Reader';
import { ProtoTable } from '../src/ProtoTable';

describe('Reader', () => {
    const str = (s: string): Buffer => Buffer.from(s);
    const u8_size = 1;
    const u16_size = 2;
    const u32_size = 4;

    describe('buildByteShiftProtoTable', () => {
        it('should handle statics', () => {
            // binary message
            const msg = Buffer.allocUnsafe(u8_size + u16_size + u32_size);
            msg.writeUInt8(11, 0);
            msg.writeUInt16BE(222, u8_size);
            msg.writeUInt32BE(3333, u16_size);

            // protocol
            const protoTable: ProtoTable = [
                ['a',    'UInt8'],
                ['b',    'UInt16BE'],
                ['c',    'UInt32BE']
            ];

            // bynary shift table
            const bst = buildByteShiftProtoTable(
                msg, 
                protoTable, 
                (m, type) => (m as any)[`read${type}`](0), 
                (_, s, e) => _.slice(s,e)
            );

            expect(bst).to.deep.eq([
            /**
             *  +-----------+-------------+------------+------------+
             *  | Field     | Type        | Size       | Shift      |
             *  +-----------+-------------+------------+------------+ */
                ['a',        'UInt8',       u8_size,     0],
                ['b',        'UInt16BE',    u16_size,    u8_size],
                ['c',        'UInt32BE',    u32_size,    u8_size + u16_size]
            ]);
        });

        it('should handle dynamics', () => {
            const s = str('Hello, World!');
            const s_size = s.byteLength;
            const u32_size = 4;

            // binary message
            const msg = Buffer.allocUnsafe(u32_size + s_size);
            msg.writeUInt32BE(s_size, 0);
            msg.fill(s, u32_size);

            // protocol
            const protoTable: ProtoTable = [
                ['size',    'UInt32BE'],
                ['str',     'size',     'String']
            ];

            // bynary shift table
            const bst = buildByteShiftProtoTable(
                msg, 
                protoTable, 
                (m, type) => (m as any)[`read${type}`](0), 
                (_, s, e) => _.slice(s,e)
            );

            expect(bst).to.deep.eq([
            /**
             *  +-----------+-------------+------------+------------+
             *  | Field     | Type        | Size       | Shift      |
             *  +-----------+-------------+------------+------------+ */
                ['size',     'UInt32BE',    u32_size,    0],
                ['str',      'String',      s_size,      u32_size]
            ]);
        });

        it('should handle statics and dynamics', () => {
            const s1 = str('Hello');
            const s1_size = s1.byteLength;

            const s2 = str('Binary JavaScript');
            const s2_size = s2.byteLength;

            const n16 = 42;
            //msg.writeUInt16BE(222, u8_size);
            // binary message
            const msg = Buffer.allocUnsafe(
                u32_size + s1_size + 
                u16_size + 
                u32_size + s2_size);

            msg.writeUInt32BE(s1_size, 0);
            msg.writeUInt32BE(s2_size, u32_size);
            msg.writeUInt16BE(n16, u32_size + u32_size);
            msg.fill(s1, u32_size + u32_size + u16_size);
            msg.fill(s2, u32_size + u32_size + u16_size + s1_size);

            // protocol
            const protoTable: ProtoTable = [
                ['size1',   'UInt32BE'],
                ['size2',   'UInt32BE'],
                ['num',     'UInt16BE'],
                ['str1',    'size1',     'String'],
                ['str2',    'size2',     'String']
            ];

            // bynary shift table
            const bst = buildByteShiftProtoTable(
                msg, 
                protoTable, 
                (m, type) => (m as any)[`read${type}`](0), 
                (_, s, e) => _.slice(s,e)
            );

            expect(bst).to.deep.eq([
            /**
             *  +-----------+-------------+------------+------------+
             *  | Field     | Type        | Size       | Shift      |
             *  +-----------+-------------+------------+------------+ */
                ['size1',    'UInt32BE',    u32_size,    0],
                ['size2',    'UInt32BE',    u32_size,    u32_size],
                ['num',      'UInt16BE',    u16_size,    u32_size + u32_size],
                ['str1',     'String',      s1_size,     u32_size + u32_size + u16_size],
                ['str2',     'String',      s2_size,     u32_size + u32_size + u16_size + s1_size]
            ]);
        });
    });

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
});
