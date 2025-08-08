const express = require("express");


const app = express.Router();

// Logout
app.post('/', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error logging out");
        }
        res.redirect('/login'); // Redirect after destroying the session
    });
});

module.exports = app;
