import React, { Component } from 'react';
import Terminal from 'terminal-in-react';
import { MongoTerminalPlugin } from './MongoTerminalPlugin';

export class App extends Component {  
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
            color='rgb(5, 244, 255)'
            prompt='rgb(5, 255, 39)'
            promptSymbol='>'
            backgroundColor='black'
            barColor='black'
            style={{ fontWeight: "bold", fontSize: "1em" }}
            plugins={[
                MongoTerminalPlugin
            ]}
            descriptions={{
              color: false, 
              show: false, 
              clear: true,
              select: 'select [fields] from {collection} [where {find}]'
            }}
            shortcuts={{
                'win,linux': {
                  'ctrl + l': 'clear',
                },
                'win': {
                  'ctrl + l': 'clear',
                },
                'darwin': {
                  'ctrl + l': 'clear'
                },
                'linux': {
                  'ctrl + l': 'clear'
                }
              }}
            msg='Rinzler :: Mongo Terminal'
            watchConsoleLogging={false}
            commandPassThrough={cmd => `-rzr:${cmd}: command not found`}
          />
        </div>
      );
    }
  }
