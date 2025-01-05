const express = require("express");

const { getTeachers } = require("../controllers/teacher");
const checkAuth = require("../middlewares/auth");

const teacher = express.Router();

teacher.get("/", checkAuth, getTeachers);

module.exports = teacher;
