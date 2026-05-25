const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
  questionText: String, // snapshot at time of answer
  answerText: String,
  answerType: { type: String, enum: ['text', 'voice', 'code'], default: 'text' },
  code: { type: String }, // for coding interviews
  language: { type: String }, // for coding interviews
  timeTaken: { type: Number }, // seconds
  feedback: {
    overallScore: { type: Number, min: 0, max: 10 },
    correctness: { type: Number, min: 0, max: 10 },
    clarity: { type: Number, min: 0, max: 10 },
    depth: { type: Number, min: 0, max: 10 },
    communication: { type: Number, min: 0, max: 10 },
    strengths: [String],
    weaknesses: [String],
    suggestions: [String],
    aiExplanation: String,
  },
});

const interviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['dsa', 'system-design', 'behavioral', 'frontend', 'backend', 'coding', 'mixed'],
      required: true,
    },
    mode: { type: String, enum: ['text', 'voice', 'coding', 'peer'], default: 'text' },
    company: { type: String, default: '' }, // for company-specific interviews
    status: { type: String, enum: ['in-progress', 'completed', 'abandoned'], default: 'in-progress' },

    answers: [answerSchema],
    totalQuestions: { type: Number, default: 0 },
    questionsAnswered: { type: Number, default: 0 },

    // Aggregate scores
    averageScore: { type: Number, default: 0 },
    totalTimeTaken: { type: Number, default: 0 }, // seconds

    // AI-generated overall summary
    summary: { type: String },
    strongTopics: [String],
    weakTopics: [String],

    // For peer interviews
    peer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

interviewSchema.index({ user: 1, createdAt: -1 });
interviewSchema.index({ user: 1, type: 1 });

module.exports = mongoose.model('Interview', interviewSchema);