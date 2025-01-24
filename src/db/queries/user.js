const getUserByEmail = `
  SELECT 
    Users.*,
    User_Roles.role_id
  FROM 
    Users
  LEFT JOIN 
    User_Roles 
  ON 
    Users.user_id = User_Roles.user_id
  WHERE 
    Users.email = $1;
`;

const createUser = `
  INSERT INTO Users (password, first_name, last_name, email, id_number)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING user_id;
`;

const createUserByAdmin = `
  INSERT INTO Users (password, first_name, last_name, email, id_number, subject)
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING user_id;
`;


const getUserVerification = `
  SELECT * FROM user_verifications WHERE user_id = $1 AND code_type = $2
`;

const checkEmailExists = `
  SELECT * FROM Users WHERE email = $1;
`;

const assignUserRole = `
    INSERT INTO User_Roles (user_id, role_id)
    VALUES ($1, $2);
  `;

const assignSubject = `
  INSERT INTO User_Subjects (user_id, subject_id)
  VALUES ($1, $2)
`;

const saveVerificationCode = `
    INSERT INTO user_verifications (user_id, code, expiration_time, code_type)
    VALUES ($1, $2, $3, $4)
  `;

const checkVerificationCode = `SELECT code, expiration_time
       FROM user_verifications
       WHERE user_id = $1 AND code = $2 AND code_type = $3`;

const deleteVerificationCode = `DELETE FROM user_verifications 
       WHERE user_id = $1`;

const updateUserPassword = `
    UPDATE Users SET password = $1 WHERE user_id = $2;
`;

const getUserById = `
  SELECT
    user_id, 
    email,
    first_name,
    last_name,
    password,
    id_number,
    mode
  FROM Users
  WHERE user_id = $1;  
`;

const updatePreferModeQuery = `
UPDATE Users
SET 
  mode = $1
WHERE 
  user_id = $2;
`;




module.exports = {
  getUserByEmail,
  createUser,
  getUserVerification,
  checkEmailExists,
  assignUserRole,
  saveVerificationCode,
  checkVerificationCode,
  deleteVerificationCode,
  updateUserPassword,
  getUserById,
  updatePreferModeQuery,
  assignSubject,
  createUserByAdmin,
};
