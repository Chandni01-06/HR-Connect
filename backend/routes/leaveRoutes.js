const express = require('express');
const router = express.Router();
const {
    getLeaves,
    createLeave,
    updateLeave,
    deleteLeave
} = require('../controllers/leaveController');
const { protect } = require('../middleware/authMiddleware');

// All leave routes are protected
router.use(protect);

router.route('/')
    .get(getLeaves)
    .post(createLeave);

router.route('/:id')
    .put(updateLeave)
    .delete(deleteLeave);

module.exports = router;
