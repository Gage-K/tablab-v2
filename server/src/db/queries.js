const pool = require("./pool");
require("dotenv").config();

// USER READ FUNCTIONS

// read function for all users
async function getAllUsers() {
  const { rows } = await pool.query("SELECT * FROM users");
  return rows;
}

// read function for user by username
async function getUserByUsername(username) {
  const values = [username];
  const { rows } = await pool.query(
    "SELECT * FROM users WHERE username=$1",
    values
  );
  return rows;
}

async function getUserById(id) {
  const values = [id];
  const { rows } = await pool.query(`SELECT * FROM users WHERE id=$1`, values);
  return rows;
}

async function getUserByEmail(email) {
  const values = [email];
  const { rows } = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    values
  );
  return rows;
}

// USER CREATE FUNCTIONS

// create function for a single user; returns new user's id
async function insertUser(username, email, password) {
  const values = [username, email, password, new Date()];

  // first grabs data for any users with identical credentials
  const emailData = await getUserByEmail(email);
  const usernameData = await getUserByUsername(username);

  // next returns errors and aborts IF email or username credentials exist in database
  if (emailData[0]) {
    console.error(
      `User with email of ${email} already exists. Create user aborted.`
    );
    return;
  }
  if (usernameData[0]) {
    console.error(
      `User with username of ${username} already exists. Create user aborted.`
    );
    return;
  }

  // then if no credentials already exist, create new user
  await pool.query(
    `INSERT INTO users (username, email, password, created_at)
                            VALUES ($1, $2, $3, $4)`,
    values
  );

  // return new user's id
  const userDetails = await getUserByUsername(username);
  return userDetails[0].id;
}

// USER UPDATE FUNCTIONS

async function updateUserPassword(id, newPassword) {
  const values = [id, newPassword];

  // check if user with id exists

  const userData = await getUserById(id);
  if (!userData[0]) {
    console.error(
      `User with id of ${id} does not exist. Update password aborted.`
    );
    return;
  }
  await pool.query(`UPDATE users SET password=$2 WHERE id=$1`, values);
  console.log(`Password for user with id of ${id} updated`);
}

async function updateUserEmail(id, newEmail) {
  const values = [id, newEmail];

  // check if user with id exists
  const userData = await getUserById(id);
  if (!userData[0]) {
    console.error(
      `User with id of ${id} does not exist. Update email aborted.`
    );
    return;
  }

  await pool.query(`UPDATE users SET email=$2 WHERE id=$1`, values);
  console.log(`Email for user with id of ${id} updated`);
}

// USER DELETE FUNCTIONS

async function deleteUser(id) {
  const values = [id];

  // check if user with id exists
  const userData = await getUserById(id);
  if (!userData[0]) {
    console.error(`User with id of ${id} does not exist. Delete aborted.`);
    return;
  }

  await pool.query(`DELETE FROM users WHERE id=$1`, values);
  console.log(`User with id of ${id} deleted`);
}

module.exports = {
  getAllUsers,
  getUserByUsername,
  getUserById,
  getUserByEmail,
  insertUser,
  updateUserPassword,
  updateUserEmail,
  deleteUser,
};
