const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Avatar uploads
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'daberli/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 300, height: 300, crop: 'fill', gravity: 'face' }],
  },
});

// Ad image uploads
const adImageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'daberli/ads',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 600, crop: 'limit' }],
  },
});

const uploadAvatar = multer({ storage: avatarStorage, limits: { fileSize: 5 * 1024 * 1024 } });
const uploadAdImages = multer({ storage: adImageStorage, limits: { fileSize: 10 * 1024 * 1024 } });

module.exports = { uploadAvatar, uploadAdImages, cloudinary };
