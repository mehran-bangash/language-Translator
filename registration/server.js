const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Initialize Express
const app = express();

// Middleware
app.use(bodyParser.json()); // Parse JSON request body

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected to dbconnect'))
    .catch(err => console.log('MongoDB connection error:', err));

// User Registration Route
app.post('/api/auth/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Create new user
        const newUser = new User({ username, email, password });

        // Save user to MongoDB
        await newUser.save();

        // Generate a JWT token
        const payload = { user: { id: newUser._id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send the token back to the client
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
