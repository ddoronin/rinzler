/**
 * Describes protocol for binary presentation.
 * One of the ultimate roles of any type is to give information 
 * about how much bytes will be required for binary presentation 
 * of a given variable value.
 * 
 * e.g. typical REST Request can be described as:
 
 * +------------------+-------------------+------------+
 * |  FIELD           | TYPE              | ORIGIN     |
 * +------------------+-------------------+------------+
 * 
 * [[ 'requestId_SIZE', 'UInt32BE' ],                   // dynamic type
    [ 'requestId',      'requestId_SIZE',   'String' ], // of size requestId_SIZE
    [ 'index',          'UInt8' ],
    [ 'count',          'UInt16BE' ],
    [ 'payload_SIZE',   'UInt32BE' ],                   // dynamic type
    [ 'payload',        'payload_SIZE',     'BSON' ]]   // of size requestId_SIZE
 */

export type Field       = string;
export type Type        = string;
export type Origin      = string;
export type ProtoTable  = Array<[Field, Type, Origin?]>;
