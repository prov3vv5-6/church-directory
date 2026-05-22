const express = require('express');
const { register, login, getMe, forgotPassword, resetPassword } = require('../controllers/authController');
const { upload, uploadToCloudinary } = require('../middleware/upload');
const requireAuth = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', upload.single('profile_picture'), uploadToCloudinary, register);
router.post('/login', login);
router.get('/me', requireAuth, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
