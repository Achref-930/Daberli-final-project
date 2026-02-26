const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, generateToken } = require('../middleware/auth');
const { uploadAvatar } = require('../middleware/upload');
const { destroyByUrl } = require('../utils/cloudinaryHelper');

const ADMIN_EMAILS = ['admin@daberli.dz'];

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Generate default avatar
    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff&rounded=true&bold=true`;

    const user = await User.create({
      name,
      email,
      password,
      avatar,
      isAdmin: ADMIN_EMAILS.includes(email.toLowerCase()),
    });

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user & return token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user with password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', protect, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
      isAdmin: req.user.isAdmin,
    },
  });
});

// @route   PUT /api/auth/me
// @desc    Update current user profile
// @access  Private
router.put('/me', protect, async (req, res) => {
  try {
    const { name, email } = req.body;
    const updates = {};

    if (name) {
      updates.name = name;
      // Regenerate default avatar if user hasn't uploaded a custom one
      if (
        req.user.avatar &&
        req.user.avatar.includes('ui-avatars.com')
      ) {
        updates.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff&rounded=true&bold=true`;
      }
    }
    if (email) updates.email = email;

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// @route   POST /api/auth/avatar
// @desc    Upload user avatar to Cloudinary
// @access  Private
router.post('/avatar', protect, uploadAvatar.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Delete old avatar from Cloudinary (skip default ui-avatars URLs)
    if (req.user.avatar && req.user.avatar.includes('cloudinary')) {
      await destroyByUrl(req.user.avatar);
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: req.file.path },
      { new: true }
    );

    res.json({
      avatar: user.avatar,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

module.exports = router;
