const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Message = require('../models/Message');
const Ad = require('../models/Ad');
const { protect } = require('../middleware/auth');

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

// @route   GET /api/messages/:adId
// @desc    Get all messages for an ad
// @access  Private
router.get('/:adId', protect, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.adId)) {
      return res.status(400).json({ message: 'Invalid adId' });
    }

    const messages = await Message.find({ adId: req.params.adId })
      .sort({ createdAt: 1 })
      .populate('senderId', 'name avatar');

    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// @route   GET /api/messages
// @desc    Get all messages grouped by ad for the current user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const messages = await Message.find({ senderId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('senderId', 'name avatar')
      .populate('adId', 'title image');

    // Group by adId
    const grouped = {};
    messages.forEach((msg) => {
      const key = msg.adId?._id?.toString() || msg.adId?.toString();
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(msg);
    });

    res.json(grouped);
  } catch (error) {
    console.error('Get all messages error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// @route   POST /api/messages
// @desc    Send a message on an ad
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { adId, text } = req.body;

    if (!adId || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ message: 'adId and text are required' });
    }

    if (!isValidObjectId(adId)) {
      return res.status(400).json({ message: 'Invalid adId' });
    }

    const ad = await Ad.findById(adId);
    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    const senderRole = ad.postedByUserId.toString() === req.user._id.toString() ? 'owner' : 'buyer';

    const message = await Message.create({
      adId,
      senderId: req.user._id,
      senderName: req.user.name,
      senderRole,
      text: text.trim(),
    });

    const populated = await message.populate('senderId', 'name avatar');

    res.status(201).json(populated);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

module.exports = router;
