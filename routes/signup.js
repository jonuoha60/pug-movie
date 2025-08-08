const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user.js");

const app = express.Router();
const saltRounds = 12;

app.get('/', (req, res) => {
    res.render('signup'); // Render the signup page
});

app.post('/', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if user already exists by email
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(404).send("User already exists!");
        }

        // Hash the password
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: passwordHash
        });

        await newUser.save();

        res.redirect('/login');

    } catch (err) {
        res.status(404).send("Error in /register");
    }
});

module.exports = app;
