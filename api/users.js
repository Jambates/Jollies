// api/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Assuming you have a User model set up

// GET request to fetch users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();  // Fetch all users
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST request to add a new user (if needed)
router.post('/', async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
    });

    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
