const express = require('express');
const router = express.Router();
const {
    getDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment
} = require('../controllers/deptController');
const { protect } = require('../middleware/authMiddleware');

// All department routes are protected
router.use(protect);

router.route('/')
    .get(getDepartments)
    .post(createDepartment);

router.route('/:id')
    .put(updateDepartment)
    .delete(deleteDepartment);

module.exports = router;
