const express = require('express');
const router = express.Router();
const dashboardController = require('./controller');

// Define the route to get the list of teachers
router.get('/teachers', dashboardController.getTeachers);

module.exports = router;
