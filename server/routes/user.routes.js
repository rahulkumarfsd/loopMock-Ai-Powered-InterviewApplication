const router = require('express').Router();
const { getProfile, updateProfile, changePassword, getLeaderboard } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);
router.get('/leaderboard', getLeaderboard);

module.exports = router;