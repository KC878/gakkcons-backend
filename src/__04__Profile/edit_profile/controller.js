const db = require('./../../db');  // Database connection
const queries = require('./queries');  // Import queries from queries.js

// Update the profile of the logged-in user
const updateProfile = async (req, res) => {
  const userId = req.user.user_id;  // Get the user ID from the decoded JWT token
  const { first_name, last_name, email, password } = req.body;  // Get the updated details from the request body

  // Basic validation for required fields
  if (!first_name || !email || !password) {
    return res.status(400).json({ error: 'First name, email, and password are required' });
  }

  try {
    // Update the user's profile in the database
    const result = await db.query(queries.updateUser, [
      first_name,
      last_name,
      email,
      password,
      userId
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile updated successfully'
    });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { updateProfile };
