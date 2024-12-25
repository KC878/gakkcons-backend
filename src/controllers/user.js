const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const userQueries = require("./../db/queries/user");
const pool = require("./../db/pool");

const crypto = require("crypto");


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userResult = await pool.query(userQueries.getUserByEmail, [email]);

    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = userResult.rows[0];

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
    const { password, first_name, last_name, email } = req.body;
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

    await pool.query(userQueries.assignUserRole, [newUserId, 3]);

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: `User created successfully and User ${email} is assigned to role 3 = Student`,
      token,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/*
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const userResult = await pool.query(userQueries.getUserByEmail, [email]);

    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = userResult.rows[0];

    const resetToken = jwt.sign(
      { user_id: user.user_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
   // instead of token number - 
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      text: `You requested a password reset. Click the link below to reset your password:\n\n${resetUrl}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset email sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(userQueries.updateUserPassword, [
      hashedPassword,
      decoded.email,
    ]);

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Invalid or expired token" });
  }
};
*/

// forgotPassword -- section 

// Generate a random 6-character alphanumeric code
const generateVerificationCode = () => {
  return crypto.randomBytes(3).toString("hex").toUpperCase(); // Generates 6-character code
};

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    // Fetch user_id using the provided email
    const userQueryResult = await pool.query("SELECT user_id FROM users WHERE email = $1", [email]);
    const userId = userQueryResult.rows[0]?.user_id;

    if (!userId) {
      return res.status(404).json({ message: "User not found." });
    }

    // Generate verification code
    const verificationCode = generateVerificationCode();

    // Create expiration time for the code - set to 15 at default
    const expirationTime = new Date(Date.now() + 15 * 60 * 1000);

    
    // Configure email details
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Verification Code",
      text: `You requested a password reset. Use the verification code below to reset your password:\n\nVerification Code: ${verificationCode}\n\nThis code will expire in 15 minutes.`,
    };

    // Save verification code with `is_verified` set to `null`
    await pool.query(userQueries.saveVerificationCode, [userId, verificationCode, expirationTime]);

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Verification code sent to your email." });
  } catch (error) {
    console.error("Error in forgotPassword:", error.message);
    res.status(500).json({ message: "Failed to send verification code." });
  }
};

// reset Password
const resetPassword = async (req, res) => {
  try {
    const { user_id, verificationCode, newPassword } = req.body;

    // Retrieve verification code, expiration time, and is_verified from the database for the specific user_id
    const result = await pool.query(userQueries.getResultVerificationCode, [user_id, verificationCode]);

    // Check if the result is empty or no matching entry is found
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Invalid user_id or verification code not found." });
    }

    const storedCode = result.rows[0]?.code;
    const expirationTime = result.rows[0]?.expiration_time;
    const isVerified = result.rows[0]?.is_verified;

    // Validate the code
    if (!storedCode || storedCode !== verificationCode) {
      return res.status(400).json({ message: "Invalid verification code." });
    }

    // Check if the code has expired
    if (new Date() > new Date(expirationTime)) {
      // Set the verification to false if expired
      await pool.query(userQueries.setFalseVerificationCode, [user_id, verificationCode]);
      return res.status(400).json({ message: "Verification code has expired." });
    }

    // Check if the code is already verified
    if (isVerified) {
      return res.status(400).json({ message: "Verification code has already been used." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    await pool.query(userQueries.updateUserPassword, [hashedPassword, user_id]);
    console.log(newPassword);

    // Mark the verification code as verified
    await pool.query( userQueries.setTrueVerificationCode, [user_id, verificationCode]);

    res.status(200).json({ message: "Password reset successful." });
  } catch (error) {
    console.error("Error in resetPassword:", error.message);
    res.status(500).json({ message: "Failed to reset password." });
  }
};


const getProfile = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { rows } = await db.query(userQueries.getUserById, [userId]);

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
    const result = await db.query(userQueries.updateUser, [
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
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
};