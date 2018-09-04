import React, { Component } from 'react';
import Terminal from 'terminal-in-react';
import { Codec, proto, str, bson } from 'bytable-node';
import { DataViewReader } from 'bytable-client/lib/DataViewReader';

@proto
class Request {
    @str
    id: string;

    @bson
    payload: {};
}

const requestCodec = new Codec(Request);
const reader = new DataViewReader(Request);

export class App extends Component {
    private ws: WebSocket;

    componentDidMount(){
        const ws = new WebSocket('ws://localhost:8080/');
        ws.binaryType = 'arraybuffer';
        ws.onopen = () => {
            this.ws = ws;
        }
    }

    select = (args, print) => {
        const msg = new Request();
        msg.id = 'guid123';
        msg.payload = { args };
        const b = requestCodec.write(msg);
        print(`sending ${b.byteLength} bytes...`);
        this.ws.send(b);
        this.ws.onmessage = ({data}) => {
            if(data instanceof ArrayBuffer){
                print(`receving ${data.byteLength} bytes...`);
                print(JSON.stringify(reader.read(data)));
            }
        };
        return false;
    }
  
    render() {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "auto",
            height: "100vh"
          }}
        >
          <Terminal
            startState='maximised'
            showActions={false}
            hideTopBar={true}
            allowTabs={false}
            color='rgb(5, 255, 39)'
            prompt='rgb(5, 255, 39)'
            promptSymbol='>'
            backgroundColor='black'
            barColor='black'
            style={{ fontWeight: "bold", fontSize: "1em" }}
            commands={{
              select: this.select
            }}
            descriptions={{
              color: false, 
              show: false, 
              clear: false,
              select: 'select [fields] from {collection} [where {find}]'
            }}
            msg='Rinzler :: Mongo Terminal'
            watchConsoleLogging={false}
            commandPassThrough={cmd => `-rzr:${cmd}: command not found`}
          />
        </div>
      );
    }
  }
