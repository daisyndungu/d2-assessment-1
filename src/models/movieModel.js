const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const pathValidator = (pathName) => {
    const extension = pathName.split(".");
    return extension.includes("png") || extension.includes("jpg");
}

const arrayValidator = (mainActors) => {
    return mainActors.length < 6 && mainActors.length != 0;
}

const movie = new Schema({
    title: {type: String, required: true, unique: true},
    description: {type: String, required: true},
    mainActors: {type: Array, required: true, validate: [arrayValidator, "Main Actors can not be more than 5 or less 1"]},
    poster: {type: String, required: true, validate: [pathValidator, "png or jpg not in file path"]},
    category: {type: String, required: true},
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},
    showingNo: {type: Number, default: 0},
    showingTime: {type: Array}
});

module.exports = mongoose.model('movies', movie);