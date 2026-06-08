const multer = require('multer');
const path   = require('path');

const isProd = process.env.NODE_ENV === 'production';

// ── Storage strategy ──────────────────────────────────
// Dev:  save to server/uploads/ on disk (easy to inspect)
// Prod: keep in RAM (Buffer) — Railway disk is ephemeral
// pdf-parse() works with both file paths and Buffers

const storage = isProd
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
      },
      filename: (req, file, cb) => {
        const unique = `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, unique);
      },
    });

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const resumeUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, 
});

module.exports = { resumeUpload };