'use strict';

const TYPES = {
    UInt8: 1,
    UInt16BE: 2,
    UInt32BE: 4
}

class ProtoReader {
    constructor(protocol){
        this.protocol = protocol;
    }

    getByteShiftTable(msg0){
        let p = this.protocol;
        let shift = 0;
        let size_before = 0;
        return p.map(([name, type], index) => {
            let size = TYPES[type];
            for(let i = index - 1; !size && i >= 0; i--) {
                if(p[i][0] === type) size = msg0[`read${p[i][1]}`]();
            }
            shift += size_before;
            size_before = size;
            return [name, type, size, shift];
        });
    };
}

exports.ProtoReader = ProtoReader;