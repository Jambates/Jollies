const bcrypt = require('bcryptjs');    // For password hashing

// Define the schema for the User model
const mongoose = require('mongoose');  // Import mongoose here as this is your schema definition file

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },  // Added password field
});

// Hash the password before saving the user
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();  // If password is not modified, skip
    try {
        const salt = await bcrypt.genSalt(10);  // Generate a salt
        this.password = await bcrypt.hash(this.password, salt);  // Hash the password
        next();
    } catch (err) {
        next(err);
    }
});

// Method to check if the entered password matches the stored hashed password
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);  // Compare password
};

// Create and export the User model using the schema
module.exports = mongoose.model('User', userSchema);
