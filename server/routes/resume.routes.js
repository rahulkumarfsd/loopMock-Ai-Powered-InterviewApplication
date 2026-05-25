const router = require('express').Router();
const { uploadResume, getLatestResume, getResume } = require('../controllers/resume.controller');
const { protect }      = require('../middleware/auth.middleware');
const { resumeUpload } = require('../middleware/upload.middleware');

router.use(protect);
router.post('/upload', resumeUpload.single('resume'), uploadResume);
router.get('/latest',  getLatestResume);
router.get('/:id',     getResume);

module.exports = router;