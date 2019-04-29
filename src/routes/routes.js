const express = require('express');
const router = express.Router();

const Movie = require('../controllers/movies');
const User = require('../controllers/users');

router.get('', (req, res) => {
    return res.status(200).send({message: "Welcome To API"});
});

// Users
router.post('/admin/users', User.isAdmin ,User.addNewUser);
router.get('/admin/users', User.isAdmin, User.getAllUsers);

// Movies
router.post('/admin/movies', User.isAdmin ,Movie.addNewMovieRecord);

router.delete('/admin/movies/:id', User.isAdmin, Movie.deleteMovieByID);
router.delete('/admin/movies', User.isAdmin, Movie.deleteByCategory);

router.put('/admin/movies/:id', User.isAdmin, Movie.editMovieRecord);
router.put('/admin/movies/:id/showings', User.isStaff, Movie.editMovieShowingTimeOrNo);

router.get('/admin/movies', User.isStaff, Movie.displayAllMovies);
router.get('/movies', User.isUser, Movie.displayAllActiveMovies);
router.get('/movies/:id', User.isUser, Movie.getMovieByID);
router.get('/movies/actors/:actor', User.isUser, Movie.getAllMoviesByActor)
module.exports = router;