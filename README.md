[![Build Status](https://travis-ci.org/ddoronin/rinzler.svg?branch=master)](https://travis-ci.org/ddoronin/rinzler)

# Rinzler 

Binary over websockets:

```
docker pull ddoronin/rinzler
```
If you have a local instance of MongoDB up and running on `27017` (by default) you can use this command to run docker on `http://localhost:8080`:
```
docker run --rm -it -p 8080:80 -p 27017:27017
```

## Motivation
Today in the World of Big Data and IoT one of the key challenges is how to store data so it could be queried effeciently in many different ways. Evolution of databases toward NoSQL helped to reduce overhead of normalization. Changes in data schema are not pain any more. To achive this, for instance, Mongo is relying on schema-less tree structure stored as binary JSON (BSON).

Traditionally back-end was required to parse database data (BSON for mongo), transform it into Java/C#/JavaScript or any other language objects in memory, than serialize in JSON and send it to a web browser over HTTP. All these layers of parsing, transformations and serializations take time and computational resources.

With `rinzler` it's not a case any more! Grab BSON and pass it throught as is!

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

`rinzler` is demonstrating two-way client-server communication over web sockets using BSON without additional layers of translation between JSON, BSON and back-end objects.

## Protocol

See bytable

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


## Docker

You can checkout the repo and build docker locally:
```
docker build . -t ddoronin/rinzler
```

Or pull the latest version from docker hub:
```
docker pull ddoronin/rinzler
```

And run it using the command:
```
docker run --rm -it -p 80:80 -p 27017:27017 ddoronin/rinzler
```
where port 80 is used to serve a web server and 27017 is a default port for mongo.

These parameters could be customized using environment variables:

- PORT=80
- MONGO_URL=mongodb://host.docker.internal:27017

By default `MONGO_URL` is pointing to a mongo running on the host. In production environment this should be mongo connection string. It's recommended to keep docker ports as is, but change mapped ports if needed.

