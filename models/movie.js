const mongoose = require("mongoose");

const movieSchema = mongoose.Schema({
    name: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // reference User model
    description: { type: String, required: true },
    year: { type: Number, required: true },
    genres: { type: [String], required: true },
    rating: { type: Number, required: true }
});

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
