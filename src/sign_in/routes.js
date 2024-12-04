const express = require('express');
const { login } = require('./controller');

const router = express.Router();

// Route for login
router.post('/', login);

module.exports = router;
