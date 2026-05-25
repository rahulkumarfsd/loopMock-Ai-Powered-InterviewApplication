const router = require('express').Router();
const { getOverview, getScoreTrend, getTopicBreakdown, getActivityHeatmap } = require('../controllers/analytics.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);
router.get('/overview', getOverview);
router.get('/trend', getScoreTrend);
router.get('/topics', getTopicBreakdown);
router.get('/heatmap', getActivityHeatmap);

module.exports = router;