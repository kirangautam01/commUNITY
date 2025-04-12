// index.js or server.js
require('dotenv').config();
const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const dbConnection = require('./config/dbconfig');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const socketConfig = require('./config/socketConfig');
const http = require('http');
const server = http.createServer(app); // ✅ Create HTTP server

const PORT = process.env.PORT;

// Database connection
dbConnection();

app.use(cookieParser());

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, home!');
});

app.use('/users', userRoutes);

// ✅ Setup socket.io
socketConfig(server);

// ✅ Start the HTTP server (not app.listen)
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

