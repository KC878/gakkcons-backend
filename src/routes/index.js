const express = require("express");

const user = require("./user");
const appointment = require("./appointment");

const api = express.Router();

api.use("/user", user);
api.use("/appointment", appointment);

module.exports = api;
