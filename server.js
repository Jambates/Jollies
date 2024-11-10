const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

// Initialize express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware setup
app.use(cors()); // Enable CORS if needed
app.use(express.json()); // Middleware to parse JSON requests

// Static file serving (for index.html and styles.css)
app.use(express.static(path.join(__dirname, 'public')));

// Example API route
app.get('/api', (req, res) => {
    res.json({ message: "Hello from API!" });
});

// API route for getting user info (can be expanded for more routes)
app.get('/api/user', (req, res) => {
    // This is a simple example. You can replace it with actual data fetching logic.
    res.json({ username: "user1", email: "user@example.com" });
});

// Catch-all route to serve index.html for all other requests
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('MongoDB connection error:', err));

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
