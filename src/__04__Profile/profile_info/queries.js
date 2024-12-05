// src/profile/queries.js

// Get user details based on user_id
const getUserById = `
  SELECT 
    email,
    first_name,
    last_name
  FROM Users
  WHERE user_id = $1;  
`;

module.exports = {
  getUserById,
};
