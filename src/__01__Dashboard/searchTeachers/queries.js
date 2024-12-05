const pool = require('./../../db'); // Import the pool from db.js


// In your queries file (queries.js)
const search = async (query) => {
  const client = await pool.connect(); // Connect to the database
  try {
    const res = await client.query(
      `SELECT u.first_name, u.last_name
       FROM users u
       JOIN user_roles ur ON u.user_id = ur.user_id
       JOIN roles r ON ur.role_id = r.role_id
       WHERE r.role_id = 2 -- Filter for faculty role
       AND u.first_name ILIKE $1 
       ORDER BY u.first_name 
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
