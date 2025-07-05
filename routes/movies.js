const express = require("express");
const Movie = require("../models/movie");

const app = express.Router();

// List all movies
app.get('/', async (req, res) => {
    try {
        const movies = await Movie.find();
        res.render('movies', { movies: movies || [] });
    } catch (err) {
        res.status(404).send('Error fetching movies');
    }
});

// Render add movie form
app.get('/add', (req, res) => {
    res.render('addMovie'); // Your addMovie.pug
});

// Handle adding new movie
app.post('/add', async (req, res) => {
    const { name, description, year, genres, rating } = req.body;

    const movie = new Movie({
        name,
        description,
        year,
        genres: genres.split(',').map(g => g.trim()), // trim spaces
        rating
    });

    try {
        await movie.save();
        res.redirect('/movies');
    } catch (err) {
        res.status(404).send('Error adding movie');
    }
});

// Render edit form with movie data pre-filled
app.get('/edit', async (req, res) => {
    const { id } = req.query;

    try {
        const movie = await Movie.findById(id);
        if (!movie) return res.status(404).send('Movie not found');
        res.render('editMovie', { movie }); // Pass movie to template
    } catch (err) {
        res.status(404).send('Error fetching movie for edit');
    }
});

// Handle editing movie
app.post('/edit', async (req, res) => {
    const { id } = req.query;
    const { name, description, year, genres, rating } = req.body;

    try {
        const movie = await Movie.findByIdAndUpdate(
            id,
            {
                name,
                description,
                year,
                genres: genres.split(',').map(g => g.trim()),
                rating
            },
            { new: true }
        );

        if (!movie) {
            return res.status(404).send('Movie not found');
        }

        res.redirect('/movies');
    } catch (err) {
        res.status(404).send('Error updating movie');
    }
});

// POST-based delete (HTML form friendly)
app.post('/delete', async (req, res) => {
    const { id } = req.body;

    try {
        const movie = await Movie.findByIdAndDelete(id);

        if (!movie) {
            return res.status(404).send('Movie not found');
        }

        res.redirect('/movies'); // Works because it's a POST
    } catch (err) {
        res.status(404).send('Error deleting movie');
    }
});



module.exports = app;
