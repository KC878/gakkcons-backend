// SQL query to get a user by email
const getUserByEmail = `
  SELECT * FROM Users WHERE email = $1;
`;

module.exports = {
  getUserByEmail,
};
