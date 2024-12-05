require('dotenv').config(); // Load environment variables
const pool = require('./../../db'); // Import the pool from db.js

// Function to search for teacher names
const search = async (query) => {
  const client = await pool.connect(); // Connect to the database
  try {
    const res = await client.query(
      `SELECT first_name 
       FROM users 
       WHERE first_name ILIKE $1 
       ORDER BY first_name 
       LIMIT 10`,
      [`%${query}%`] // Use ILIKE for case-insensitive matching
    );
    return res.rows; // Return the resulting rows
  } catch (error) {
    throw new Error('Error while querying the database'); // Handle query errors
  } finally {
    client.release(); // Release the connection
  }
};

module.exports = {
  search,
};
