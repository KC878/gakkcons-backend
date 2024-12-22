const express = require("express");

const {
  getAppointments,
  getAppointmentById,
  updateReason,
} = require("../controllers/appointment");
const checkAuth = require("../middlewares/auth");

const appointment = express.Router();

appointment.get("/", checkAuth, getAppointments);

appointment.get("/:appointment_id", checkAuth, getAppointmentById);

appointment.put("/:appointment_id", checkAuth, updateReason);

module.exports = appointment;
