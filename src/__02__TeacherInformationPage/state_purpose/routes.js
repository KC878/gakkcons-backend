const express = require('express');
const controller = require('./controller');

const router = express.Router();

// Route to update the reason field
router.put('/:appointment_id', controller.updateReason);

module.exports = router;
