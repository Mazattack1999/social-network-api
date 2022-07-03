const { User } = require('../models');

const UserController = {
    // get all users
    getAllUsers(req, res) {
        User.find({})
            .sort({_id: -1})
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.status(400).json(err));
    },
    // get user by id
    getUserById({params}, res) {
        User.findOne({_id: params.id})
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .then(dbUserData => {
                // if no user is found, send 404
                if (!dbUserData) {
                    res.status(404).json({message: 'No user found with this id!'});
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
    },
    // create new user
    createUser({ body}, res) {
        User.create(body)
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.status(400).json(err));
    },
    // update user by id
    updateUser({params, body}, res) {
        User.findbyIdAndUpdate({_id: params.id}, body, {new: true})
            .then(dbUserData => {
                // if no users is found, send 404
                if (!dbUserData) {
                    res.status(404).json({message: 'No user found with this id!'})
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
    },
    // delete user by id
    deleteUser({params}, res) {
        User.findByIdAndDelete({_id: params.id})
        .then(dbUserData => {
            // if no user is found, send 404
            if (!dbUserData) {
                res.status(404).json({message: 'No user found with this id!'})
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    },
    // add friend
    addFriend({params}, res) {
        User.findById({_id: params.id})
            .then(dbUserData => {
                // if no user is found, send 404
                if (!dbUserData) {
                    res.status(404).json({message: 'No user found with this id!'});
                    return;
                }
                return User.findByIdAndUpdate(
                    { _id: params.id },
                    { $push: {friends: params.friendId} },
                    { new: true }
                    )
            })
    }, 
    // remove friend
    removeFriend({params}, res) {
        User.findById({_id: params.id})
            .then(dbUserData => {
                // if no user is found, send 404
                if (!dbUserData) {
                    res.status(404).json({message: 'No user found with this id!'});
                    return;
                }
                return User.findByIdAndUpdate(
                    { _id: params.id },
                    { $push: {friends: params.friendId} },
                    { new: true }
                    )
            })
    }
}

module.exports = UserController;