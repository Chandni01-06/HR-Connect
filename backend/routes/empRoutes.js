const express = require('express');
const router = express.Router();
const {
    getEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
} = require('../controllers/empController');
const { protect } = require('../middleware/authMiddleware');

// All employee endpoints require authorization
router.use(protect);

router.route('/')
    .get(getEmployees)
    .post(createEmployee);

router.route('/:id')
    .put(updateEmployee)
    .delete(deleteEmployee);

module.exports = router;
