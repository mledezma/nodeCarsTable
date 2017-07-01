const http = require('http');
const routes = require('./routes');

let port = process.env.PORT | 8080;

var server = http.createServer(routes);

server.listen(port);

console.log(`Server running in PORT: ${port}`);
