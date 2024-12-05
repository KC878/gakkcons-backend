// SQL query to create a new user
const createUser = `
  INSERT INTO Users (password, first_name, last_name, email)
  VALUES ($1, $2, $3, $4)
  RETURNING user_id;
`;

// SQL query to check if the email already exists
const checkEmailExists = `
  SELECT * FROM Users WHERE email = $1;
`;


const assignUserRole = `
    INSERT INTO User_Roles (user_id, role_id)
    VALUES ($1, $2);
  `;

module.exports = {
  createUser,
  checkEmailExists,
  assignUserRole
};
