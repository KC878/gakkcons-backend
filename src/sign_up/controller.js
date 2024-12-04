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

    // Insert the user into the database
    await pool.query(queries.createUser, [hashedPassword, first_name, last_name, email]);

    // Generate JWT token after user is created
    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send success response with JWT token
    res.status(201).json({
      message: 'User created successfully',
      token,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { signup };
