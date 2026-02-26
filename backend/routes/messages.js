const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');

// @route   GET /api/messages/:adId
// @desc    Get all messages for an ad
// @access  Private
router.get('/:adId', protect, async (req, res) => {
  try {
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
    const { adId, text, senderRole } = req.body;

    const message = await Message.create({
      adId,
      senderId: req.user._id,
      senderName: req.user.name,
      senderRole: senderRole || 'buyer',
      text,
    });

    const populated = await message.populate('senderId', 'name avatar');

    res.status(201).json(populated);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

module.exports = router;
