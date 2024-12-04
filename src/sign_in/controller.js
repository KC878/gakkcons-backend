const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const queries = require('./queries');
const pool = require('./../db'); //

// Login function
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists by email
    const userResult = await pool.query(queries.getUserByEmail, [email]);

    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    // Compare the password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate a JWT token after successful login
    const token = jwt.sign(
      { user_id: user.user_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send the token in the response
    res.status(200).json({
      message: 'Login successful',
      token,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { login };
