const express = require('express');
const controller = require('./controller');  // Import the controller methods

const router = express.Router();

// Fetch all appointments
router.get('/', controller.getAppointments);


// Update appointment status for a specific appointment
router.put('/:appointment_id', controller.updateAppointmentStatus);

module.exports = router;
