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

  try {
    cloudinary.uploader.upload_stream(
      { folder: 'church-directory' },
      (error, result) => {
        if (error) return next(error); // pass to global error handler
        req.imageUrl = result.secure_url;
        next();
      }
    ).end(req.file.buffer);
  } catch (err) {
    next(err); // catch any synchronous throw from upload_stream
  }
}

module.exports = { upload, uploadToCloudinary };
