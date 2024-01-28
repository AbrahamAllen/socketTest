const port = process.env.PORT || 3000;

const app = express();
const http = require('http');
const server = http.createServer(app);
server.listen(port);
