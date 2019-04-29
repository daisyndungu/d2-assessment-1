const Movie = require('../models/movieModel');

function addNewMovieRecord(req, res) {
    if (req.body.showingTime && req.body.showingNo && req.body.showingNo < req.body.showingTime.length) {
        return res.status(400).send({ message: "Showing number should be greater or equal to the no of showing times" });
    }
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

function displayAllActiveMovies(req, res) {
    const currentDate = new Date();
    if (req.query.category) {
        Movie.find({ category: req.query.category, endDate: { '$gte': currentDate } }, (err, movies) => {
            if (movies) {
                return res.status(200).send({ message: "Movies by category", movies });
            } else {
                return res.status(500).send({ message: "An error occurred", err });
            }
        });
    } else {
        Movie.find({endDate: { '$gte': currentDate }}, (err, movies) => {
            if (movies) {
                return res.status(200).send({ message: "All Popular movies", movies });
            } else {
                return res.status(500).send({ message: "Could not fetch all movies, please try again", err });
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

function editMovieShowingTimeOrNo(req, res){
    Movie.find({ _id: req.params.id}, (err, movie) => {
        if(movie){
            const item = movie[0];
            if (req.body.showingTime && req.body.showingNo && req.body.showingTime.length <= req.body.showingNo){
                item.showingNo = req.body.showingNo;
                item.showingTime = req.body.showingTime;
                item.save((err, movie) =>{
                    if(movie) return res.status(200).send({message: "Movie record updated successfully", movie});
                    if (err) return res.status(400).send({ message: "Unable to update movie record", err });
                });
            } else if (req.body.showingTime && !req.body.showingNo && req.body.showingTime.length <= item.showingNo){
                item.showingTime = req.body.showingTime;
                item.save((err, movie) => {
                    if (movie) return res.status(200).send({ message: "Movie record updated successfully", movie });
                    if (err) return res.status(400).send({ message: "Unable to update movie record", err });
                });
            } else if (!req.body.showingTime && req.body.showingNo && req.body.showingNo < item.showingTime.length){
                return res.status(400).send({
                    message: "There are more movies showing times saved than the indicated showing number. Update both entries"
                });
            } else {
                return res.status(400).send({ message: "Provide showing number, showing times or both. Ensure that the number of showing time does not exceed showing no" });
            }
        } else {
            return res.status(400).send({ message: "Item not found", err });
        }
    });
}

function deleteMovieByID(req, res) {
    const currentDate = new Date();
    Movie.findByIdAndDelete({_id: req.params.id})
    .and([
        {endDate:{ '$lt': currentDate } }
    ])
    .exec((err, movie) => {
        if (movie) {
            return res.status(200).send({ message: "Movie deleted", movie });
        } else {
            return res.status(500).send({ message: "Unable to delete, the end date is still valid", err });
        }
    });
}

function deleteByCategory(req, res){
    const currentDate = new Date();
    if(req.query.category){
        Movie.deleteMany({ category: req.query.category, endDate: { '$lt': currentDate } }, (err, movies) => {
            if(err){
                return res.status(500).send({message: "Unable to delete by category. The end date is still valid"});
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

module.exports = {
    addNewMovieRecord, displayAllMovies, getMovieByID,
    editMovieRecord, deleteMovieByID, deleteByCategory,
    getAllMoviesByActor, displayAllActiveMovies, editMovieShowingTimeOrNo
}