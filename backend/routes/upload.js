const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { uploadAdImages } = require('../middleware/upload');

// @route   POST /api/upload
// @desc    Upload images to Cloudinary (generic endpoint)
// @access  Private
router.post('/', protect, uploadAdImages.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const urls = req.files.map((file) => file.path);

    res.json({ urls });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

module.exports = router;
