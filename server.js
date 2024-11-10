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

// Simple route to check if server is running
app.get('/', (req, res) => {
  res.send('Welcome to Flare! Your server is running.');
});

// Example API Route
app.get('/api', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Example route with JWT authentication (assuming you have JWT_SECRET in your .env)
app.get('/secure', (req, res) => {
  // This route is just for demonstration and should be secured with proper JWT checks
  res.json({ message: 'This is a secure route!' });
});

// Export app for Vercel
module.exports = app;

// Vercel expects the server to listen on the provided PORT environment variable
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
