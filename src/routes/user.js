const express = require("express");

const checkAuth = require("./../middlewares/auth");
const {
  loginUser,
  signupUser,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  verifyUser,
  updatePreferMode,
  changePassword,
  signupUserByAdmin,
  getSubjects,
  getUsers,
  deleteUser,
  updateUser,
  
} = require("../controllers/user");

const user = express.Router();

user.post("/login", loginUser);
user.post("/signup", signupUser);
user.post("/signupadmin", signupUserByAdmin);
user.post("/verify", verifyUser);
user.post("/password/forgot", forgotPassword);
user.post("/password/reset", resetPassword);
user.post("/password/forgot/reset", changePassword);
user.get("/profile", checkAuth, getProfile);
user.put("/profile/update", checkAuth, updateProfile);
user.put("/profile/mode/update", checkAuth, updatePreferMode);
user.get("/subjects", getSubjects);
user.get('/getUsers', getUsers);
user.put('/delete/:user_id', checkAuth, deleteUser);
user.put("/edit/:user_id", checkAuth, updateUser);



module.exports = user;
