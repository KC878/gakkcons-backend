// src/profile/controller.js

const db = require('../../db');  // Database connection
const queries = require('./queries');  // Import the queries

// Get the profile of the logged-in user using the token
const getProfile = async (req, res) => {
  const userId = req.user.user_id;  // Get user_id from the decoded JWT token

  try {
    // Query to get the user's profile using user_id
    const { rows } = await db.query(queries.getUserById, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the user's profile info (email and name)
    res.status(200).json({
      email: rows[0].email,
      first_name: rows[0].first_name,
      last_name: rows[0].last_name,
    });
  } catch (err) {
    console.error('Error fetching profile info:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { getProfile };
