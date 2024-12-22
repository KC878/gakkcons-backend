const express = require("express");

const {
  getNotifications,
  updateAppointmentStatus,
} = require("../controllers/notification");
const checkAuth = require("../middlewares/auth");

const notification = express.Router();

notification.get("/", checkAuth, getNotifications);
notification.put("/:appointment_id", checkAuth, updateAppointmentStatus);

module.exports = notification;
