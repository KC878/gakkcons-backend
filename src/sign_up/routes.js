const express = require('express');
const { signup } = require('./controller');

const router = express.Router();

// Route for signup
router.post('/', signup);

module.exports = router;
