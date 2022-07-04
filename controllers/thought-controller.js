const { Thought, Reaction, User } = require('../models');

const ThoughtController = {
    // get all thoughts
    getAllThoughts(req, res) {
        Thought.find({})
            .sort({_id: -1})
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => res.status(400).json(err));
    },
    // get thought by id
    getThoughtById({params}, res) {
        Thought.findOne({_id: params.thoughtId})
            .then(dbThoughtData => {
                // if no thought is found, send 404
                if (!dbThoughtData) {
                    res.status(404).json({message: 'No thought found with this id!'});
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.status(400).json(err));
    },
    // create a thought
    addThought({body}, res) {
        Thought.create(body)
            .then(({_id}) => {
                return User.findByIdAndUpdate(
                    body.userId,
                    {$push: {thoughts: _id}},
                    {new: true}
                    )
            })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({message: 'No user found with this id!'});
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
        },
        // update a thought
        updateThought({params, body}, res) {
            Thought.findByIdAndUpdate(
                {_id: params.thoughtId},
                body,
                {new: true}
                )
                .then(dbThoughtData => {
                    // if no thought is found, send 404
                    if (!dbThoughtData) {
                        res.send(404).json({message: 'No thought found with this id'});
                        return;
                    }
                    res.json(dbThoughtData);
                })
                .catch(err => res.json(err));
        },
        // delete a thought
        deleteThought({params}, res) {
            Thought.findByIdAndDelete({_id: params.thoughtId})
                .then(deletedThought => {
                    // if no thought is found
                    if (!deletedThought) {
                        res.status(404).json({message: 'No thought found with this id!'})
                        return;                
                    }
                    return User.findOneAndUpdate(
                        {username: deletedThought.username},
                        {$pull: {thoughts: deletedThought._id}},
                        {new: true}
                    )
                })
                .then(dbUserData => res.json(dbUserData))
                .catch(err => res.json(err));
        },
        // add a recation
        addReaction({params, body}, res) {
            Thought.findByIdAndUpdate(
                {_id: params.thoughtId},
                {$push: {reactions: body}},
                {new: true}
            )
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({message: 'No thought found with this id!'});
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.json(err));
        },
        // delete a reaction
        deleteReaction({params, body}, res) {
            Thought.findByIdAndUpdate(
                {_id: params.thoughtId},
                {$pull: {reactions: {reactionId: body.id}}},
                {new: true}
            )
                .then(dbThoughtData => {
                    // if no thought is found, send 404
                    if (!dbThoughtData) {
                        res.send(404).json({message: 'No thought found with this id'});
                        return;
                    }
                    res.json(dbThoughtData);
                })
                .catch(err => res.json(err));
        },
}

module.exports = ThoughtController;