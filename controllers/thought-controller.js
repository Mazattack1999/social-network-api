const { Thought, User } = require('../models');

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
        Thought.findOne({_id: params.userId})
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
    addThought({params, body}, res) {
        Thought.create(body)
            .then(({_id}) => {
                return User.findById(
                    {_id: params.userId},
                    {$push: {thoughts: _id}},
                    {new: true}
                    )
            })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({message: 'No user found with this id!'});
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.json(err));
        },
        // update a thought
        updateThought({params, body}, res) {
            Thought.findByIdAndUpdate(
                {_id: params.userId},
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
                        return res.status(404).json({message: 'No thought found with this id!'})
                    }
                    return User.findByIdAndUpdate(
                        {_id: params.userId},
                        {$pull: {thoughts: params.thoughtId}},
                        {new: true}
                    )
                })
                .then(dbUserData => {
                    // if no User is found, send 404
                    if (!dbUserData) {
                        res.send(404).json({message: 'No user found with this id'});
                        return;
                    }
                    res.json(dbUserData);
                })
                .catch(err => res.json(err));
        },
        // add a recation
        addReaction({params, body}, res) {
            Reaction.create(body)
            .then(({_id}) => {
                return Thought.findById(
                    {_id: params.userId},
                    {$push: {reactions: _id}},
                    {new: true}
                    )
            })
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
        deleteReaction({params}, res) {
            Reaction.findByIdAndDelete({_id: params.thoughtId})
                .then(deletedReaction => {
                    // if no reaction is found
                    if (!deletedReaction) {
                        return res.status(404).json({message: 'No reaction found with this id!'})
                    }
                    return Thought.findByIdAndUpdate(
                        {_id: params.thoughtId},
                        {$pull: {reactions: params.reactionId}},
                        {new: true}
                    )
                })
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