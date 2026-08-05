const http = require('http');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const socketUtils = require('./src/utils/socket');

dotenv.config();
const app = require('./app'); // Import app logic
connectDB();

const server = http.createServer(app);
socketUtils.init(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server and Sockets live on port ${PORT}`);
    console.log(`📖 Swagger Docs: http://localhost:${PORT}/api-docs`);
});