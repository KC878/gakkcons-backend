const express = require("express");

const { getTeachers, searchTeacher } = require("../controllers/teacher");
const checkAuth = require("../middlewares/auth");

const teacher = express.Router();

teacher.get("/", checkAuth, getTeachers);
teacher.get("/search", checkAuth, searchTeacher);

module.exports = teacher;
