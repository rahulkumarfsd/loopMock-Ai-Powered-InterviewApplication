const path   = require('path');
const fs     = require('fs');
const Resume = require('../models/Resume.model');
const { callGPT }                  = require('./openai.service');
const { buildResumeAnalysisPrompt } = require('../utils/promptBuilder');

// ── Keywords that suggest a real resume ──────────────
const RESUME_KEYWORDS = [
  'experience', 'education', 'skills', 'work', 'project', 'university',
  'college', 'engineer', 'developer', 'manager', 'intern', 'bachelor',
  'master', 'degree', 'python', 'javascript', 'java', 'react', 'node',
  'aws', 'git', 'github', 'linkedin', 'email', 'phone', 'objective',
  'summary', 'employment', 'position', 'company', 'technologies',
];

const isLikelyResume = (text) => {
  if (!text || text.trim().length < 100) return false;
  const lower = text.toLowerCase();
  const matches = RESUME_KEYWORDS.filter((kw) => lower.includes(kw));
  return matches.length >= 3; // at least 3 resume keywords
};

// ── Extract text from uploaded file ──────────────────
const extractText = async (filePath, fileName) => {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.txt') {
    return fs.readFileSync(filePath, 'utf-8');
  }

  if (ext === '.pdf') {
    try {
      const pdfParse = require('pdf-parse-new');
      const buffer   = fs.readFileSync(filePath);
      const parsed   = await pdfParse(buffer);
      return parsed.text || '';
    } catch (err) {
      console.warn('pdf-parse failed:', err.message, '— run: npm install pdf-parse');
      return '';
    }
  }

  if (ext === '.docx' || ext === '.doc') {
    try {
      // Try to extract readable text from docx (XML-based)
      const buffer = fs.readFileSync(filePath);
      const raw    = buffer.toString('utf-8', 0, Math.min(buffer.length, 200000));
      // Strip XML tags and extract plain text
      const text   = raw
        .replace(/<[^>]+>/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
        .replace(/\s{3,}/g, '\n')
        .trim();
      return text;
    } catch {
      return '';
    }
  }

  return '';
};

// ── Main analysis function ────────────────────────────
const analyzeResume = async (resumeId) => {
  const resume = await Resume.findById(resumeId);
  if (!resume) return;

  try {
    let text = '';

    if (resume.fileUrl && fs.existsSync(resume.fileUrl)) {
      text = await extractText(resume.fileUrl, resume.fileName || '');
    }

    // ── Validate it's actually a resume ──────────────
    if (!isLikelyResume(text)) {
      console.warn(`Resume ${resumeId}: file doesn't look like a resume (keywords: ${
        RESUME_KEYWORDS.filter(k => text.toLowerCase().includes(k)).join(', ') || 'none'
      })`);

      // Save a clear "not a resume" response — don't hallucinate
      resume.analysis = {
        role:   'Unknown',
        skills: { strong: [], weak: [], missing: [] },
        interviewProbability: 0,
        summary: '⚠️ The uploaded file does not appear to be a resume. Please upload your actual CV/resume (PDF, DOCX, or TXT) containing your work experience, education, and skills.',
        generatedQuestions: [],
      };
      resume.isAnalyzed    = true;
      resume.parsedText    = text.slice(0, 500);
      await resume.save();
      return;
    }

    // Trim to 5000 chars for the prompt
    resume.parsedText = text.slice(0, 5000);

    const prompt = buildResumeAnalysisPrompt(resume.parsedText);
    const result = await callGPT(
      'You are an expert technical recruiter analyzing a software developer resume. Return only valid JSON.',
      prompt,
      1000
    );

    resume.analysis = {
      role:   result.role || 'Software Developer',
      skills: {
        strong:  Array.isArray(result.skills?.strong)  ? result.skills.strong  : [],
        weak:    Array.isArray(result.skills?.weak)    ? result.skills.weak    : [],
        missing: Array.isArray(result.skills?.missing) ? result.skills.missing : [],
      },
      interviewProbability: Math.min(100, Math.max(0, Number(result.interviewProbability) || 60)),
      summary:              result.summary || '',
      generatedQuestions:   Array.isArray(result.generatedQuestions)
        ? result.generatedQuestions.slice(0, 5)
        : [],
    };
    resume.isAnalyzed = true;
    await resume.save();
    console.log(` Resume analyzed: ${resumeId} — role: ${resume.analysis.role}`);

  } catch (err) {
    console.error('Resume analysis error:', err.message);
    resume.analysis = {
      role:   'Unknown',
      skills: { strong: [], weak: [], missing: [] },
      interviewProbability: 0,
      summary: 'Analysis failed — please try uploading your resume again.',
      generatedQuestions: [],
    };
    resume.isAnalyzed = true;
    await resume.save();
  }
};

module.exports = { analyzeResume };