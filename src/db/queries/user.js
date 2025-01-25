const getUserByEmail = `
  SELECT 
    Users.*,
    Roles.role_name
  FROM 
    Users
  LEFT JOIN 
    User_Roles 
  ON 
    Users.user_id = User_Roles.user_id
  LEFT JOIN 
    Roles
  ON 
    User_Roles.role_id = Roles.role_id
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
  VALUES (
    $1, 
    (SELECT role_id FROM Roles WHERE role_name = $2)
  );
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
    u.user_id, 
    u.email,
    u.first_name,
    u.last_name,
    u.password,
    u.id_number,
    u.mode,
    u.is_active,  
    r.role_name
  FROM Users u
  LEFT JOIN User_Roles ur ON u.user_id = ur.user_id
  LEFT JOIN Roles r ON ur.role_id = r.role_id
  WHERE u.user_id = $1;
`;

const updatePreferModeQuery = `
UPDATE Users
SET 
  mode = $1
WHERE 
  user_id = $2;
`;

const updateUserActivationStatus = `
  UPDATE users
  SET is_active = $2
  WHERE user_id = $1 AND is_active != $2;
`;

const updateUserActivationStatusToTrue = `
  UPDATE users
  SET is_active = TRUE
  WHERE user_id = $1
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
  updateUserActivationStatus,
  updateUserActivationStatusToTrue,
};
