const User = require('../models/User.model');
const { ApiError } = require('../utils/apiError');
const { PLAN_LIMITS } = require('../services/Razorpay.service');

const resetIfNewMonth = async (user) => {
  const now = new Date();
  const last = user.usage?.lastResetAt ? new Date(user.usage.lastResetAt) : new Date(0);
  if (now.getMonth() !== last.getMonth() || now.getFullYear() !== last.getFullYear()) {
    await User.findByIdAndUpdate(user._id, {
      'usage.interviewsThisMonth': 0,
      'usage.resumesThisMonth':    0,
      'usage.lastResetAt':         now,
    });
    user.usage = { interviewsThisMonth: 0, resumesThisMonth: 0, lastResetAt: now };
  }
  return user;
};

const checkInterviewLimit = async (req, res, next) => {
  try {
    let user   = await User.findById(req.user._id);
    const limits = PLAN_LIMITS[user.plan] || PLAN_LIMITS.free;
    if (limits.interviewsPerMonth === Infinity) return next();

    user = await resetIfNewMonth(user);
    const used = user.usage?.interviewsThisMonth || 0;

    if (used >= limits.interviewsPerMonth) {
      return next(new ApiError(403,
        `Free plan: ${limits.interviewsPerMonth} interviews/month used. Upgrade to Pro for unlimited.`,
        [{ code: 'LIMIT_EXCEEDED', limit: limits.interviewsPerMonth, used, plan: user.plan }]
      ));
    }
    await User.findByIdAndUpdate(req.user._id, { $inc: { 'usage.interviewsThisMonth': 1 } });
    next();
  } catch (err) { next(err); }
};

const checkResumeLimit = async (req, res, next) => {
  try {
    let user   = await User.findById(req.user._id);
    const limits = PLAN_LIMITS[user.plan] || PLAN_LIMITS.free;
    if (limits.resumeAnalysis === Infinity) return next();

    user = await resetIfNewMonth(user);
    const used = user.usage?.resumesThisMonth || 0;
    if (used >= limits.resumeAnalysis) {
      return next(new ApiError(403,
        `Free plan: ${limits.resumeAnalysis} resume analysis/month used. Upgrade to Pro.`,
        [{ code: 'LIMIT_EXCEEDED', feature: 'resume' }]
      ));
    }
    await User.findByIdAndUpdate(req.user._id, { $inc: { 'usage.resumesThisMonth': 1 } });
    next();
  } catch (err) { next(err); }
};

const requireFeature = (feature) => async (req, res, next) => {
  try {
    const user   = await User.findById(req.user._id);
    const limits = PLAN_LIMITS[user.plan] || PLAN_LIMITS.free;
    if (!limits[feature]) {
      return next(new ApiError(403,
        `"${feature}" requires Pro or Enterprise plan. Upgrade to unlock.`,
        [{ code: 'FEATURE_LOCKED', feature, currentPlan: user.plan }]
      ));
    }
    next();
  } catch (err) { next(err); }
};

module.exports = { checkInterviewLimit, checkResumeLimit, requireFeature };