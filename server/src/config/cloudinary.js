const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Your Cloud Name from the Cloudinary dashboard
  api_key: process.env.CLOUDINARY_API_KEY, // Your API Key from the Cloudinary dashboard
  api_secret: process.env.CLOUDINARY_API_SECRET, // Your API Secret from the Cloudinary dashboard
});

module.exports = cloudinary;
