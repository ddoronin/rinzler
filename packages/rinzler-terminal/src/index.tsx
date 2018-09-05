import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';

const elementId = 'app';
let appEl = document.getElementById(elementId);
if(!appEl) {
    appEl = document.createElement('div');
    appEl.id = elementId;
    document.body.appendChild(appEl);
    appEl = document.getElementById(elementId);
}

ReactDOM.render(<App/>, appEl);
