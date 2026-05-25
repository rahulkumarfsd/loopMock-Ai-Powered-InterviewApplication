const Interview = require('../models/Interview.model');
const { asyncHandler, ApiError, sendSuccess } = require('../utils/apiError');
const { analyzeAnswer } = require('../services/feedback.service');

// @route  POST /api/feedback/analyze
const analyzeSingle = asyncHandler(async (req, res, next) => {
  const { questionText, answerText, type = 'dsa', difficulty = 'medium' } = req.body;
  if (!questionText) return next(new ApiError(400, 'questionText is required'));
  const feedback = await analyzeAnswer({ questionText, answerText: answerText || '', type, difficulty });
  sendSuccess(res, 200, 'Feedback generated', { feedback });
});

// @route  GET /api/feedback/:interviewId/:answerIndex
const getAnswerFeedback = asyncHandler(async (req, res, next) => {
  const interview = await Interview.findById(req.params.interviewId);
  if (!interview) return next(new ApiError(404, 'Interview not found'));
  if (interview.user.toString() !== req.user._id.toString()) {
    return next(new ApiError(403, 'Access denied'));
  }
  const idx = Number(req.params.answerIndex);
  if (isNaN(idx) || idx < 0 || idx >= interview.answers.length) {
    return next(new ApiError(404, 'Answer not found'));
  }
  const answer = interview.answers[idx];
  sendSuccess(res, 200, 'Feedback fetched', {
    feedback: answer.feedback,
    questionText: answer.questionText,
    answerText: answer.answerText,
  });
});

module.exports = { analyzeSingle, getAnswerFeedback };