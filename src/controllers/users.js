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

function isAdmin(req, res) {
    let isAdmin = false;
    if(req.body.email){
        User.find({ email: req.body.email}, (user, err) => {
            if (!user){
               return res.status(400).send({ message: 'User not found' });
            } else if(user && user.permissions === 'admin'){
                isAdmin = true;
                return isAdmin;
            } else {
                return res.status(400).send({message: 'Unathorized user', err})
            }
        });
    }
}

module.exports = { isAdmin, addNewUser, getAllUsers}
