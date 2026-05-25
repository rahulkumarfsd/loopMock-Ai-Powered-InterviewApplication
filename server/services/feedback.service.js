const { callGPT } = require('./openai.service');
const { buildFeedbackPrompt, buildInterviewSummaryPrompt } = require('../utils/promptBuilder');

const analyzeAnswer = async ({ questionText, answerText, type, difficulty }) => {
  try {
    const prompt = buildFeedbackPrompt({ questionText, answerText, type, difficulty });
    const result = await callGPT(
      'You are an expert technical interviewer. Evaluate answers honestly and return only valid JSON.',
      prompt,
      700
    );
    return {
      overallScore: clamp(result.overallScore, 0, 10),
      correctness: clamp(result.correctness, 0, 10),
      clarity: clamp(result.clarity, 0, 10),
      depth: clamp(result.depth, 0, 10),
      communication: clamp(result.communication, 0, 10),
      strengths: result.strengths || [],
      weaknesses: result.weaknesses || [],
      suggestions: result.suggestions || [],
      aiExplanation: result.aiExplanation || '',
    };
  } catch (err) {
    console.error('Feedback AI error:', err.message);
    // Graceful fallback so interview is not blocked
    return {
      overallScore: 5, correctness: 5, clarity: 5, depth: 5, communication: 5,
      strengths: ['Answer recorded'],
      weaknesses: ['Could not analyze — AI unavailable'],
      suggestions: ['Try again after API key is configured'],
      aiExplanation: 'AI feedback temporarily unavailable.',
    };
  }
};

const generateInterviewSummary = async (answers) => {
  try {
    const prompt = buildInterviewSummaryPrompt(answers);
    const result = await callGPT(
      'You are an expert interviewer. Summarize performance and return only valid JSON.',
      prompt,
      400
    );
    return {
      summary: result.summary || '',
      strongTopics: result.strongTopics || [],
      weakTopics: result.weakTopics || [],
    };
  } catch (err) {
    return { summary: 'Interview completed.', strongTopics: [], weakTopics: [] };
  }
};

const clamp = (val, min, max) => {
  const n = parseFloat(val);
  return isNaN(n) ? min : Math.min(max, Math.max(min, n));
};

module.exports = { analyzeAnswer, generateInterviewSummary };