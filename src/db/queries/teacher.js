require("dotenv").config(); // Load environment variables
const pool = require("./../pool");
// Function to get the list of teachers with their department and role
const getTeachers = async () => {
  const client = await pool.connect(); // Get a client from the pool
  try {
    const result = await client.query(`
      SELECT 
        u.first_name || ' ' || u.last_name AS name, 
        ur.role_id, 
        ur.user_id,
        ud.department_name AS college_department
      FROM 
        users u
      JOIN 
        user_roles ur ON ur.user_id = u.user_id
      JOIN 
        college_department ud ON ud.department_head_id = u.user_id
      WHERE 
        ur.role_id = 2  -- Assuming role_id 2 corresponds to 'faculty'
      ORDER BY 
        u.first_name;
    `);

    // Format the results for better clarity
    const teachers = result.rows.map((row) => ({
      name: row.name,
      role: "faculty", // Assuming all selected users are faculty
      college_department: row.college_department,
    }));

    return teachers; // Return the list of teachers
  } catch (error) {
    console.error("Database query error:", error);
    throw new Error("Error while querying the database"); // Handle query errors
  } finally {
    client.release(); // Ensure that the client is released back to the pool
  }
};

const searchTeacher = async (query) => {
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
    throw new Error("Error while querying the database"); // Handle query errors
  } finally {
    client.release(); // Release the connection
  }
};

module.exports = {
  getTeachers,
  searchTeacher,
};
