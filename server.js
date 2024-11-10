// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

// Initialize express app
const app = express();

// Middleware to parse JSON data and enable CORS
app.use(express.json());
app.use(cors());

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Sample User schema for MongoDB
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true }
});

// Create a model based on the schema
const User = mongoose.model('User', userSchema);

// Create a JWT token for a user
function generateToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

// Sample route to register a user
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const newUser = new User({ username, password });
  try {
    await newUser.save();
    const token = generateToken(newUser);
    res.json({ message: 'User registered successfully', token });
  } catch (error) {
    res.status(400).json({ message: 'Error registering user', error });
  }
});

// Sample route to login a user
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = generateToken(user);
    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(400).json({ message: 'Error logging in user', error });
  }
});

// Example protected route
app.get('/protected', (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    res.json({ message: 'Protected content', userId: decoded.id });
  });
});

// Set the port and start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
