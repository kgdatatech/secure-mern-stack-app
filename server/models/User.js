const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true, // Index added to optimize email lookups
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId; // Password is required only if googleId is not present (i.e., traditional signup)
    },
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  name: {
    type: String,
    required: true,
  },
  googleId: {
    type: String,
    index: true, // Index added for Google ID, useful if you have a large number of Google-authenticated users
  },
  isVerified: {
    type: Boolean,
    default: false,
    index: true, // Index added to quickly filter verified/unverified users
  },
  verificationToken: {
    type: String,
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false,
  },
  twoFactorSecret: {
    type: String,
  },
  // Payment-related fields
  stripeCustomerId: {
    type: String,
    index: true, // Index added for Stripe customer lookups
  },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'inactive', 'canceled', 'past_due', 'completed'],
    default: 'inactive',
    index: true, // Index added to filter users by subscription status
  },
  subscriptionTier: {
    type: String,
    enum: ['one-off', 'monthly'],
    default: 'one-off',
  },
  oneOffPaymentStatus: { // New field for tracking one-off payments
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
    index: true, // Index added to filter users by one-off payment status
  },
  paymentMethodId: {
    type: String,
  },
  // New field for child information
  info: [
    {
      name: { type: String, required: true },
      age: { type: Number, required: true },
      gender: { type: String, required: true },
    },
  ],
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
});

// Compound index for frequent queries that involve both email and subscription status
userSchema.index({ email: 1, subscriptionStatus: 1 });

// Another useful compound index could be for isVerified and stripeCustomerId, to quickly find verified paying users
userSchema.index({ isVerified: 1, stripeCustomerId: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;
