const router = require('express').Router();
const { analyzeSingle, getAnswerFeedback } = require('../controllers/feedback.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);
router.post('/analyze', analyzeSingle);
router.get('/:interviewId/:answerIndex', getAnswerFeedback);

module.exports = router;