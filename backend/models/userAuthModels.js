const client = require('../db');
const bcrypt = require('bcrypt');

async function registerUser({ username, email, password }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  await client.query(
    'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
    [username, email, hashedPassword]
  );
}

async function isEmailTaken(email) {
  const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows.length > 0;
}

async function findUserByEmail(email) {
  const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
}

module.exports = {registerUser, isEmailTaken, findUserByEmail};
