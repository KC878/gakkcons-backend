const getUserByEmail = `
  SELECT * FROM Users WHERE email = $1;
`;

/*const updateUserPassword = `
  UPDATE Users SET password = $1 WHERE email = $2;
`;*/ // remove this comment if using the email but for now use user id for testing purposes

const updateUserPassword = `
    UPDATE users SET password = $1 WHERE user_id = $2;
`;

module.exports = {
  getUserByEmail,   // Query to get user by email
  updateUserPassword,  // Query to update user password
};
