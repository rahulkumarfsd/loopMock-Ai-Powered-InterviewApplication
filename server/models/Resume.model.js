const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fileUrl: { type: String, required: true },
    fileName: { type: String },
    fileSize: { type: Number },
    parsedText: { type: String }, // extracted text content

    // AI analysis results
    analysis: {
      role: { type: String }, // detected role (e.g. "MERN Stack Developer")
      skills: {
        strong: [String],
        weak: [String],
        missing: [String],
      },
      interviewProbability: { type: Number, min: 0, max: 100 },
      summary: { type: String },
      generatedQuestions: [
        {
          question: String,
          context: String, // what part of resume triggered this
        },
      ],
    },

    isAnalyzed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

resumeSchema.index({ user: 1 });

module.exports = mongoose.model('Resume', resumeSchema);