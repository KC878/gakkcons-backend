const getUserByEmail = `
  SELECT * FROM Users WHERE email = $1;
`;

const createUser = `
  INSERT INTO Users (password, first_name, last_name, email)
  VALUES ($1, $2, $3, $4)
  RETURNING user_id;
`;

const checkEmailExists = `
  SELECT * FROM Users WHERE email = $1;
`;

const assignUserRole = `
    INSERT INTO User_Roles (user_id, role_id)
    VALUES ($1, $2);
  `;

const updateUserPassword = `
    UPDATE users SET password = $1 WHERE user_id = $2;
`;
const getUserById = `
  SELECT 
    email,
    first_name,
    last_name
  FROM Users
  WHERE user_id = $1;  
`;
const updateUser = `
  UPDATE Users
  SET first_name = $1,
      last_name = $2,
      email = $3,
      password = $4
  WHERE user_id = $5;
`;

module.exports = {
  getUserByEmail,
  createUser,
  checkEmailExists,
  assignUserRole,
  updateUserPassword,
  getUserById,
  updateUser,
};
