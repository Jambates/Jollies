const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Home route (this is what should show up on http://localhost:5000)
app.get('/', (req, res) => {
  res.send('Welcome to flare! Your server is running.');
});

// Example of a POST route (you can extend this with your own logic)
app.post('/api/example', (req, res) => {
  res.json({
    message: 'POST request received',
    body: req.body
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get('/', (req, res) => {
    res.send('Welcome to flare! Your server is running.');
});


