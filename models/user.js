const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true }, // email should be a string
    password: { type: String, required: true } // password should be a string, not an array
});

const User = mongoose.model("userUpload", userSchema);

module.exports = User;
