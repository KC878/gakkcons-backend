const express = require("express");

const user = require("./user");
const appointment = require("./appointment");
const teacher = require("./teacher");
const notification = require("./notification");
const notificationController = require("../controllers/notification");
const appointmentController = require("../controllers/appointment");

const api = express.Router();

api.use("/users", user);
api.use("/appointments", appointment);
api.use("/teachers", teacher);
api.use("/notifications", notification);
api.get("/notifications", notificationController.getNotifications);
api.get("/appointments", appointmentController.getAppointments);

module.exports = api;
