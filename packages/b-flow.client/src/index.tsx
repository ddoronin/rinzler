import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';

// import { Buffer } from 'buffer';
// import { Codec, proto, str, bson } from 'bytable-node';
// import { DataViewReader } from 'bytable-client/src/DataViewReader';

// @proto
// class Request {
//     @str
//     id: string;

//     @bson
//     payload: {};
// }

// const requestCodec = new Codec(Request);
// const reader = new DataViewReader(Request);

// const ws = new WebSocket('ws://localhost:8080/');
// ws.binaryType = 'arraybuffer';
// console.info('Connecting...');
// ws.onopen = function () {
//     console.info('Connected!');
//     const msg = new Request();
//     msg.id = 'guid123';
//     msg.payload = {
//         a: 'test'
//     };
//     ws.send(requestCodec.write(msg));
//     ws.onmessage = ({data}) => {
//         if(data instanceof ArrayBuffer){
//             console.debug(reader.read(data));
//         }
//     };
// }

const elementId = 'app';
let appEl = document.getElementById(elementId);
if(!appEl) {
    appEl = document.createElement('div');
    appEl.id = elementId;
    document.body.appendChild(appEl);
    appEl = document.getElementById(elementId);
}

ReactDOM.render(<App/>, appEl);
