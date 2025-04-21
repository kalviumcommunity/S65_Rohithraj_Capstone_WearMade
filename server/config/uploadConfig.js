const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();


if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  throw new Error('Cloudinary configuration missing in environment variables');
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true // Enforce HTTPS
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'wearmade/profiles',
      allowed_formats: ['jpg', 'jpeg', 'png'],
      transformation: [
        { width: 500, height: 500, crop: 'limit' },
        { quality: 'auto:good', fetch_format: 'auto' }
      ],
      public_id: `${Date.now()}-${file.originalname.split('.')[0].replace(/[^a-zA-Z0-9]/g, '')}`
    };
  }
});

const upload = multer({
  storage: storage,
  limits: { 
    fileSize: 2 * 1024 * 1024 // 2MB limit
  },
  fileFilter: (req, file, cb) => {
    if (!file) {
      return cb(new Error('No file provided'), false); // Reject requests with no file
    }
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true); // Accept valid image files
    } else {
      cb(new Error('Only JPG, JPEG, and PNG images are allowed'), false); // Reject invalid file types
    }
  }
});

module.exports = {
  upload,
  cloudinary
};