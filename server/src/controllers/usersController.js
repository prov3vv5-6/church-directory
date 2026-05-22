const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { getAllUsers, findUserById, updateUser, updatePassword, deleteUser } = require('../models/userModel');

// GET /api/users — returns all members for the directory page
async function getUsers(req, res) {
  const users = await getAllUsers();
  res.json(users);
}

// GET /api/users/:id — returns a single member's profile
async function getUserById(req, res) {
  const user = await findUserById(req.params.id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(user);
}

// PUT /api/users/:id — update own profile (name, address, profile picture)
async function updateUserById(req, res) {
  const requestedId = parseInt(req.params.id);

  // Users can only edit their own profile
  if (requestedId !== req.user.id) {
    return res.status(403).json({ error: 'You can only edit your own profile' });
  }

  const { name, address } = req.body;
  // req.imageUrl is set by uploadToCloudinary if a file was uploaded, otherwise undefined
  const updated = await updateUser(requestedId, { name, address, profile_picture_url: req.imageUrl });

  if (!updated) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(updated);
}

// PUT /api/users/change-password — change the logged-in user's password
async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current and new password are required' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters' });
  }

  // Fetch full user row so we can verify password_hash (findUserById omits it)
  const result = await db.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
  const user = result.rows[0];

  if (!user) return res.status(404).json({ error: 'User not found' });

  const match = await bcrypt.compare(currentPassword, user.password_hash);
  if (!match) {
    return res.status(401).json({ error: 'Current password is incorrect' });
  }

  const newHash = await bcrypt.hash(newPassword, 10);
  await updatePassword(req.user.id, newHash);

  res.json({ message: 'Password updated successfully' });
}

// DELETE /api/users/:id — permanently delete own account
async function deleteUserById(req, res) {
  const requestedId = parseInt(req.params.id);

  if (requestedId !== req.user.id && !req.user.is_admin) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  await deleteUser(requestedId);
  res.json({ message: 'Account deleted' });
}

module.exports = { getUsers, getUserById, updateUserById, changePassword, deleteUserById };
