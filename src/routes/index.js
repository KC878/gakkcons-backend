const express = require("express");

const user = require("./user");
const appointment = require("./appointment");
const teacher = require("./teacher");

const api = express.Router();

api.use("/users", user);
api.use("/appointments", appointment);
api.use("/teachers", teacher);

module.exports = api;
