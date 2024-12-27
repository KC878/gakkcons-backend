const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userQueries = require("./../db/queries/user");
const pool = require("./../db/pool");
const generateVerificationCode = require("../utils/generateCode");
const sendEmail = require("../utils/sendEmail");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userResult = await pool.query(userQueries.getUserByEmail, [email]);

    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = userResult.rows[0];

    const userVerificationQuery = await pool.query(
      userQueries.getUserVerification,
      [user.user_id]
    );

    const userVerification = userVerificationQuery.rows[0];

    if (!userVerification.is_used) {
      return res.status(400).json({ error: "User is not verified yet." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { user_id: user.user_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const signupUser = async (req, res) => {
  try {
    const { password, first_name, last_name, email, user_type } = req.body;

    await pool.query("BEGIN");

    const emailCheckResult = await pool.query(userQueries.checkEmailExists, [
      email,
    ]);

    if (emailCheckResult.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUserResult = await pool.query(userQueries.createUser, [
      hashedPassword,
      first_name,
      last_name,
      email,
    ]);

    if (newUserResult.rows.length === 0) {
      throw new Error("Failed to create user");
    }

    const newUserId = newUserResult.rows[0].user_id;

    const verificationCode = generateVerificationCode();

    const expirationTime = new Date(Date.now() + 60 * 60 * 1000);

    await pool.query(userQueries.saveVerificationCode, [
      newUserId,
      verificationCode,
      expirationTime,
      "signup_verify_user",
    ]);

    const subject = "Sign Up Verification Code";
    const text = `Welcome! Use the verification code below to complete your sign-up process:\n\nVerification Code: ${verificationCode}\n\nThis code will expire in 1 hour.`;

    await sendEmail(email, subject, text);

    await pool.query(userQueries.assignUserRole, [
      newUserId,
      user_type === "faculty" ? 2 : user_type === "admin" ? 1 : 3,
    ]);

    await pool.query("COMMIT");

    res.status(201).json({
      message: `User created successfully.`,
      userId: newUserId,
    });
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const verifyUser = async (req, res) => {
  try {
    const { user_id, verificationCode } = req.body;

    await pool.query("BEGIN");

    const verificationResult = await pool.query(
      userQueries.checkVerificationCode,
      [user_id, verificationCode, "signup_verify_user"]
    );

    const expirationTime = verificationResult.rows[0]?.expiration_time;
    const isUsed = verificationResult.rows[0]?.is_used;

    if (new Date() > new Date(expirationTime)) {
      return res
        .status(400)
        .json({ message: "Verification code has expired." });
    }

    if (isUsed) {
      return res
        .status(400)
        .json({ message: "Verification code has already been used." });
    }

    if (verificationResult.rows.length === 0) {
      return res
        .status(400)
        .json({ error: "Invalid or expired verification code" });
    }

    await pool.query(userQueries.setTrueVerificationCode, [
      user_id,
      verificationCode,
    ]);

    await pool.query("COMMIT");

    res.status(200).json({ message: "User verified successfully" });
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    await pool.query("BEGIN");
    const userResult = await pool.query(userQueries.getUserByEmail, [email]);

    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const verificationCode = generateVerificationCode();

    const expirationTime = new Date(Date.now() + 15 * 60 * 1000);

    const user = userResult.rows[0];

    await pool.query(userQueries.saveVerificationCode, [
      user.user_id,
      verificationCode,
      expirationTime,
      "reset_password",
    ]);

    const subject = "Password Reset Verification Code";
    const text = `You requested a password reset. Use the verification code below to reset your password:\n\nVerification Code: ${verificationCode}\n\nThis code will expire in 15 minutes.`;

    await sendEmail(email, subject, text);

    await pool.query("COMMIT");

    res.status(200).json({
      message: "Verification code sent to your email.",
      userId: user.user_id,
    });
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { user_id, verificationCode, newPassword } = req.body;
    await pool.query("BEGIN");

    const result = await pool.query(userQueries.checkVerificationCode, [
      user_id,
      verificationCode,
      "reset_password",
    ]);

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "Invalid user_id or verification code not found." });
    }

    const storedCode = result.rows[0]?.code;
    const expirationTime = result.rows[0]?.expiration_time;
    const isUsed = result.rows[0]?.is_used;

    if (storedCode !== verificationCode) {
      return res.status(400).json({ message: "Invalid verification code." });
    }

    if (new Date() > new Date(expirationTime)) {
      return res
        .status(400)
        .json({ message: "Verification code has expired." });
    }

    if (isUsed) {
      return res
        .status(400)
        .json({ message: "Verification code has already been used." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(userQueries.updateUserPassword, [hashedPassword, user_id]);

    await pool.query(userQueries.setTrueVerificationCode, [
      user_id,
      verificationCode,
    ]);
    await pool.query("COMMIT");
    res.status(200).json({ message: "Password reset successful." });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error in resetPassword:", error.message);
    res.status(500).json({ message: "Failed to reset password." });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { rows } = await pool.query(userQueries.getUserById, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      email: rows[0].email,
      first_name: rows[0].first_name,
      last_name: rows[0].last_name,
    });
  } catch (err) {
    console.error("Error fetching profile info:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { first_name, last_name, email, password } = req.body;
    if (!first_name || !email || !password) {
      return res
        .status(400)
        .json({ error: "First name, email, and password are required" });
    }
    const result = await pool.query(userQueries.updateUser, [
      first_name,
      last_name,
      email,
      password,
      userId,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  loginUser,
  signupUser,
  verifyUser,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
};
