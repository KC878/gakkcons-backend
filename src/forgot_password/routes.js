const express = require('express');
const { forgotPassword, resetPassword } = require('./controller');

const router = express.Router();

// Route for forgot password (request reset token)
router.post('/forgot', forgotPassword);

// Route for resetting the password
router.post('/reset', resetPassword);

module.exports = router;
