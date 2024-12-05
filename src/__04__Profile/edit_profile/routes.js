const express = require('express');
const controller = require('./controller');  // Import the controller
const authenticate = require('./auth');  // Import the authentication middleware

const router = express.Router();

// Route to update the user's profile
// This route is protected by the authentication middleware
router.put('/', authenticate, controller.updateProfile);

module.exports = router;
