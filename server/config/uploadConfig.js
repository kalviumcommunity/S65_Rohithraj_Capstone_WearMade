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
  secure: true 
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
    fileSize: 2 * 1024 * 1024 
  },
  fileFilter: (req, file, cb) => {
    if (!file) {
      return cb(new Error('No file provided'), false); 
    }
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true); 
    } else {
      cb(new Error('Only JPG, JPEG, and PNG images are allowed'), false); 
    }
  }
});

const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({ message: 'File size exceeds the 2MB limit' });
      case 'LIMIT_FILE_TYPE':
        return res.status(400).json({ message: 'Only JPG, JPEG, and PNG images are allowed' });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({ message: 'No file provided or unexpected file field' });
      default:
        return res.status(400).json({ message: 'File upload error', details: err.message });
    }
  } else if (err) {
    // Handle other errors
    return res.status(500).json({ message: 'An unexpected error occurred', details: err.message });
  }
  next();
};

module.exports = {
  upload,
  cloudinary,
  handleMulterError
};