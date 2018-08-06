# b-flow
binary data flow over web sockets

```
npm install b-flow
```

## Proposition

Web trafic and server performance are usually affected by underlying data formats such as JSON or XML. These text formats are far from native data representation in bytes and needed to be processed (serialized/deserialized) several times for every single http call.

Today browsers can handle binary data over websockets. Moreover data processing in javascript can be done with near-native performance because of web assembly.

`b-flow` is a try to pass binary data from servers to clients and back with minimum data transformations.

The problem with binary format is that it can be interpreted differently by different languages. It looks like a good idea to use a language independent data interchange format similar to XML or better JSON, but binary. Binary JSON!

## BSON

https://www.mongodb.com/blog/post/bson
> BSON is a binary serialization of JSON-like documents. BSON stands for “Binary JSON”, but also contains extensions that allow representation of data types that are not part of JSON. For example, BSON has a Date data type and BinData type.


> The key advantage over XML and JSON is efficiency (both in space and compute time), as it is a binary format.

> BSON can be compared to binary interchange formats, such as Protocol Buffers. BSON is more “schemaless” than Protocol Buffers – this being both an advantage in flexibility, and a slight disadvantage in space as BSON has a little overhead for fieldnames within the serialized BSON data.

MongoDB is a perfect example where this flow should shine, because it's already working with BSON and everything you need to grab BSON from Mongo and send it to a client browser over web sockets.
