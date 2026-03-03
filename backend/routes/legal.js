const express = require('express');

const router = express.Router();

// @route   GET /api/legal/terms
// @desc    Get Terms of Service metadata/content
// @access  Public
router.get('/terms', (req, res) => {
  res.json({
    title: 'Terms of Service',
    version: '1.0',
    lastUpdated: '2026-03-03',
    sections: [
      {
        heading: 'Acceptance of Terms',
        body: 'By accessing and using Daberli, you agree to comply with these Terms of Service and all applicable laws and regulations.',
      },
      {
        heading: 'User Responsibilities',
        body: 'You are responsible for the accuracy of your listings, account information, and communications. Fraudulent, misleading, or illegal content is prohibited.',
      },
      {
        heading: 'Listings and Transactions',
        body: 'Daberli provides a platform to publish and discover listings. Daberli is not a party to transactions between users and does not guarantee transaction outcomes.',
      },
      {
        heading: 'Content Moderation',
        body: 'We may review, reject, or remove listings that violate platform rules, legal obligations, or community standards.',
      },
      {
        heading: 'Account Suspension or Termination',
        body: 'Accounts that violate these terms may be suspended, limited, or terminated at our discretion.',
      },
      {
        heading: 'Limitation of Liability',
        body: 'Daberli is provided on an as-is basis. We are not liable for indirect, incidental, or consequential damages arising from platform use.',
      },
      {
        heading: 'Changes to These Terms',
        body: 'We may update these terms periodically. Continued use of the platform after updates means you accept the revised terms.',
      },
    ],
  });
});

// @route   GET /api/legal/about
// @desc    Get About Us metadata/content
// @access  Public
router.get('/about', (req, res) => {
  res.json({
    title: 'About Us',
    subtitle: 'Connecting people across Algeria to trusted listings and services.',
    stats: [
      { label: 'Cities Covered', value: '58+' },
      { label: 'Active Categories', value: '4' },
      { label: 'Local Focus', value: '100%' },
    ],
    sections: [
      {
        heading: 'Who We Are',
        body: 'Daberli is a local marketplace built to help people in Algeria discover verified opportunities in services, vehicles, homes, and jobs.',
      },
      {
        heading: 'Our Mission',
        body: 'We make local buying, selling, and hiring simpler through a fast, clear, and mobile-friendly experience designed for everyday users.',
      },
      {
        heading: 'What We Value',
        body: 'We prioritize trust, transparency, and usefulness. Every feature is built to reduce friction and improve the quality of interactions on the platform.',
      },
    ],
  });
});

module.exports = router;