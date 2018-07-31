const Movie = require('../models/movieModel');

function addNewMovieRecord(req, res) {
    const movie = new Movie(req.body);
    movie.save((err, movies) => {
        if(movies){
            return res.status(201).send({message: "Movie record created successfully", movies});
        } else {
            return res.status(500).send({message: "An error occurred", err});
        }
    });
}

function displayAllMovies(req, res){
    // get all movies with similar category
    if(req.query.category){
        Movie.find({category: req.query.category}, (err, movies) => {
            if(movies){
                return res.status(200).send({message: "Movies by category", movies});
            } else {
                return res.status(500).send({message: "An error occurred", err});
            }
        });
    } else {
        // get all movies if no category is passed
        Movie.find({}, (err, movies) => {
            if(movies){
                return res.status(200).send({message: "All Popular movies", movies});
            } else {
                return res.status(500).send({message: "Could not fetch all movies, please try again", err});
            }
        });
    }
}

// retrives movie record using it's id
function getMovieByID(req, res){
    Movie.findById({_id: req.params.id}, (err, movie) => {
        if(movie){
            return res.status(200).send({message: "Movie found!", movie});
        } else {
            return res.status(500).send({message: "An error occurred ensured that you provide the correct ID", err});
        }
    });
}

function editMovieRecord(req, res){
    Movie.findByIdAndUpdate({_id: req.params.id}, req.body, (err, movie) => {
        if(movie){
            return res.status(200).send({message: "Movie Updated", movie})
        } else {
            return res.status(500).send({message: "Please try again", err});
        }
    });
}

function deleteMovieByID(req, res){
    Movie.findByIdAndRemove({_id: req.params.id}, (err, movie) => {
        if(movie){
            return res.status(200).send({message: "Movie deleted!!!"});
        } else {
            return res.status(500).send({message: "Unable to delete, please try again", err});
        }
    });
}

function deleteByCategory(req, res){
    if(req.query.category){
        Movie.deleteMany({category: req.query.category}, (err) => {
            if(err){
                return res.status(500).send({message: "Unable to delete by category. Ensure you provide the right category", err});
            } else {
                return res.status(200).send({message: "Movies deleted by Category"});
            }
        });
    }
}

// Get movies using main actor's name
function getAllMoviesByActor(req, res){
    const actor = req.body.actor || req.params.actor
    Movie.find({mainActors: {$in: [actor]}}, (err, movies) => {
        if(movies){

            return res.status(200).send({message: "Movies", movies});
        } else {
            return res.status(500).send({message: "Unable to fetch movies", err});
        }
    });
}

module.exports = {addNewMovieRecord, displayAllMovies, getMovieByID, editMovieRecord, deleteMovieByID, deleteByCategory, getAllMoviesByActor}