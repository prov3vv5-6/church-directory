const multer = require('multer');
const cloudinary = require('../config/cloudinary');

// Store the file in memory (as a buffer) instead of saving it to disk
// We do this because we're passing it straight to Cloudinary, not keeping it locally
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Takes the file multer received and streams it up to Cloudinary
// Attaches the resulting image URL to req.imageUrl for the controller to use
function uploadToCloudinary(req, res, next) {
  if (!req.file) return next(); // no file uploaded — skip, it's optional

  cloudinary.uploader.upload_stream(
    { folder: 'church-directory' }, // images go into this folder in your Cloudinary account
    (error, result) => {
      if (error) return res.status(500).json({ error: 'Image upload failed' });
      req.imageUrl = result.secure_url; // attach the URL so the controller can save it
      next();
    }
  ).end(req.file.buffer); // send the in-memory file buffer to Cloudinary
}

module.exports = { upload, uploadToCloudinary };
