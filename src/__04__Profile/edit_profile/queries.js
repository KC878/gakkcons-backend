// SQL query to update a user's profile (first_name, last_name, email, password)
const updateUser = `
  UPDATE Users
  SET first_name = $1,
      last_name = $2,
      email = $3,
      password = $4
  WHERE user_id = $5;
`;

module.exports = {
  updateUser,
};
