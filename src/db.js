require('dotenv').config();

const { Pool } = require('pg');

// Create a pool connection to PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

console.log('DB_PASSWORD:', process.env.DB_PASSWORD);

module.exports = pool;
