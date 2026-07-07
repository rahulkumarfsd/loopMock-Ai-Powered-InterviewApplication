const Question = require('../models/Question.model');
const { asyncHandler, ApiError, sendSuccess } = require('../utils/apiError');
const { getCache, setCache } = require('../config/redis');

const getQuestions = asyncHandler(async (req, res) => {
  const { type, difficulty, topic, company, page = 1, limit = 20 } = req.query;
  const query = { isActive: true };
  if (type) query.type = type;
  if (difficulty) query.difficulty = difficulty;
  if (topic) query.topic = { $regex: topic, $options: 'i' };
  if (company) query.company = { $in: [company.toLowerCase()] };

  const [questions, total] = await Promise.all([
    Question.find(query).skip((page - 1) * limit).limit(Number(limit)).select('-sampleAnswer -coding.testCases'),
    Question.countDocuments(query),
  ]);

  sendSuccess(res, 200, 'Questions fetched', { questions, total });
});

const getQuestion = asyncHandler(async (req, res, next) => {
  const question = await Question.findById(req.params.id).select('-sampleAnswer');
  if (!question) return next(new ApiError(404, 'Question not found'));
  sendSuccess(res, 200, 'Question fetched', { question });
});

const createQuestion = asyncHandler(async (req, res) => {
  const question = await Question.create(req.body);
  sendSuccess(res, 201, 'Question created', { question });
});

module.exports = { getQuestions, getQuestion, createQuestion };