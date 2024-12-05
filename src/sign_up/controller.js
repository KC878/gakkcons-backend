const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const queries = require('./queries');
const pool = require('../db'); // Assuming you have your pool configured for PostgreSQL

// Sign up function
const signup = async (req, res) => {
  const { password, first_name, last_name, email } = req.body;

  try {
    // Check if email already exists
    const emailCheckResult = await pool.query(queries.checkEmailExists, [email]);

    if (emailCheckResult.rows.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash password before saving to DB
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the user into the database and return the new user's ID
    const newUserResult = await pool.query(queries.createUser, [
      hashedPassword,
      first_name,
      last_name,
      email,
    ]);

    if (newUserResult.rows.length === 0) {
      throw new Error('Failed to create user');
    }

    const newUserId = newUserResult.rows[0].user_id;

    // INSERT into the User_Roles table with role_id = 3
    await pool.query(queries.assignUserRole, [newUserId, 3]);

    // Generate JWT token after user is created
    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send success response with JWT token
    res.status(201).json({
      message: `User created successfully and User ${email} is assigned to role 3 = Student`,
      token,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { signup };
