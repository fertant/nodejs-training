const http = require('http');
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('Hello World!');
    res.end();
  }).listen(9000);


/*
const net = require('net');
const server = net.createServer();

server.listen(9000, 'localhost', 2);
server.on('listening', () => {
    console.log('server accepting connections\n');
});

server.on('connection', (tcpSocket) => {
    console.log('connection from client');
    tcpSocket.write('Hello World\n\n');
    setTimeout(() => {
        tcpSocket.end('Good by!\n\n\n');
    }, 2000);
});
*/
