const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    title:      { type: String, required: true, trim: true },
    body:       { type: String, required: true },
    type: {
      type: String,
      enum: ['dsa', 'system-design', 'behavioral', 'frontend', 'backend'],
      required: true,
    },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    topic:      { type: String, required: true },
    company:    [{ type: String }],

    coding: {
      // Plain object keyed by language name  e.g. { javascript: '...', python: '...' }
      starterCode:  { type: mongoose.Schema.Types.Mixed, default: {} },
      testCases: [
        {
          input:          String,
          expectedOutput: String,
          isHidden:       { type: Boolean, default: false },
        },
      ],
      constraints: [String],
      examples:    [{ input: String, output: String, explanation: String }],
      timeLimit:   { type: Number, default: 2000 },
      memoryLimit: { type: Number, default: 256 },
    },

    evaluationCriteria: [String],
    sampleAnswer:       { type: String, select: false },
    hints:              [String],
    tags:               [String],

    isActive:   { type: Boolean, default: true },
    usageCount: { type: Number,  default: 0 },
  },
  { timestamps: true }
);

questionSchema.index({ type: 1, difficulty: 1 });
questionSchema.index({ company: 1 });
questionSchema.index({ topic: 1 });

module.exports = mongoose.model('Question', questionSchema);