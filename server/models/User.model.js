const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true, maxlength: 60 },
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, minlength: 6, select: false },
    googleId: { type: String, unique: true, sparse: true },
    avatar:   { type: String, default: '' },
    isEmailVerified: { type: Boolean, default: false },

    // ── Monthly usage counters ────────────────────────
    usage: {
      interviewsThisMonth: { type: Number, default: 0 },
      resumesThisMonth:    { type: Number, default: 0 },
      lastResetAt:         { type: Date,   default: Date.now },
    },

    // ── Stats ─────────────────────────────────────────
    stats: {
      totalInterviews: { type: Number, default: 0 },
      averageScore:    { type: Number, default: 0 },
      streak:          { type: Number, default: 0 },
      lastActive:      { type: Date,   default: Date.now },
      totalQuestions:  { type: Number, default: 0 },
    },

    // ── Topic scores (radar chart) ────────────────────
    topicScores: {
      dsa:          { type: Number, default: 0 },
      systemDesign: { type: Number, default: 0 },
      behavioral:   { type: Number, default: 0 },
      frontend:     { type: Number, default: 0 },
      backend:      { type: Number, default: 0 },
    },

    refreshToken: { type: String, select: false },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  return obj;
};

module.exports = mongoose.model('User', userSchema);