# b-flow
**binary data flow over web sockets**

```
npm install b-flow
```

## Unique Proposition

Client-server communications over BSON by websockets or HTTP/2 should reduce web trafic and optimize performance.

In contrast to traditional text formats (JSON and XML) binary is a memory snapshot and it doesn't need any additional processing on the way to clients.

In terms of clients, who are mostly web browsers, binary data could be handled effeciently with Typed Arrays, Buffers and, when supported, WASM.

`b-flow` is a set of tools demonstrating two-way client-server communication over web sockets using BSON.

## BSON

https://www.mongodb.com/blog/post/bson
> BSON is a binary serialization of JSON-like documents. BSON stands for “Binary JSON”, but also contains extensions that allow representation of data types that are not part of JSON. For example, BSON has a Date data type and BinData type.


> The key advantage over XML and JSON is efficiency (both in space and compute time), as it is a binary format.

> BSON can be compared to binary interchange formats, such as Protocol Buffers. BSON is more “schemaless” than Protocol Buffers – this being both an advantage in flexibility, and a slight disadvantage in space as BSON has a little overhead for fieldnames within the serialized BSON data.

MongoDB is a perfect example where this flow should shine, because this db is completely relying on BSON.

## Protocol

Client:

| Header | Description |
| ------ | ----------- |
| PAYLOAD_SIZE | UInt8 |
| PAYLOAD | BSON of size PAYLOAD_SIZE |
| MARKER | Client marker (e.g. requestId) that will be used to trace a response. |

Server:

| Header | Description |
| ------ | ----------- |
| DOCUMENTS_COUNT | UInt8 |
| DOCUMENT_INDEX | UInt8 |
| DOCUMENT_SIZE | UInt8 |
| DOCUMENT | BSON of size DOCUMENT_SIZE |
| MARKER | Client marker came with the request payload (e.g. requestId). |
| METADATA | Any additional metadata related to the document.|

### To be continued...