const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Ad = require('../models/Ad');
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');
const { destroyByUrl } = require('../utils/cloudinaryHelper');

// All settings routes require authentication
router.use(protect);

// @route   GET /api/settings
// @desc    Get current user settings
// @access  Private
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      phone: user.phone || '',
      isDeactivated: user.isDeactivated || false,
      settings: {
        notifications: {
          email: user.settings?.notifications?.email ?? true,
          push: user.settings?.notifications?.push ?? false,
          adStatusAlerts: user.settings?.notifications?.adStatusAlerts ?? true,
          messageAlerts: user.settings?.notifications?.messageAlerts ?? true,
          marketingEmails: user.settings?.notifications?.marketingEmails ?? false,
        },
        privacy: {
          publicProfile: user.settings?.privacy?.publicProfile ?? true,
          showPhone: user.settings?.privacy?.showPhone ?? false,
          appOnlyContact: user.settings?.privacy?.appOnlyContact ?? true,
        },
        language: user.settings?.language || 'en',
        defaultWilaya: user.settings?.defaultWilaya || '',
        theme: user.settings?.theme || 'light',
        defaultCategory: user.settings?.defaultCategory || '',
      },
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// @route   PUT /api/settings
// @desc    Update user settings (partial update)
// @access  Private
router.put('/', async (req, res) => {
  try {
    const { phone, settings } = req.body;
    const updates = {};

    // Phone number
    if (phone !== undefined) {
      updates.phone = phone;
    }

    // Notification settings
    if (settings?.notifications) {
      const n = settings.notifications;
      if (n.email !== undefined) updates['settings.notifications.email'] = n.email;
      if (n.push !== undefined) updates['settings.notifications.push'] = n.push;
      if (n.adStatusAlerts !== undefined) updates['settings.notifications.adStatusAlerts'] = n.adStatusAlerts;
      if (n.messageAlerts !== undefined) updates['settings.notifications.messageAlerts'] = n.messageAlerts;
      if (n.marketingEmails !== undefined) updates['settings.notifications.marketingEmails'] = n.marketingEmails;
    }

    // Privacy settings
    if (settings?.privacy) {
      const p = settings.privacy;
      if (p.publicProfile !== undefined) updates['settings.privacy.publicProfile'] = p.publicProfile;
      if (p.showPhone !== undefined) updates['settings.privacy.showPhone'] = p.showPhone;
      if (p.appOnlyContact !== undefined) updates['settings.privacy.appOnlyContact'] = p.appOnlyContact;
    }

    // Language
    if (settings?.language !== undefined) {
      const validLanguages = ['en', 'fr', 'ar'];
      if (!validLanguages.includes(settings.language)) {
        return res.status(400).json({ message: 'Invalid language. Accepted: en, fr, ar' });
      }
      updates['settings.language'] = settings.language;
    }

    // Default Wilaya
    if (settings?.defaultWilaya !== undefined) {
      updates['settings.defaultWilaya'] = settings.defaultWilaya;
    }

    // Theme
    if (settings?.theme !== undefined) {
      const validThemes = ['light', 'dark', 'system'];
      if (!validThemes.includes(settings.theme)) {
        return res.status(400).json({ message: 'Invalid theme. Accepted: light, dark, system' });
      }
      updates['settings.theme'] = settings.theme;
    }

    // Default Category
    if (settings?.defaultCategory !== undefined) {
      const validCategories = ['', 'auto', 'real-estate', 'jobs', 'services'];
      if (!validCategories.includes(settings.defaultCategory)) {
        return res.status(400).json({ message: 'Invalid category' });
      }
      updates['settings.defaultCategory'] = settings.defaultCategory;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    const user = await User.findByIdAndUpdate(req.user._id, { $set: updates }, { new: true });

    res.json({
      phone: user.phone || '',
      settings: {
        notifications: {
          email: user.settings?.notifications?.email ?? true,
          push: user.settings?.notifications?.push ?? false,
          adStatusAlerts: user.settings?.notifications?.adStatusAlerts ?? true,
          messageAlerts: user.settings?.notifications?.messageAlerts ?? true,
          marketingEmails: user.settings?.notifications?.marketingEmails ?? false,
        },
        privacy: {
          publicProfile: user.settings?.privacy?.publicProfile ?? true,
          showPhone: user.settings?.privacy?.showPhone ?? false,
          appOnlyContact: user.settings?.privacy?.appOnlyContact ?? true,
        },
        language: user.settings?.language || 'en',
        defaultWilaya: user.settings?.defaultWilaya || '',
        theme: user.settings?.theme || 'light',
        defaultCategory: user.settings?.defaultCategory || '',
      },
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// @route   PUT /api/settings/password
// @desc    Change user password
// @access  Private
router.put('/password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters' });
    }

    // Get user with password field
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password (will be hashed by pre-save hook)
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// @route   PUT /api/settings/phone
// @desc    Update phone number
// @access  Private
router.put('/phone', async (req, res) => {
  try {
    const { phone } = req.body;

    if (phone === undefined) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { phone: phone.trim() },
      { new: true }
    );

    res.json({ phone: user.phone });
  } catch (error) {
    console.error('Update phone error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// @route   POST /api/settings/deactivate
// @desc    Deactivate user account (hide profile and listings)
// @access  Private
router.post('/deactivate', async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { isDeactivated: true });

    // Hide all user's ads
    await Ad.updateMany(
      { postedByUserId: req.user._id },
      { approvalStatus: 'rejected' }
    );

    res.json({ message: 'Account deactivated successfully' });
  } catch (error) {
    console.error('Deactivate account error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// @route   POST /api/settings/reactivate
// @desc    Reactivate a deactivated account
// @access  Private
router.post('/reactivate', async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { isDeactivated: false });

    // Restore ads to pending for re-approval
    await Ad.updateMany(
      { postedByUserId: req.user._id },
      { approvalStatus: 'pending' }
    );

    res.json({ message: 'Account reactivated successfully' });
  } catch (error) {
    console.error('Reactivate account error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// @route   DELETE /api/settings/account
// @desc    Permanently delete user account and all associated data
// @access  Private
router.delete('/account', async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Delete all user's ad images from Cloudinary
    const userAds = await Ad.find({ postedByUserId: userId });
    for (const ad of userAds) {
      // Delete cover image
      if (ad.image && ad.image.includes('cloudinary')) {
        await destroyByUrl(ad.image).catch(() => {});
      }
      // Delete all images
      if (ad.images && ad.images.length > 0) {
        for (const imgUrl of ad.images) {
          if (imgUrl.includes('cloudinary')) {
            await destroyByUrl(imgUrl).catch(() => {});
          }
        }
      }
    }

    // 2. Delete user avatar from Cloudinary
    if (req.user.avatar && req.user.avatar.includes('cloudinary')) {
      await destroyByUrl(req.user.avatar).catch(() => {});
    }

    // 3. Delete all user's ads
    await Ad.deleteMany({ postedByUserId: userId });

    // 4. Delete all messages sent by the user
    await Message.deleteMany({ senderId: userId });

    // 5. Delete the user account
    await User.findByIdAndDelete(userId);

    res.json({ message: 'Account and all associated data deleted permanently' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

module.exports = router;
