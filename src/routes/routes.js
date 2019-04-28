const express = require('express');
const router = express.Router();

const Movie = require('../controllers/movies');
const User = require('../controllers/users');

router.get('', (req, res) => {
    return res.status(200).send({message: "Welcome To API"});
});

// Users
router.post('/users', User.addNewUser);
router.get('/users', User.getAllUsers);

// Movies
router.post('/movies', User.isAdmin ,Movie.addNewMovieRecord);
router.get('/movies', Movie.displayAllMovies);
router.get('/movies/:id', Movie.getMovieByID);
router.put('/movies/:id', Movie.editMovieRecord);
router.delete('/movies/:id', Movie.deleteMovieByID);
router.delete('/movies', Movie.deleteByCategory);
router.get('/movies/actors/:actor', Movie.getAllMoviesByActor)
module.exports = router;