const rateLimit = require('express-rate-limit');

const isDev = process.env.NODE_ENV === 'development';

// General API limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      isDev ? 10000 : 200,
  standardHeaders: true,
  legacyHeaders:   false,
  message: { success: false, message: 'Too many requests — try again shortly.' },
});

// Auth limiter — login/register only
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      isDev ? 1000 : 20,
  standardHeaders: true,
  legacyHeaders:   false,
  message: { success: false, message: 'Too many attempts — wait 15 minutes.' },
});

// AI endpoints limiter
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max:      isDev ? 200 : 30,
  standardHeaders: true,
  legacyHeaders:   false,
  message: { success: false, message: 'AI rate limit reached — wait a moment.' },
});

module.exports = { apiLimiter, authLimiter, aiLimiter };