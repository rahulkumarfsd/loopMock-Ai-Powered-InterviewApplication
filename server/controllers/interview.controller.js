const Interview = require('../models/Interview.model');
const Question  = require('../models/Question.model');
const User      = require('../models/User.model');
const { asyncHandler, ApiError, sendSuccess } = require('../utils/apiError');
const { analyzeAnswer, generateInterviewSummary } = require('../services/feedback.service');
const { generateQuestion } = require('../services/openai.service');
const { updateUserStats, updateTopicScores } = require('../utils/scoreCalculator');
const { getCache, setCache } = require('../config/redis');

// @route  POST /api/interviews/start
const startInterview = asyncHandler(async (req, res, next) => {
  const { type, mode = 'text', company = '', totalQuestions = 5 } = req.body;
  if (!type) return next(new ApiError(400, 'Interview type is required'));

  const interview = await Interview.create({
    user: req.user._id,
    type,
    mode,
    company: company.toLowerCase(),
    totalQuestions: Math.min(Math.max(Number(totalQuestions), 1), 20), // clamp 1-20
    status: 'in-progress',
  });

  sendSuccess(res, 201, 'Interview started', { interview });
});

// @route  GET /api/interviews/:id/next-question
const getNextQuestion = asyncHandler(async (req, res, next) => {
  const interview = await Interview.findById(req.params.id);
  if (!interview)                       return next(new ApiError(404, 'Interview not found'));
  if (interview.user.toString() !== req.user._id.toString()) return next(new ApiError(403, 'Not your interview'));
  if (interview.status !== 'in-progress') return next(new ApiError(400, 'Interview is not active'));

  const answered = interview.answers.length;
  if (answered >= interview.totalQuestions) {
    return next(new ApiError(400, 'All questions have been answered'));
  }

  // IDs already answered (to avoid repeating DB questions)
  const usedIds = interview.answers.map((a) => a.question).filter(Boolean);

  // Try cache
  const cacheKey = `question:${interview.type}:${interview.company}:${answered}`;
  const cached = await getCache(cacheKey);
  if (cached) {
    return sendSuccess(res, 200, 'Question fetched', { question: cached, questionNumber: answered + 1 });
  }

  // Try DB question first
  const dbQuery = {
    type: interview.type,
    isActive: true,
    ...(usedIds.length && { _id: { $nin: usedIds } }),
    ...(interview.company && { company: { $in: [interview.company] } }),
  };

  let dbQuestion = await Question.findOne(dbQuery).sort({ usageCount: 1 });

  // Fallback: ignore company filter
  if (!dbQuestion && interview.company) {
    dbQuestion = await Question.findOne({ type: interview.type, isActive: true, ...(usedIds.length && { _id: { $nin: usedIds } }) }).sort({ usageCount: 1 });
  }

  let question;
  if (dbQuestion) {
    await Question.findByIdAndUpdate(dbQuestion._id, { $inc: { usageCount: 1 } });
    question = {
      _id:        dbQuestion._id,
      title:      dbQuestion.title,
      body:       dbQuestion.body,
      type:       dbQuestion.type,
      difficulty: dbQuestion.difficulty,
      hints:      dbQuestion.hints || [],
      topic:      dbQuestion.topic,
    };
  } else {
    // AI-generate fallback
    question = await generateQuestion({
      type:       interview.type,
      company:    interview.company,
      difficulty: 'medium',
    });
  }

  await setCache(cacheKey, question, 1800);
  sendSuccess(res, 200, 'Question fetched', { question, questionNumber: answered + 1 });
});

// @route  POST /api/interviews/:id/answer
const submitAnswer = asyncHandler(async (req, res, next) => {
  const { questionId, questionText, answerText, answerType = 'text', code, language, timeTaken } = req.body;

  if (!questionText) return next(new ApiError(400, 'questionText is required'));

  const interview = await Interview.findById(req.params.id);
  if (!interview)                         return next(new ApiError(404, 'Interview not found'));
  if (interview.user.toString() !== req.user._id.toString()) return next(new ApiError(403, 'Not your interview'));
  if (interview.status !== 'in-progress') return next(new ApiError(400, 'Interview is not active'));

  const effectiveAnswer = answerText || code || '';

  // Get AI feedback
  const feedback = await analyzeAnswer({
    questionText,
    answerText: effectiveAnswer,
    type:       interview.type,
    difficulty: 'medium',
  });

  interview.answers.push({
    question:   questionId || null,
    questionText,
    answerText,
    answerType,
    code,
    language,
    timeTaken:  timeTaken || 0,
    feedback,
  });
  interview.questionsAnswered = interview.answers.length;
  await interview.save();

  sendSuccess(res, 200, 'Answer submitted', {
    feedback,
    questionsAnswered: interview.questionsAnswered,
    totalQuestions:    interview.totalQuestions,
  });
});

// @route  POST /api/interviews/:id/complete
const completeInterview = asyncHandler(async (req, res, next) => {
  const interview = await Interview.findById(req.params.id);
  if (!interview)                         return next(new ApiError(404, 'Interview not found'));
  if (interview.user.toString() !== req.user._id.toString()) return next(new ApiError(403, 'Not your interview'));

  if (interview.status === 'completed') {
    return sendSuccess(res, 200, 'Interview already completed', { interview });
  }
  if (interview.answers.length === 0) {
    return next(new ApiError(400, 'No answers to evaluate'));
  }

  // Average score
  const scores = interview.answers
    .map((a) => a.feedback?.overallScore)
    .filter((s) => typeof s === 'number' && s > 0);

  interview.averageScore = scores.length
    ? parseFloat((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2))
    : 0;

  interview.totalTimeTaken = interview.answers.reduce((sum, a) => sum + (a.timeTaken || 0), 0);
  interview.status         = 'completed';
  interview.questionsAnswered = interview.answers.length;

  // AI summary
  const summary = await generateInterviewSummary(interview.answers);
  interview.summary      = summary.summary;
  interview.strongTopics = summary.strongTopics || [];
  interview.weakTopics   = summary.weakTopics   || [];

  await interview.save();

  // Update user stats
  const user = await User.findById(req.user._id);
  if (user) {
    updateUserStats(user, interview);
    updateTopicScores(user, interview);
    user.markModified('stats');
    user.markModified('topicScores');
    await user.save({ validateBeforeSave: false });
  }

  sendSuccess(res, 200, 'Interview completed', { interview });
});

// @route  GET /api/interviews/history
const getHistory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, type } = req.query;
  const query = { user: req.user._id, status: 'completed' };
  if (type) query.type = type;

  const [interviews, total] = await Promise.all([
    Interview.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * Number(limit))
      .limit(Number(limit))
      .select('-answers'),
    Interview.countDocuments(query),
  ]);

  sendSuccess(res, 200, 'History fetched', {
    interviews,
    total,
    page:  Number(page),
    pages: Math.ceil(total / Number(limit)),
  });
});

// @route  GET /api/interviews/:id
const getInterview = asyncHandler(async (req, res, next) => {
  const interview = await Interview.findById(req.params.id);
  if (!interview) return next(new ApiError(404, 'Interview not found'));
  if (interview.user.toString() !== req.user._id.toString()) return next(new ApiError(403, 'Not your interview'));
  sendSuccess(res, 200, 'Interview fetched', { interview });
});

module.exports = { startInterview, getNextQuestion, submitAnswer, completeInterview, getHistory, getInterview };