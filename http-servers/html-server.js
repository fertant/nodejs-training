const http = require('http');
const fs = require('fs');
const { Transform } = require('stream');


http.createServer((request, response) => {
    if (request.method === 'GET' && request.url === '/pipe') {
        const messageReplace = new Transform({
            readableObjectMode: true,
            transform(chunk, encoding, callback) {
                let message = 'Hello first simple html server with pipe';
                this.push(chunk.toString().replace(/{message}/g, message));
                callback();
            }
        });
        
        fs.createReadStream('template/index.html')
            .pipe(messageReplace)
            .pipe(response)
    } else if (request.method === 'GET' && request.url === '/sync') {
        let template = fs.readFileSync('template/index.html');
        let message = 'Hello first simple html server';
        let reply = template.toString().replace(/{message}/g, message);
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(reply);
        response.end();
    } else {
        response.statusCode = 404;
        response.end();
    }

}).listen(9000);

    