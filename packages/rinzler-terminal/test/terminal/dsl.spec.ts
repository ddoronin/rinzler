import { expect } from 'chai';
import { find } from '../../src/terminal/dsl';

describe('terminal/dsl', () => {
    it('should return empty object when nothing is entered', () => {
        expect(find([])).to.deep.eq([{}]);
        // or
        expect(find()).to.deep.eq([{}]);
    });

    it('should handle {"a": "b"}', () => {
        expect(find('{"a": "b"}'.split(' '))).to.deep.eq([
            {a: 'b'}
        ]);
    });

    it('should handle single quoted {\'a\': \'b\'}', () => {
        expect(find('{\'a\': \'b\'}'.split(' '))).to.deep.eq([
            {a: 'b'}
        ]);
    });

    it('should handle unquoted {a: \'b\'}', () => {
        expect(find('{a: \'b\'}'.split(' '))).to.deep.eq([
            {a: 'b'}
        ]);
    });

    it('should handle unquoted {a: 42}', () => {
        expect(find('{a: 42}'.split(' '))).to.deep.eq([
            {a: 42}
        ]);
    });

    it('should handle several objects {a: 42} {b: 777}', () => {
        expect(find('{a: 42} {b: 777}'.split(' '))).to.deep.eq([
            {a: 42},
            {b: 777}
        ]);
    });
});