const router = require('express').Router();
const {
  startInterview, getNextQuestion, submitAnswer,
  completeInterview, getHistory, getInterview,
} = require('../controllers/interview.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);
router.post('/start',            startInterview);
router.get('/history',           getHistory);
router.get('/:id',               getInterview);
router.get('/:id/next-question', getNextQuestion);
router.post('/:id/answer',       submitAnswer);
router.post('/:id/complete',     completeInterview);

module.exports = router;