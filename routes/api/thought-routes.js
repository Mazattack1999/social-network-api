const router = require('express').Router();
const {
   getAllThoughts,
   getThoughtById,
   addThought,
   updateThought,
   deleteThought,
   addReaction,
   deleteReaction
} = require('../../controllers/thought-controller');

// Set up GET all thoughts and POST thought at /api/thoughts
router
    .route('/')
    .get(getAllThoughts)
    .post(addThought);

// Set up GET one thought, PUT thought, and DELETE thought at /api/thoughts/:thoughtId
router
    .route('/:thoughtId')
    .get(getThoughtById)
    .put(updateThought)
    .delete(deleteThought);

// Set up POST reaction and DELETE reaction at /api/thoughts/:thoughtId/reactions/:reactionId
router
    .route('/:thoughtId/reactions/:reactionId')
    .post(addReaction)
    .delete(deleteReaction);

module.exports = router;