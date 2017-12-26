const net = require('net');

let SOCKET_PATH = '/tmp/echo.sock';

const server = net.createServer((client) => {
    // 'connection' listener
    console.log('client connected');

    client.on('end', () => {
        console.log('client disconnected');
    });

    client.on('data', (data) => {
        let strData = data.toString();
        console.log('client send data', strData);
        client.write('echo for: ' + strData);
    })

    client.pipe(client);
});

server.on('error', (err) => {
    throw err;
});

server.listen(SOCKET_PATH, () => {
    console.log('domain socket bound');
});

function cleanUp() {
    server.close(function () {
        console.log("Finished all requests");
        process.exit(0);
    });
}

process.on('SIGTERM', function () {
    cleanUp();
});

process.on('SIGINT', function () {
    cleanUp();
});