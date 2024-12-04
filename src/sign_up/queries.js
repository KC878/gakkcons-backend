// SQL query to create a new user
const createUser = `
  INSERT INTO Users (password, first_name, last_name, email)
  VALUES ($1, $2, $3, $4);
`;

// SQL query to check if the email already exists
const checkEmailExists = `
  SELECT * FROM Users WHERE email = $1;
`;

module.exports = {
  createUser,
  checkEmailExists
};
