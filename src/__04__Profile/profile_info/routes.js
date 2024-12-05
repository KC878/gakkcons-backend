// src/profile/routes.js

const express = require('express');
const controller = require('./controller');  // Import the controller
const authenticate = require('./auth');  // Import the authentication middleware

const router = express.Router();

// Protect this route with the authentication middleware
router.get('/', authenticate, controller.getProfile);

module.exports = router;
