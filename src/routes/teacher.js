const express = require("express");

const { getTeachers, searchTeacher } = require("../controllers/teacher");

const teacher = express.Router();

teacher.get("/", getTeachers);
teacher.get("/search", searchTeacher);

module.exports = teacher;
