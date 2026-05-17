const express = require('express');
const { register, login } = require('../controllers/authController');
const { upload, uploadToCloudinary } = require('../middleware/upload');

const router = express.Router();

// POST /api/auth/register
// upload.single grabs the file, uploadToCloudinary sends it to Cloudinary, then register runs
router.post('/register', upload.single('profile_picture'), uploadToCloudinary, register);

// POST /api/auth/login
router.post('/login', login);

module.exports = router;
