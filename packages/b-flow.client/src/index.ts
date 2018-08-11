const ws = new WebSocket('ws://localhost:3000/');
console.info('Connecting...');
ws.onopen = function () {
    console.info('Connected!');
    // send Hello! message
    ws.send('Hello, dude! I am javascript');
    ws.onmessage = ({data}) => {
        console.info('received:', data);
    };
}
