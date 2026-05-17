const { getAllUsers, findUserById, updateUser } = require('../models/userModel');

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

module.exports = { getUsers, getUserById, updateUserById };
