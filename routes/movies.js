const express = require("express");
const Movie = require("../models/movie");

const app = express.Router();

// List all movies
app.get('/', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    
    try {
        const user = req.session.user;
        const movies = await Movie.find({ user: user.id }); // filter by logged-in user
        
        res.render('movies', { movies, user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching movies');
    }
});


// Render add movie form
app.get('/add', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.render('addMovie'); // Your addMovie.pug
});

// Handle adding new movie
app.post('/add', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    const { name, description, year, genres, rating } = req.body;

    const movie = new Movie({
        name,
        user: req.session.user.id, // Store only the user's ID
        description,
        year,
        genres: genres.split(',').map(g => g.trim()),
        rating
    });

    try {
        await movie.save();
        res.redirect('/movies');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding movie');
    }
});


// Render edit form with movie data pre-filled
// GET /movies/edit?id=...
app.get('/edit', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const { id } = req.query;
  if (!id) return res.status(400).send('Missing movie id');

  try {
    const user = req.session.user;
    // Find movie that matches id AND belongs to logged-in user
    const movie = await Movie.findOne({ _id: id, user: user.id });

    if (!movie) return res.status(404).send('Movie not found or not authorized');

    // Render edit page, pass movie and user
    res.render('editMovie', { movie, user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching movie for edit');
  }
});

// POST /movies/edit?id=...
app.post('/edit', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const { id } = req.query;
  if (!id) return res.status(400).send('Missing movie id');

  const { name, description, year, genres, rating } = req.body;

  try {
    const user = req.session.user;
    // Only update if movie._id === id AND movie.user === current user id
    const updated = await Movie.findOneAndUpdate(
      { _id: id, user: user.id },
      {
        name,
        description,
        year,
        genres: genres.split(',').map(g => g.trim()),
        rating
      },
      { new: true }
    );

    if (!updated) return res.status(404).send('Movie not found or not authorized');

    res.redirect('/movies');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating movie');
  }
});


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
