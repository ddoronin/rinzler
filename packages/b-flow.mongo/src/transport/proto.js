'use strict';

exports.REQ = [
    ['MARKER_SIZE', 'UInt8'],
    ['MARKER',      'MARKER_SIZE'],
    ['BODY_SIZE',   'UInt32BE'],
    ['BODY',        'BODY_SIZE'],
];

exports.RES = [
    ['MARKER_SIZE', 'UInt8'],
    ['MARKER',      'MARKER_SIZE'],
    ['STATUS',      'UInt8'],
    ['INDEX',       'UInt16BE'],
    ['BODY_SIZE',   'UInt32BE'],
    ['BODY',        'BODY_SIZE'],
];

exports.STATUS = {
    Ok: 0,
    Error: 1,
    Completed: 2
};
