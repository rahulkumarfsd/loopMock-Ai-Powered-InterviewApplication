const passport = require('passport');
const User     = require('../models/User.model');
const { generateTokens, verifyRefreshToken } = require('../utils/generateToken');
const { ApiError, asyncHandler, sendSuccess }  = require('../utils/apiError');
const { sendWelcome } = require('../services/email.service');

const COOKIE_OPTS = {
  httpOnly: true,
  secure:   process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge:   30 * 24 * 60 * 60 * 1000,
};

// POST /api/auth/register
const register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return next(new ApiError(400, 'Email already registered'));

  const user = await User.create({ name, email, password });
  const { accessToken, refreshToken } = generateTokens(user._id);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  res.cookie('refreshToken', refreshToken, COOKIE_OPTS);

  // Send welcome email (non-blocking)
  sendWelcome(user).catch(() => {});

  sendSuccess(res, 201, 'Account created successfully', { token: accessToken, user });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !user.password) return next(new ApiError(401, 'Invalid email or password'));
  if (!(await user.comparePassword(password))) return next(new ApiError(401, 'Invalid email or password'));

  const { accessToken, refreshToken } = generateTokens(user._id);
  user.refreshToken     = refreshToken;
  user.stats.lastActive = new Date();
  await user.save({ validateBeforeSave: false });

  res.cookie('refreshToken', refreshToken, COOKIE_OPTS);
  sendSuccess(res, 200, 'Login successful', { token: accessToken, user: user.toJSON() });
});

// GET /api/auth/google
const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'], session: false });

// GET /api/auth/google/callback
const googleCallback = asyncHandler(async (req, res) => {
  const { accessToken, refreshToken } = generateTokens(req.user._id);
  req.user.refreshToken = refreshToken;
  await req.user.save({ validateBeforeSave: false });

  res.cookie('refreshToken', refreshToken, COOKIE_OPTS);
  res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${accessToken}`);
});

// POST /api/auth/refresh
const refreshToken = asyncHandler(async (req, res, next) => {
  const token = req.cookies.refreshToken;
  if (!token) return next(new ApiError(401, 'No refresh token'));

  let decoded;
  try { decoded = verifyRefreshToken(token); }
  catch { return next(new ApiError(401, 'Invalid refresh token')); }

  const user = await User.findById(decoded.id).select('+refreshToken');
  if (!user || user.refreshToken !== token) return next(new ApiError(401, 'Refresh token mismatch'));

  const tokens = generateTokens(user._id);
  user.refreshToken = tokens.refreshToken;
  await user.save({ validateBeforeSave: false });

  res.cookie('refreshToken', tokens.refreshToken, COOKIE_OPTS);
  sendSuccess(res, 200, 'Token refreshed', { token: tokens.accessToken });
});

// POST /api/auth/logout
const logout = asyncHandler(async (req, res) => {
  if (req.user) await User.findByIdAndUpdate(req.user._id, { refreshToken: '' });
  res.clearCookie('refreshToken');
  sendSuccess(res, 200, 'Logged out');
});

// GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, 'User not found');
  sendSuccess(res, 200, 'User fetched', { user });
});

module.exports = { register, login, googleAuth, googleCallback, refreshToken, logout, getMe };