const express = require("express");

const user = require("./user");

const api = express.Router();

api.use("/user", user);

module.exports = api;
