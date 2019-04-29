const User = require('../models/userModel');

function addNewUser(req, res){
    const user = new User(req.body);
    user.save((err, user)=>{
        if(user){
            return res.status(201).send({message: 'New User created', user});
        } else {
            return res.status(500).send({message: 'Unable to create user', err});
        }
    });
}

function getAllUsers(req, res) {
    User.find((err, users) => {
        if(users){
            return res.status(200).send({message: 'All Users', users});
        } else {
            return res.status(400).send({ message: 'An error occured', err });
        }
    })
}

function isAdmin(req, res, next) {
    if(req.body.email){
        User.find({ email: req.body.email}, (err, user) => {
            if (!user){
               return res.status(400).send({ message: 'User not found' });
            } else if (user && user[0].permissions === 'admin'){
                next();
            } else {
                return res.status(401).send({message: 'Unathorized user', err})
            }
        });
    } else {
        return res.status(400).send({ message: 'Please provide user email' })
    }
}

function isStaff(req, res, next) {
    if (req.body.email) {
        User.find({ email: req.body.email }, (err, user) => {
            if (!user) {
                return res.status(400).send({ message: 'User not found' });
            } else if (user && user[0].permissions === 'staff' || user[0].permissions === 'admin') {
                // Admin has rights to perform operationst that a staff can perform
                next();
            } else {
                return res.status(401).send({ message: 'Unathorized user', err })
            }
        });
    } else {
        return res.status(400).send({ message: 'Please provide user email' })
    }
}

function isUser(req, res, next) {
    if(req.body.email){
        User.find({ email: req.body.email }, (err, user) => {
            if (!user) {
                return res.status(400).send({ message: 'User not found' });
            } else if (user) {
                next();
            } else {
                return res.status(401).send({ message: 'Unathorized user', err })
            }
        });
    } else {
        return res.status(400).send({ message: 'Please provide user email' })
    }
}

module.exports = { addNewUser, getAllUsers, isAdmin, isStaff, isUser }
