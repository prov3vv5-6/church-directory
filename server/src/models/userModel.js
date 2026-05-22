const db = require('../config/db');

// Insert a new user and return the created row
async function createUser(name, email, passwordHash, address, profilePictureUrl) {
  const result = await db.query(
    `INSERT INTO users (name, email, password_hash, address, profile_picture_url)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, address, profile_picture_url, is_admin, created_at`,
    [name, email, passwordHash, address || null, profilePictureUrl || null]
  );
  return result.rows[0];
}

// Find a user by email — returns the full row including password_hash for comparison
async function findUserByEmail(email) {
  const result = await db.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0] || null;
}

// Find a user by ID — omits password_hash since we never want to send it to the frontend
async function findUserById(id) {
  const result = await db.query(
    `SELECT id, name, email, address, profile_picture_url, is_admin, created_at
     FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

// Return all users for the directory — safe fields only, sorted alphabetically
async function getAllUsers() {
  const result = await db.query(
    `SELECT id, name, email, address, profile_picture_url, is_admin
     FROM users
     ORDER BY name ASC`
  );
  return result.rows;
}

// Update a user's editable fields — only updates what's passed in
async function updateUser(id, { name, address, profile_picture_url }) {
  const result = await db.query(
    `UPDATE users
     SET name = COALESCE($1, name),
         address = COALESCE($2, address),
         profile_picture_url = COALESCE($3, profile_picture_url),
         updated_at = NOW()
     WHERE id = $4
     RETURNING id, name, email, address, profile_picture_url, is_admin`,
    [name || null, address || null, profile_picture_url || null, id]
  );
  return result.rows[0] || null;
}

// Update a user's password hash
async function updatePassword(id, newHash) {
  await db.query(
    'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
    [newHash, id]
  );
}

// Delete a user by ID
async function deleteUser(id) {
  await db.query('DELETE FROM users WHERE id = $1', [id]);
}

// Create a one-hour password reset token for the given user
async function createResetToken(userId, token) {
  await db.query(
    `INSERT INTO password_reset_tokens (user_id, token, expires_at)
     VALUES ($1, $2, NOW() + INTERVAL '1 hour')
     ON CONFLICT (token) DO NOTHING`,
    [userId, token]
  );
}

// Find a valid (non-expired) token and return it with the user's email
async function findResetToken(token) {
  const result = await db.query(
    `SELECT t.user_id, t.token, t.expires_at, u.email
     FROM password_reset_tokens t
     JOIN users u ON u.id = t.user_id
     WHERE t.token = $1 AND t.expires_at > NOW()`,
    [token]
  );
  return result.rows[0] || null;
}

// Delete all reset tokens for a user (called after successful reset)
async function deleteResetTokensForUser(userId) {
  await db.query('DELETE FROM password_reset_tokens WHERE user_id = $1', [userId]);
}

module.exports = {
  createUser, findUserByEmail, findUserById, getAllUsers,
  updateUser, updatePassword, deleteUser,
  createResetToken, findResetToken, deleteResetTokensForUser,
};
