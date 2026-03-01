const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, // don't return password by default
    },
    avatar: {
      type: String,
      default: '',
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    isDeactivated: {
      type: Boolean,
      default: false,
    },
    settings: {
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: false },
        adStatusAlerts: { type: Boolean, default: true },
        messageAlerts: { type: Boolean, default: true },
        marketingEmails: { type: Boolean, default: false },
      },
      privacy: {
        publicProfile: { type: Boolean, default: true },
        showPhone: { type: Boolean, default: false },
        appOnlyContact: { type: Boolean, default: true },
      },
      language: { type: String, default: 'en', enum: ['en', 'fr', 'ar'] },
      defaultWilaya: { type: String, default: '' },
      theme: { type: String, default: 'light', enum: ['light', 'dark', 'system'] },
      defaultCategory: { type: String, default: '', enum: ['', 'auto', 'real-estate', 'jobs', 'services'] },
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hash
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
