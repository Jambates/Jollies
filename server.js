
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// API Route example
app.get('/', (req, res) => {
  res.send('Welcome to Flare! Your server is running.');
});

// Make sure to export the app for Vercel
module.exports = app;

// Vercel expects to listen on the PORT environment variable
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port>
});

app.get('/', (req, res) => {
    res.send('Welcome to flare! Your server >
});


app.get('/', (req, res) => {
    res.send('Hello, World!');
});
