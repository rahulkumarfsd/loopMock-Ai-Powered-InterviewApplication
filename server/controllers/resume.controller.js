const pdfParse = require('pdf-parse-new');
const Resume   = require('../models/Resume.model');
const { callGPT } = require('../services/openai.service');
const { asyncHandler, ApiError, sendSuccess } = require('../utils/apiError');

// ── Keywords to validate it's actually a resume ───────
const RESUME_KEYWORDS = [
  'experience', 'education', 'skills', 'work', 'project',
  'developer', 'engineer', 'bachelor', 'university', 'internship',
  'employment', 'qualification', 'objective', 'summary', 'linkedin',
];

const isLikelyResume = (text) => {
  const lower = text.toLowerCase();
  const found = RESUME_KEYWORDS.filter((kw) => lower.includes(kw));
  return found.length >= 3; // must match at least 3 resume keywords
};

// POST /api/resume/upload
const uploadResume = asyncHandler(async (req, res, next) => {
  if (!req.file) return next(new ApiError(400, 'No file uploaded'));

  // ── Parse PDF ─────────────────────────────────────
  // In prod: req.file.buffer (memoryStorage — Buffer in RAM)
  // In dev:  req.file.path   (diskStorage — file path on disk)
  let parsedText;
  try {
    const source = req.file.buffer || req.file.path;
    // pdf-parse-new accepts both Buffer and file path
    const parsed = await pdfParse(source);
    parsedText = parsed.text?.trim();
  } catch (err) {
    return next(new ApiError(400, 'Failed to read PDF. Make sure it is not password protected.'));
  }

  if (!parsedText || parsedText.length < 100) {
    return next(new ApiError(400, 'PDF appears to be empty or scanned image. Upload a text-based PDF.'));
  }

  // ── Validate it's a resume ────────────────────────
  if (!isLikelyResume(parsedText)) {
    return next(new ApiError(400,
      'This does not look like a resume. Please upload your CV/resume PDF.'
    ));
  }

  // ── Save initial record ───────────────────────────
  const resume = await Resume.create({
    user:       req.user._id,
    fileName:   req.file.originalname,
    fileSize:   req.file.size,
    // In prod we don't save the file — no fileUrl
    fileUrl:    req.file.path || null,
    parsedText,
    isAnalyzed: false,
  });

  // ── AI analysis (async — don't block response) ────
  // Return the resume ID immediately so frontend can poll
  analyzeResume(resume._id, parsedText).catch((err) => {
    console.error('Resume analysis failed:', err.message);
  });

  sendSuccess(res, 201, 'Resume uploaded — analysis in progress', {
    resumeId: resume._id,
    fileName: resume.fileName,
    status:   'analyzing',
  });
});

// Background job — called async, never awaited in upload handler
const analyzeResume = async (resumeId, parsedText) => {
  const prompt = `You are a senior technical recruiter at a top tech company.
Analyze this resume and return ONLY valid JSON. No markdown, no explanation.

Resume text:
${parsedText.slice(0, 4000)}

Return this exact JSON:
{
  "role": "Most likely job role (e.g. Frontend Developer, Backend Engineer)",
  "skills": {
    "strong":  ["skill1", "skill2"],
    "weak":    ["skill3"],
    "missing": ["skill4", "skill5"]
  },
  "interviewProbability": 75,
  "summary": "2-3 sentence honest assessment of the candidate",
  "generatedQuestions": [
    "Specific question 1 based on their actual projects",
    "Specific question 2 based on their tech stack",
    "Specific question 3 about their experience gaps",
    "Specific question 4 behavioral based on their background",
    "Specific question 5 technical deep dive"
  ]
}

interviewProbability is 0-100. Be specific — mention actual technologies and projects from the resume.`;

  const analysis = await callGPT(prompt, 1500);

  await Resume.findByIdAndUpdate(resumeId, {
    isAnalyzed: true,
    analysis,
  });

  console.log(` Resume ${resumeId} analyzed`);
};

// GET /api/resume/:id — frontend polls this until isAnalyzed = true
const getResume = asyncHandler(async (req, res, next) => {
  const resume = await Resume.findOne({
    _id:  req.params.id,
    user: req.user._id,
  });

  if (!resume) return next(new ApiError(404, 'Resume not found'));

  sendSuccess(res, 200, 'Resume fetched', {
    resume: {
      _id:        resume._id,
      fileName:   resume.fileName,
      isAnalyzed: resume.isAnalyzed,
      analysis:   resume.analysis,
      createdAt:  resume.createdAt,
    },
  });
});

// GET /api/resume/latest
const getLatestResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ user: req.user._id })
    .sort({ createdAt: -1 });

  sendSuccess(res, 200, 'Latest resume', { resume });
});

module.exports = { uploadResume, getResume, getLatestResume };