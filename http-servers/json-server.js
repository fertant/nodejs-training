const http = require('http');

const { Transform } = require('stream');


http.createServer((request, response) => {
    const product = {
        id: 1,
        name: 'Supreme T-Shirt',
        brand: 'Supreme',
        price: 99.99,
        options: [
            { color: 'blue' },
            { size: 'XL' }
        ]
     };
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.write(JSON.stringify(product));
    response.end();

}).listen(9000);