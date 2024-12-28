const crypto = require("crypto");

const generateVerificationCode = () => {
  const min = 100000;
  const max = 999999;
  return Math.floor(min + crypto.randomInt(max - min + 1));
};

module.exports = generateVerificationCode;
