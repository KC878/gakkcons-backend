const getUserByEmail = `
  SELECT * FROM Users WHERE email = $1;
`;

const createUser = `
  INSERT INTO Users (password, first_name, last_name, email)
  VALUES ($1, $2, $3, $4)
  RETURNING user_id;
`;

const getUserVerification = `
  SELECT * FROM user_verifications WHERE user_id = $1
`;

const checkEmailExists = `
  SELECT * FROM Users WHERE email = $1;
`;

const assignUserRole = `
    INSERT INTO User_Roles (user_id, role_id)
    VALUES ($1, $2);
  `;

const saveVerificationCode = `
    INSERT INTO user_verifications (user_id, code, expiration_time, is_used, code_type)
    VALUES ($1, $2, $3, FALSE, $4)
  `;

const checkVerificationCode = `SELECT code, expiration_time, is_used
       FROM user_verifications
       WHERE user_id = $1 AND code = $2 AND code_type = $3`;

const setTrueVerificationCode = `UPDATE user_verifications SET is_used = TRUE 
         WHERE user_id = $1 AND code = $2`;

const updateUserPassword = `
    UPDATE Users SET password = $1 WHERE user_id = $2;
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
  getUserVerification,
  checkEmailExists,
  assignUserRole,
  saveVerificationCode,
  checkVerificationCode,
  setTrueVerificationCode,
  updateUserPassword,
  getUserById,
  updateUser,
};
