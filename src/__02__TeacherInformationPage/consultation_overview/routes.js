const express = require('express');
const controller = require('./controller');

const router = express.Router();

// Route to get all appointments
router.get('/', controller.getAppointments);

// Route to get an appointment by ID
router.get('/:appointment_id', controller.getAppointmentById);

module.exports = router;
