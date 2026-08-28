// Cloudinary Configuration
// This file sets up Cloudinary for image upload and storage
// Cloudinary is a cloud-based image management service

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Configure Cloudinary with API credentials from environment variables
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,      // Cloudinary account name
    api_key: process.env.CLOUD_API_KEY,      // API key for authentication
    api_secret: process.env.CLOUD_API_SECRET // API secret for secure requests
});

// Set up CloudinaryStorage for multer (file upload middleware)
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "wanderlust_DEV",                            // Folder in Cloudinary to store images
        allowedFormats: ["png", "jpg", "jpeg"]             // Only allow these image formats
    }
});

// Export cloudinary instance and storage configuration for use in routes
module.exports = {
    cloudinary,
    storage
};