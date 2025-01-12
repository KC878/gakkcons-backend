const express = require("express");

const {
  getAppointments,
  getAppointmentById,
  requestAppointment,
  updateMeetingLink,
  rejectAppointments,
  completedAppointments,
  getAppointmentsAnalytics
} = require("../controllers/appointment");

const checkAuth = require("../middlewares/auth");

const appointment = express.Router();

appointment.get("/", checkAuth, getAppointments);
appointment.get("/:appointment_id", checkAuth, getAppointmentById);
appointment.post("/request", checkAuth, requestAppointment);
appointment.put("/update/:appointment_id", checkAuth, updateMeetingLink)
appointment.put('/reject/:appointment_id', checkAuth, rejectAppointments)
appointment.put('/completed/:appointment_id', checkAuth, completedAppointments)
appointment.get('/get/analytics', checkAuth, getAppointmentsAnalytics)

module.exports = appointment;
  