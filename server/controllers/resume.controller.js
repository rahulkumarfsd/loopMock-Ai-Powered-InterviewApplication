const Resume = require('../models/Resume.model');
const { asyncHandler, ApiError, sendSuccess } = require('../utils/apiError');
const { analyzeResume } = require('../services/resume.service');

// @route  POST /api/resume/upload
const uploadResume = asyncHandler(async (req, res, next) => {
  if (!req.file) return next(new ApiError(400, 'No file uploaded'));

  const resume = await Resume.create({
    user: req.user._id,
    fileUrl: req.file.path,
    fileName: req.file.originalname,
    fileSize: req.file.size,
  });

  // Kick off async analysis — don't await
  analyzeResume(resume._id).catch(console.error);

  sendSuccess(res, 201, 'Resume uploaded — analysis in progress', { resume });
});

// @route  GET /api/resume/latest
const getLatestResume = asyncHandler(async (req, res, next) => {
  const resume = await Resume.findOne({ user: req.user._id }).sort({ createdAt: -1 });
  if (!resume) return next(new ApiError(404, 'No resume found'));
  sendSuccess(res, 200, 'Resume fetched', { resume });
});

// @route  GET /api/resume/:id
const getResume = asyncHandler(async (req, res, next) => {
  const resume = await Resume.findById(req.params.id);
  if (!resume) return next(new ApiError(404, 'Resume not found'));
  if (resume.user.toString() !== req.user._id.toString()) {
    return next(new ApiError(403, 'Access denied'));
  }
  sendSuccess(res, 200, 'Resume fetched', { resume });
});

module.exports = { uploadResume, getLatestResume, getResume };