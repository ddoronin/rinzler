'use strict';

const { BSON } = require('bson');

const bson = new BSON();

class Codec { 
    constructor(protoReader, msg0) {
        this.protoReader = protoReader;
        this.msg0 = msg0;
        this.bst = protoReader.getByteShiftTable(msg0);
    }
}

Codec.prototype.read = function(header) {
    const msg0 = this.msg0;
    const [_, __, size, shift] = this.bst.find(([h]) => h === header);
    if (size > 0) {
        return msg0.slice(shift, shift + size);
    }
    return null;
};

Codec.prototype.readAsString = function(header) {
    return this.read(header).toString();
};

Codec.prototype.readAsJSON = function(header) {
    return bson.deserialize(this.read(header));
};

exports.Codec = Codec;
