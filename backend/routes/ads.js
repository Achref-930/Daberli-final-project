const express = require('express');
const router = express.Router();
const Ad = require('../models/Ad');
const { protect, admin } = require('../middleware/auth');
const { uploadAdImages } = require('../middleware/upload');
const { destroyManyByUrls } = require('../utils/cloudinaryHelper');
const { z } = require('zod');

const optionalProtect = (req, res, next) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
    return next();
  }

  return protect(req, res, next);
};

// @route   GET /api/ads
// @desc    Get all approved ads (+ user's own pending/rejected)
// @access  Public
router.get('/', optionalProtect, async (req, res) => {
  try {
    const { category, location, q } = req.query;
    const filter = {};

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (q) {
      filter.title = { $regex: q, $options: 'i' };
    }

    // By default, only show approved ads
    // If authenticated, also show the user's own non-approved ads
    if (req.user) {
      filter.$or = [
        { approvalStatus: 'approved' },
        { postedByUserId: req.user._id },
      ];
    } else {
      filter.approvalStatus = 'approved';
    }

    const ads = await Ad.find(filter)
      .sort({ createdAt: -1 })
      .populate('postedByUserId', 'name email avatar');

    res.json(ads);
  } catch (error) {
    console.error('Get ads error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// @route   GET /api/ads/:id
// @desc    Get a single ad by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id).populate(
      'postedByUserId',
      'name email avatar'
    );

    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    res.json(ad);
  } catch (error) {
    console.error('Get ad error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// @route   POST /api/ads
// @desc    Create a new ad
// @access  Private
router.post('/', protect, uploadAdImages.array('images', 10), async (req, res) => {
  try {
    const validation = adSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validation.error.flatten().fieldErrors,
      });
    }
    const { title, category, price, currency, location } = validation.data;
    const { details } = req.body;

    // Collect Cloudinary URLs from uploaded files
    const imageUrls = req.files ? req.files.map((f) => f.path) : [];

    const ad = await Ad.create({
      title,
      category,
      price: Number(price),
      currency: currency || 'DZD',
      location,
      image: imageUrls[0] || '',
      images: imageUrls,
      postedByUserId: req.user._id,
      details: details ? JSON.parse(details) : {},
      approvalStatus: 'approved', // auto-approve for now
    });

    const populated = await ad.populate('postedByUserId', 'name email avatar');

    res.status(201).json(populated);
  } catch (error) {
    console.error('Create ad error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// @route   PUT /api/ads/:id
// @desc    Update an ad
// @access  Private (owner only)
router.put('/:id', protect, uploadAdImages.array('images', 10), async (req, res) => {
  try {
    const validation = adSchema.partial().safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validation.error.flatten().fieldErrors,
      });
    }
    const validatedData = validation.data;
    const { details } = req.body;

    const ad = await Ad.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    // Check ownership
    if (ad.postedByUserId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to update this ad' });
    }

    Object.assign(ad, validatedData);
    if (details) ad.details = JSON.parse(details);

    // Handle new images — remove old ones from Cloudinary, then replace
    if (req.files && req.files.length > 0) {
      // Delete all previous images from Cloudinary
      if (ad.images && ad.images.length > 0) {
        await destroyManyByUrls(ad.images);
      }

      const newUrls = req.files.map((f) => f.path);
      ad.images = newUrls;
      ad.image = newUrls[0];
    }

    await ad.save();
    const populated = await ad.populate('postedByUserId', 'name email avatar');

    res.json(populated);
  } catch (error) {
    console.error('Update ad error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// @route   DELETE /api/ads/:id
// @desc    Delete an ad
// @access  Private (owner or admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    if (ad.postedByUserId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this ad' });
    }

    // Clean up all Cloudinary images
    if (ad.images && ad.images.length > 0) {
      await destroyManyByUrls(ad.images);
    }

    await Ad.findByIdAndDelete(req.params.id);

    res.json({ message: 'Ad deleted successfully' });
  } catch (error) {
    console.error('Delete ad error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// @route   PUT /api/ads/:id/approve
// @desc    Approve an ad
// @access  Private (admin only)
router.put('/:id/approve', protect, admin, async (req, res) => {
  try {
    const ad = await Ad.findByIdAndUpdate(
      req.params.id,
      { approvalStatus: 'approved' },
      { new: true }
    ).populate('postedByUserId', 'name email avatar');

    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    res.json(ad);
  } catch (error) {
    console.error('Approve ad error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// @route   PUT /api/ads/:id/reject
// @desc    Reject an ad
// @access  Private (admin only)
router.put('/:id/reject', protect, admin, async (req, res) => {
  try {
    const ad = await Ad.findByIdAndUpdate(
      req.params.id,
      { approvalStatus: 'rejected' },
      { new: true }
    ).populate('postedByUserId', 'name email avatar');

    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    res.json(ad);
  } catch (error) {
    console.error('Reject ad error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

module.exports = router;
