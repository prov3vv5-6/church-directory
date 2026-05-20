const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { upload, uploadToCloudinary } = require('../middleware/upload');
const requireAuth = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/auth/register
// upload.single grabs the file, uploadToCloudinary sends it to Cloudinary, then register runs
router.post('/register', upload.single('profile_picture'), uploadToCloudinary, register);

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/me — returns the logged-in user's profile (requires valid JWT)
router.get('/me', requireAuth, getMe);

module.exports = router;
