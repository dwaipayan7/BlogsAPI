const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const app = express();
const blogSchema = require('./routes/blogs.route')


// Connect to MongoDB
connectDB().catch(err => console.error('Database connection error:', err));


// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


PORT = process.env.PORT;

//router middleware
app.use('/api/', blogSchema);

// Default GET endpoint
app.get('/', (req, res) => {
  res.send("Hello, Dwaipayan");
});


app.listen(PORT || 4000, () => {
  console.log("Server Running on port 3000");
});