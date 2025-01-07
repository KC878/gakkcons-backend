const express = require("express");

const {
  getAppointments,
  getAppointmentById,
  requestAppointment,
  updateAppointment,
} = require("../controllers/appointment");

const checkAuth = require("../middlewares/auth");

const appointment = express.Router();

appointment.get("/", checkAuth, getAppointments);
appointment.get("/:appointment_id", checkAuth, getAppointmentById);
appointment.post("/request", checkAuth, requestAppointment);
appointment.put('/update/:appointment_id', updateAppointment);
module.exports = appointment;
