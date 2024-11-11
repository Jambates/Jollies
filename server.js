const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // For parsing application/json
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files (e.g. index.html, styles.css)
app.use(cors()); // Enable Cross-Origin Resource Sharing

// MongoDB Atlas Connection
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://Jamiebates2023:Hunny234@flare.azj5m.mongodb.net/myDatabaseName?retryWrites=true&w=majority&appName=Flare';

// Replace `<your_username>`, `<your_password>`, and `<your_db_name>` with your MongoDB Atlas details
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

// Example of a MongoDB Schema and Model
const ExampleSchema = new mongoose.Schema({
  name: String,
  message: String,
});

const ExampleModel = mongoose.model('Example', ExampleSchema);

// API Routes
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the API!' });
});

// Route to retrieve data from MongoDB
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
