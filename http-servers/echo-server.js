const net = require('net');
const server = net.createServer();

server.listen(9000, 'localhost', 2);
server.on('listening', function () {
    console.log('server accepting connections');
});
server.on('connection', (socket) => {
    console.log('client connected\n');
    socket.write('Hello client!\n');
    socket.on('data', (data) => {
        console.log(data.toString());
    });
    socket.pipe(socket);
});
