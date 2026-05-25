const router   = require('express').Router();
const { body } = require('express-validator');
const passport = require('passport');
const { register, login, googleAuth, googleCallback, refreshToken, logout, getMe } = require('../controllers/auth.controller');
const { protect }    = require('../middleware/auth.middleware');
const validate       = require('../middleware/validate.middleware');
const { authLimiter} = require('../middleware/rateLimit.middleware');

router.post('/register',
  authLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password min 6 characters'),
  ],
  validate,
  register
);

router.post('/login',
  authLimiter,
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
);

router.get('/google', googleAuth);
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth` }),
  googleCallback
);

router.post('/refresh', refreshToken);
router.post('/logout',  protect, logout);
router.get('/me',       protect, getMe);

module.exports = router;