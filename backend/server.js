const express = require('express');
const app = express(); 
require('dotenv').config();
const PORT = process.env.PORT; 
const userRoutes= require('./routes/userRoutes');
const dbConnection= require('./config/dbconfig')
const cors = require('cors');

//database connection
dbConnection();

// cors use
app.use(cors());

// Define a route for the homepage
app.get('/', (req, res) => {
  res.send('Hello, home!'); // Send response
});

// Use routes
app.use(express.json()); 
app.use('/users', userRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
