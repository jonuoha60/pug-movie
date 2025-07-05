const mongoose = require("mongoose");

const movieSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    year: { type: Number, required: true },
    genres: { type: [String], required: true },
    rating: { type: Number, required: true }
})

const Movie = mongoose.model("Movie", movieSchema)

module.exports = Movie;