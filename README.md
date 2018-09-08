[![Coverage Status](https://coveralls.io/repos/github/ddoronin/rinzler/badge.svg?branch=master)](https://coveralls.io/github/ddoronin/rinzler?branch=master)

# b-flow {1010}
**binary data flow over web sockets and HTTP/2**

```
npm install b-flow
```

## Motivation
Today in the World of Big Data and IoT one of the key challenges is how to store data so it could be queried effeciently in many different ways. Evolution of databases toward NoSQL helped to reduce overhead of normalization. Changes in data schema are not pain any more. To achive this, for instance, Mongo is relying on schema-less tree structure stored as binary JSON (BSON).

Traditionally back-end was required to parse database data (BSON for mongo), transform it into Java/C#/JavaScript or any other language objects in memory, than serialize in JSON and send it to a web browser over HTTP. All these layers of parsing, transformations and serializations take time and computational resources.

With `b-flow` it's not a case any more! Grab BSON and pass it throught as is!

## Proposition

Client-server communications in BSON over websockets or HTTP/2 should reduce web trafic and optimize back-end resources usage.

## What is BSON?

https://www.mongodb.com/blog/post/bson
> BSON is a binary serialization of JSON-like documents. BSON stands for “Binary JSON”, but also contains extensions that allow representation of data types that are not part of JSON. For example, BSON has a Date data type and BinData type.

> The key advantage over XML and JSON is efficiency (both in space and compute time), as it is a binary format.

> BSON can be compared to binary interchange formats, such as Protocol Buffers. BSON is more “schemaless” than Protocol Buffers – this being both an advantage in flexibility, and a slight disadvantage in space as BSON has a little overhead for fieldnames within the serialized BSON data.

## Why is Mongo?

MongoDB is a perfect example, because internally it's relying on BSON, every document is stored as BSON and can be passed throught in this raw binary format.

## Workflow

```
┌─────────┐ REQUEST ┌─────────┐ QUERY   ┌─────────┐
│ BROWSER │ ~~~~~~> │ SERVER  │ ~~~~~~> │  MONGO  │
└─────────┘ H+BSON  └─────────┘ BSON    └─────────┘
  ^  ^  ^                                   |
  |  !  :                              cursor.next() != Nil
  |  !  :                                   |
 READ BSON <---------------------------  { 1010 }
     !  :      STATUS [OK]                  |
     !  :      BODY   [BSON]                |
     !  :      INDEX  [0]                   |
     !  :                                   |
     !  :  ...    < N times >     ...  cursor.next() != Nil
     !  :                                   |
 READ BSON <---------------------------  { 1010 }
        :      STATUS [OK]                  |
        :      BODY   [BSON]                |
        :      INDEX  [N-1]                 |
        :                              cursor.next() == Nil
        :                                   |
 READ BSON <---------------------------  { 0000 }
               STATUS [COMPLETED]
               INDEX  [N]
```

Today web browsers are able to handle binary data effeciently with Typed Arrays, Buffers and WASM.

`b-flow` is demonstrating two-way client-server communication over web sockets using BSON without additional layers of translation between JSON, BSON and back-end objects.

## Protocol

### Client

| Header      | Size          | Description |
| ----------- | ------------- | ----------- |
| MARKER_SIZE | UInt8         | Size of requestId to be used to trace a response.
| MARKER      | `MARKER_SIZE` | Request Id. |
| BODY_SIZE   | UInt32        | Size of payload.
| BODY        | `BODY_SIZE`   | Payload in BSON.

### Server

| Header      | Size          | Description |
| ----------- | ------------- | ----------- |
| MARKER_SIZE | UInt8         | Size of requestId. |
| MARKER      | `MARKER_SIZE` | Client requestId. |
| STATUS      | UInt8         | Completion status. |
| INDEX       | UInt16        | Response index. |
| BODY_SIZE   | UInt32        | Size of BSON response. |
| BODY        | `BODY_SIZE`   | Usually document, or error if it happened with status 1 [Error]. |

### Status

| UInt8 | Binary | Description |
| ----- | -------| ----------- |
| 0     | x0000  | Ok |
| 1     | x0001  | Error |
| 2     | x0010  | Completed |
| 3     | x0011  | Completed with Errors |

x0011 = x0001 | x0010

## Client API

```typescript
import bf from 'b-flow';

bf({ find: { id: 42 }, fields: { id: 1, name: 1 } })
    .on('document', (doc, index) => 
        console.log(`${index} ${doc.id} - ${doc.name}`)
    )
    .forEach((doc, index) => 
        console.log(`${index} ${doc.id} - ${doc.name}`)
    )
    .on('complete', (done) => 
        console.log('done')
    )
    .completed((done) => 
        console.log('done')
    )
    .then(done => ..., error => ...);

```


### To be continued...