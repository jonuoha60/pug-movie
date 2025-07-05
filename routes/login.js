const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user.js");

const app = express.Router();

app.get('/', (req, res) => {
    res.render('login'); // Render the signup page
});

app.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("Invalid email or password");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(404).send("Invalid email or password");
    }

    res.redirect('/movies');

  } catch (error) {
    res.status(404).send("Error logging in");
  }
});

module.exports = app;
