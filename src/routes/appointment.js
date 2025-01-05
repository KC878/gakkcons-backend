const express = require("express");

const {
  getAppointments,
  getAppointmentById,
  requestAppointment,
  updateMeetingLink,
  rejectAppointments
} = require("../controllers/appointment");

const checkAuth = require("../middlewares/auth");

const appointment = express.Router();

appointment.get("/", checkAuth, getAppointments);
appointment.get("/:appointment_id", checkAuth, getAppointmentById);
appointment.post("/request", checkAuth, requestAppointment);
appointment.put("/update/:appointment_id", checkAuth, updateMeetingLink)
appointment.put('/reject/:appointment_id', checkAuth, rejectAppointments)

module.exports = appointment;
  