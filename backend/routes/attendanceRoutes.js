const express = require('express');
const router = express.Router();
const {
    getAttendance,
    createAttendance,
    updateAttendance,
    deleteAttendance
} = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');

// All attendance routes are protected
router.use(protect);

router.route('/')
    .get(getAttendance)
    .post(createAttendance);

router.route('/:id')
    .put(updateAttendance)
    .delete(deleteAttendance);

module.exports = router;
