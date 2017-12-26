const net = require('net');
let SOCKET_PATH = '/tmp/echo.sock';

const client = net.createConnection({ path: SOCKET_PATH }, () => {
    //'connect' listener
    console.log('connected to server!');
    client.write('world!\r\n');
});

client.on('error', (err) => {
    console.log(err);
});