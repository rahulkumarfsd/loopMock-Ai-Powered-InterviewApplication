const User = require('../models/User.model');
const { asyncHandler, ApiError, sendSuccess } = require('../utils/apiError');

// @route  GET /api/users/profile
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  sendSuccess(res, 200, 'Profile fetched', { user });
});

// @route  PUT /api/users/profile
const updateProfile = asyncHandler(async (req, res, next) => {
  const { name, avatar } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  );
  sendSuccess(res, 200, 'Profile updated', { user });
});

// @route  PUT /api/users/change-password
const changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');
  if (!user.password) return next(new ApiError(400, 'Use Google login'));
  if (!(await user.comparePassword(currentPassword))) {
    return next(new ApiError(400, 'Current password is incorrect'));
  }
  user.password = newPassword;
  await user.save();
  sendSuccess(res, 200, 'Password changed');
});

// @route  GET /api/users/leaderboard
const getLeaderboard = asyncHandler(async (req, res) => {
  const users = await User.find({ 'stats.totalInterviews': { $gt: 0 } })
    .select('name avatar stats.averageScore stats.totalInterviews stats.streak')
    .sort({ 'stats.averageScore': -1 })
    .limit(20);
  sendSuccess(res, 200, 'Leaderboard fetched', { users });
});

module.exports = { getProfile, updateProfile, changePassword, getLeaderboard };