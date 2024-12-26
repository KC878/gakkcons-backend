const crypto = require("crypto");

const generateVerificationCode = () => {
  return crypto.randomBytes(3).toString("hex").toUpperCase(); // Generates 6-character code
};

module.exports = generateVerificationCode;
