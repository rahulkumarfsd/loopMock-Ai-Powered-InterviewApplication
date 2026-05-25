// question.routes.js
// const qRouter = require('express').Router();
// const { getQuestions, getQuestion, createQuestion } = require('../controllers/question.controller');
// const { protect } = require('../middleware/auth.middleware');
// qRouter.get('/', getQuestions);
// qRouter.get('/:id', getQuestion);
// qRouter.post('/', protect, createQuestion);
// module.exports = qRouter;
// //////////////
const router = require('express').Router();
const {
  startInterview, getNextQuestion, submitAnswer,
  completeInterview, getHistory, getInterview,
} = require('../controllers/interview.controller');
const { protect }             = require('../middleware/auth.middleware');
const { checkInterviewLimit } = require('../middleware/plan.middleware');

router.use(protect);
router.post('/start',            checkInterviewLimit, startInterview);
router.get('/history',           getHistory);
router.get('/:id',               getInterview);
router.get('/:id/next-question', getNextQuestion);
router.post('/:id/answer',       submitAnswer);
router.post('/:id/complete',     completeInterview);

module.exports = router;