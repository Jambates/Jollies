const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = process.env.PORT || 3000;

require('dotenv').config();

// Import User model
const User = require('./models/User'); // Assuming this file exists

const protect = (req, res, next) => {
    const token = req.header('x-auth-token');  // Check for the token in the header

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verify the token
        req.user = decoded.user;  // Add user data to the request
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

// Middleware
app.use(express.json());  // For parsing application/json
app.use(express.static(path.join(__dirname, 'public')));  // Serve static files (e.g. index.html, styles.css)
app.use(cors());  // Enable Cross-Origin Resource Sharing

// MongoDB Atlas Connection
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://Jamiebates2023:Hunny234@flare.azj5m.mongodb.net/Flare?retryWrites=true&w=majority';

if (mongoose.connection.readyState === 0) {  // Check if not connected
    mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => {
            console.log('MongoDB connected');
        })
        .catch((err) => {
            console.error('MongoDB connection error:', err);
        });
}

// API Routes
app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from the API!' });
});

// Route to retrieve data from MongoDB (example)
app.get('/api/data', async (req, res) => {
  try {
    const data = await ExampleModel.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve data' });
  }
});

// Route to add data to MongoDB
app.post('/api/data', async (req, res) => {
  const { name, message } = req.body;
  try {
    const newData = new ExampleModel({ name, message });
    await newData.save();
    res.status(201).json(newData);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// Sign Up Route
app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    // Create new user
    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Route to handle login (for demonstration purposes)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;                                                                                 
  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create and return JWT token
    const token = jwt.sign(
      { user: { id: user.id } },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});
6
// Example of a protected route
app.get('/api/profile', protect, (req, res) => {
  res.json({ msg: 'This is a protected route', user: req.user });
});

// Serve the static homepage (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Catch-all route for SPAs (single-page apps) to handle frontend routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
