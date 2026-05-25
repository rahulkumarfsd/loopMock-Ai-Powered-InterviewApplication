const router = require('express').Router();
const { getProblems, getProblem, runCode, submitCode, listLanguages } = require('../controllers/coding.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/languages',     listLanguages);
router.get('/problems',      getProblems);
router.get('/problems/:id',  getProblem);
router.post('/run',    protect, runCode);
router.post('/submit', protect, submitCode);

module.exports = router;