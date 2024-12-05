const express = require('express');
const router = express.Router();
const dashboardController = require('./controller');

// Define the search route
router.get('/search', dashboardController.search);

module.exports = router;
