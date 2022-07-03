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
        Thought.findOne({_id: params.id})
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
                    {_id: params.id},
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
                {_id: params.id},
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
        removeThought({params}, res) {
            Thought.findByIdAndDelete({_id: params.id})
            .then(dbThoughtData => {
                // if no thought is found, send 404
                if (!dbThoughtData) {
                    res.send(404).json({message: 'No thought found with this id'});
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.json(err));
        }
}

module.exports = ThoughtController;