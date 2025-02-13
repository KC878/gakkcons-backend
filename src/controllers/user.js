const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userQueries = require("./../db/queries/user");
const pool = require("./../db/pool");
const generateVerificationCode = require("../utils/generateCode");
const sendEmail = require("../utils/sendEmail");
const { getSocket } = require("../utils/socketIO");
//Login

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const userResult = await pool.query(userQueries.getUserByEmail, [email]);

    const user = userResult.rows[0];

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const userVerificationQuery = await pool.query(
      userQueries.getUserVerification,
      [user.user_id, "signup_verify_user"]
    );

    const userVerification = userVerificationQuery.rows[0];

    if (userVerification) {
      return res.status(400).json({ message: "User is not verified yet." });
    }

    if (!user.is_active) {
      return res.status(400).json({
        message:
          "Your account is currently deactivated. Please contact admin for support.",
      });
    }

    const token = jwt.sign(
      { user_id: user.user_id, email: user.email, user_role: user.role_name },
      process.env.JWT_SECRET
    );

    const userType = user.role_name;

    res.status(200).json({
      message: "Login successful",
      token,
      userType,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const signupUser = async (req, res) => {
  try {
    const { password, firstName, lastName, email, userType, id_number } =
      req.body;

    await pool.query("BEGIN");

    const emailCheckResult = await pool.query(userQueries.checkEmailExists, [
      email,
    ]);

    if (emailCheckResult.rows.length > 0) {
      return res
        .status(400)
        .json({ status: "error", message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUserResult = await pool.query(userQueries.createUser, [
      hashedPassword,
      firstName,
      lastName,
      email,
      id_number,
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

    await pool.query(userQueries.assignUserRole, [newUserId, userType]);

    await pool.query("COMMIT");

    res.status(201).json({
      message: `User created successfully.`,
      userId: newUserId,
    });
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error(err.message);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

// with default password 2025@lastname
const signupUserByAdmin = async (req, res) => {
  try {
    const {
      password,
      firstName,
      lastName,
      email,
      userType,
      id_number,
      subjectId,
    } = req.body;

    await pool.query("BEGIN");

    // Check if the email already exists
    const emailCheckResult = await pool.query(userQueries.checkEmailExists, [
      email,
    ]);

    if (emailCheckResult.rows.length > 0) {
      return res
        .status(400)
        .json({ status: "error", message: "Email already exists" });
    }

    // Set default password if none is provided
    const defaultPassword = `2025@${lastName.toLowerCase()}`;
    const finalPassword = password || defaultPassword;

    // Hash the password
    const hashedPassword = await bcrypt.hash(finalPassword, 10);

    // Create the user
    const newUserResult = await pool.query(userQueries.createUser, [
      hashedPassword,
      firstName,
      lastName,
      email,
      id_number || null, // Handle optional ID number
    ]);

    if (newUserResult.rows.length === 0) {
      throw new Error("Failed to create user");
    }

    const newUserId = newUserResult.rows[0].user_id;

    // Assign the user role
    await pool.query(userQueries.assignUserRole, [newUserId, userType]);

    // Assign subject if the user is faculty
    if (userType === "faculty" && subjectId) {
      await pool.query(userQueries.assignSubject, [newUserId, subjectId]);
    }

    await pool.query("COMMIT");

    res.status(201).json({
      message: `User created successfully by admin.`,
      userId: newUserId,
      defaultPassword: finalPassword, // Include the default password in the response
    });
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error(err.message);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

const deleteUser = async (req, res) => {
  const { user_id } = req.params; // Assuming `user_id` is passed as a URL parameter

  try {
    // Begin transaction
    await pool.query("BEGIN");

    const updateQuery = `
      UPDATE users
      SET is_active = 1
      WHERE user_id = $1
    `;

    const result = await pool.query(updateQuery, [user_id]);

    if (result.rowCount === 0) {
      // If no rows were updated, return a 404 error
      await pool.query("ROLLBACK");
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }
    // Commit transaction
    await pool.query("COMMIT");

    res.status(200).json({
      status: "success",
      message: `User with ID ${user_id} has been soft deleted (is_active = 1)`,
    });
  } catch (error) {
    // Rollback transaction on error
    await pool.query("ROLLBACK");
    console.error("Error soft deleting user:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

const updateUserActivationStatus = async (req, res) => {
  const { user_id, is_active } = req.body;
  const io = getSocket();

  try {
    await pool.query("BEGIN");

    const result = await pool.query(userQueries.updateUserActivationStatus, [
      user_id,
      is_active,
    ]);

    if (result.rowCount === 0) {
      await pool.query("ROLLBACK");
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }
    io.to(user_id).emit("user_status", {
      is_active: is_active,
    });
    await pool.query("COMMIT");

    res.status(200).json({
      status: "success",
      message: `User with ID ${user_id} has successfully updated activation status`,
    });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error soft deleting user:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { first_name, last_name, email, password, id_number, subject_id } =
      req.body;

    await pool.query("BEGIN");

    // If password is provided, hash it
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Construct the base UPDATE query
    let updateQuery = `
      UPDATE users
      SET first_name = $1, last_name = $2, email = $3, id_number = $4
    `;
    let values = [first_name, last_name, email, id_number || null];

    // Conditionally add password to the query if it exists
    if (password) {
      updateQuery += `, password = $5`;
      values.push(hashedPassword); // Push the hashed password
    }

    // Finalizing the query with the WHERE clause
    updateQuery += ` WHERE user_id = $${values.length + 1} RETURNING user_id`;
    values.push(user_id); // Add the user_id to the values array

    const result = await pool.query(updateQuery, values);

    if (result.rows.length === 0) {
      throw new Error("User not found");
    }

    // If the user is a faculty and subject_id is provided, update subject
    if (subject_id) {
      await pool.query(
        "UPDATE user_subjects SET subject_id = $1 WHERE user_id = $2",
        [subject_id, user_id]
      );
    }

    await pool.query("COMMIT");

    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error(err.message);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

const verifyUser = async (req, res) => {
  try {
    const { email, verificationCode, codeType } = req.body;

    await pool.query("BEGIN");

    const userResult = await pool.query(userQueries.getUserByEmail, [email]);

    const user = userResult.rows[0];

    const verificationResult = await pool.query(
      userQueries.checkVerificationCode,
      [user.user_id, verificationCode, codeType]
    );

    if (verificationResult.rows.length === 0) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    const expirationTime = verificationResult.rows[0]?.expiration_time;

    if (new Date() > new Date(expirationTime)) {
      return res
        .status(400)
        .json({ message: "Verification code has expired." });
    }

    await pool.query(userQueries.updateUserActivationStatusToTrue, [
      user.user_id,
    ]);

    await pool.query(userQueries.deleteVerificationCode, [user.user_id]);

    await pool.query("COMMIT");

    res.status(200).json({ message: "User verified successfully" });
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error(err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    await pool.query("BEGIN");
    const userResult = await pool.query(userQueries.getUserByEmail, [email]);

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: "User not found." });
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
    });
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { email, verificationCode, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const userResult = await pool.query(userQueries.getUserByEmail, [email]);

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: "User not found." });
    }

    const user = userResult.rows[0];

    const codeResult = await pool.query(userQueries.checkVerificationCode, [
      user.user_id,
      verificationCode,
      "reset_password",
    ]);

    if (codeResult.rows.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification code." });
    }

    const verificationRecord = codeResult.rows[0];

    if (verificationRecord.code !== verificationCode) {
      return res.status(400).json({ message: "Incorrect verification code." });
    }

    const currentTime = new Date();
    if (currentTime > new Date(verificationRecord.expiration_time)) {
      return res
        .status(400)
        .json({ message: "Verification code has expired." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(userQueries.updateUserPassword, [
      hashedPassword,
      user.user_id,
    ]);

    await pool.query(userQueries.deleteVerificationCode, [user.user_id]);

    res.status(200).json({
      message: "Password has been successfully updated.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    await pool.query("BEGIN");

    const userResult = await pool.query(userQueries.getUserByEmail, [email]);

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: "User not found." });
    }

    const user = userResult.rows[0];

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(userQueries.updateUserPassword, [
      hashedPassword,
      user.user_id,
    ]);

    await pool.query("COMMIT");
    res.status(200).json({ message: "Password reset successful." });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
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
      user_id: rows[0].user_id,
      email: rows[0].email,
      first_name: rows[0].first_name,
      last_name: rows[0].last_name,
      id_number: rows[0].id_number,
      mode: rows[0].mode,
      is_active: rows[0].is_active,
      role: rows[0].role_name,
    });
  } catch (err) {
    console.error("Error fetching profile info:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
//Update Profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const {
      firstName,
      lastName,
      email,
      id_number,
      currentPassword,
      newPassword,
    } = req.body;

    console.log(id_number); // Ensure this is correctly populated before executing the query

    await pool.query("BEGIN");

    if (!firstName || !lastName) {
      return res
        .status(400)
        .json({ message: "First name and last name must not be empty." });
    }

    if (newPassword && !currentPassword) {
      return res.status(400).json({ message: "Invalid current password" });
    }

    const userResult = await pool.query(userQueries.getUserById, [userId]);

    const user = userResult.rows[0];

    if (currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid current password" });
      }
    }

    const updates = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: newPassword ? await bcrypt.hash(newPassword, 10) : undefined,
      id_number,
    };

    const setClauses = [];
    const values = [];
    let index = 1;

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        setClauses.push(`${key} = $${index}`);
        values.push(value);
        index++;
      }
    }

    const query = `
      UPDATE Users
      SET ${setClauses.join(", ")}
      WHERE user_id = ${userId};
    `;

    await pool.query(query, values);

    await pool.query("COMMIT");
    res.status(200).json({
      message: "Profile updated successfully",
    });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updatePreferMode = async (req, res) => {
  try {
    const { preferMode } = req.body;

    // Extract user_id from token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized access." });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.user_id;

    // Update the prefer mode
    await pool.query(userQueries.updatePreferModeQuery, [preferMode, userId]);

    res.status(200).json({ message: "Mode updated successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getSubjects = async (req, res) => {
  try {
    // Query to get all subjects
    const result = await pool.query("SELECT * FROM subjects");

    // Send the subjects as a response
    res.status(200).json({
      status: "success",
      data: result.rows,
    });
  } catch (err) {
    console.error("Error fetching subjects:", err.message);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

const getUsers = async (req, res) => {
  try {
    // Execute the query to fetch all users with their roles by joining the `users`, `user_roles`, and `roles` tables
    const result = await pool.query(`
      SELECT 
        users.user_id, 
        users.password, 
        users.first_name, 
        users.last_name, 
        users.email, 
        users.id_number, 
        users.mode,
        users.is_active, 
        roles.role_name
      FROM users
      LEFT JOIN user_roles ON users.user_id = user_roles.user_id
      LEFT JOIN roles ON user_roles.role_id = roles.role_id
      WHERE roles.role_name != 'admin'
      ORDER BY users.user_id DESC
    `);

    // Check if data is found
    if (result.rows.length > 0) {
      return res.status(200).json({ status: "success", data: result.rows });
    } else {
      return res
        .status(404)
        .json({ status: "error", message: "No users found" });
    }
  } catch (err) {
    console.error("Error fetching users:", err.message);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error" });
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
  updatePreferMode,
  changePassword,
  signupUserByAdmin,
  getSubjects,
  getUsers,
  deleteUser,
  updateUser,
  updateUserActivationStatus,
};
