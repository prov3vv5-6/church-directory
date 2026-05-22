const express = require('express');
const { getUsers, getUserById, updateUserById, changePassword, deleteUserById } = require('../controllers/usersController');
const requireAuth = require('../middleware/authMiddleware');
const { upload, uploadToCloudinary } = require('../middleware/upload');

const router = express.Router();

// requireAuth runs first on every route in this file — no valid JWT = 401 response

// GET /api/users
router.get('/', requireAuth, getUsers);

// PUT /api/users/change-password — must be before /:id so Express doesn't treat it as an ID
router.put('/change-password', requireAuth, changePassword);

// GET /api/users/:id
router.get('/:id', requireAuth, getUserById);

// PUT /api/users/:id
router.put('/:id', requireAuth, upload.single('profile_picture'), uploadToCloudinary, updateUserById);

// DELETE /api/users/:id
router.delete('/:id', requireAuth, deleteUserById);

module.exports = router;
