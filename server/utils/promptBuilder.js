
const buildQuestionPrompt = ({ type, difficulty, topic, company }) => {
  const companyStr = company ? ` specifically asked at ${company}` : "";
  return `You are an expert technical interviewer. Generate a single ${difficulty} ${type} interview question${companyStr} on the topic of "${topic}".

Return ONLY a JSON object with this exact shape (no markdown, no explanation):
{
  "title": "short question title",
  "body": "full question with all context and requirements",
  "hints": ["hint1", "hint2"],
  "evaluationCriteria": ["criterion1", "criterion2", "criterion3"],
  "sampleAnswer": "a comprehensive ideal answer"
}

Make the question realistic, specific, and what a real interviewer at a top tech company would ask.`;
};

const buildFeedbackPrompt = ({ questionText, answerText, type, difficulty }) => {

  const trimmed      = (answerText || "").trim();
  const wordCount    = trimmed.split(/\s+/).filter(w => w.length > 1).length;
  const charCount    = trimmed.length;
  const avgWordLen   = charCount > 0 ? charCount / Math.max(wordCount, 1) : 0;
  const isGarbage    = charCount < 20 || wordCount < 4 || avgWordLen > 15;

  if (isGarbage) {
    return `You are a strict technical interviewer.

The candidate was asked this question:
"${questionText}"

The candidate submitted this response:
"${trimmed || "[empty]"}"

This response is clearly not a real answer — it is either empty, random characters, keyboard mashing, or completely unrelated to the question.

You MUST return this exact JSON with all scores at 0:
{
  "overallScore": 0,
  "correctness": 0,
  "clarity": 0,
  "depth": 0,
  "communication": 0,
  "strengths": [],
  "weaknesses": ["No answer was provided", "The response was empty or random text"],
  "suggestions": ["Please read the question carefully before answering", "Write at least 2-3 sentences explaining your approach", "A real answer should address the question directly"],
  "aiExplanation": "The candidate did not provide a meaningful answer to the question. All scores are 0 because no technical content, explanation, or attempt was present."
}

Return ONLY that JSON. Do not give any score above 0.`;
  }

  return `You are a strict expert technical interviewer evaluating a candidate's answer at a top tech company.

QUESTION TYPE: ${type} (${difficulty} difficulty)
QUESTION: ${questionText}

CANDIDATE'S ANSWER:
${answerText}

STRICT SCORING RULES — read carefully before scoring:
1. If the answer does NOT address the question topic at all → overallScore, correctness, depth = 0. clarity and communication may get 1-2 ONLY if the writing is at least coherent English.
2. If the answer is vague, off-topic, or random text → ALL scores must be 0. Do NOT reward communication or clarity for irrelevant content.
3. Only give clarity/communication points if the candidate actually attempted to answer the question.
4. Be honest and strict. A real interviewer at Google or Amazon would reject a non-answer immediately.
5. Scores MUST reflect the actual technical content, not the writing style of an unrelated answer.

Return ONLY a JSON object (no markdown, no explanation outside the JSON):
{
  "overallScore": <number 0-10>,
  "correctness": <number 0-10>,
  "clarity": <number 0-10>,
  "depth": <number 0-10>,
  "communication": <number 0-10>,
  "strengths": ["specific strength from the actual answer, or empty array if none"],
  "weaknesses": ["specific weakness from the actual answer"],
  "suggestions": ["specific actionable improvement"],
  "aiExplanation": "2-3 sentence honest assessment referencing actual content from the answer"
}

IMPORTANT: If the answer is clearly not related to the question, return 0 for ALL five scores. Do not give partial credit for unrelated content.`;
};

const buildResumeAnalysisPrompt = (resumeText) => {
  return `You are an expert technical recruiter analyzing a software developer's resume.

RESUME TEXT:
${resumeText.slice(0, 4000)}

Analyze and return ONLY a JSON object (no markdown):
{
  "role": "detected primary role/title",
  "skills": {
    "strong": ["skill1", "skill2"],
    "weak": ["skill1", "skill2"],
    "missing": ["skill1", "skill2"]
  },
  "interviewProbability": <number 0-100>,
  "summary": "2-3 sentence honest assessment of the candidate",
  "generatedQuestions": [
    { "question": "specific question text", "context": "which part of resume triggered this" },
    { "question": "specific question text", "context": "which part of resume triggered this" },
    { "question": "specific question text", "context": "which part of resume triggered this" },
    { "question": "specific question text", "context": "which part of resume triggered this" },
    { "question": "specific question text", "context": "which part of resume triggered this" }
  ]
}

Base missing skills on what top companies require for this role. Reference actual projects, technologies, and experience from the resume. Be specific — not generic.`;
};

const buildInterviewSummaryPrompt = (answers) => {
  const summaryData = answers
    .map((a, i) =>
      `Q${i + 1}: ${a.questionText}\nScore: ${a.feedback?.overallScore ?? 0}/10\nWeaknesses: ${a.feedback?.weaknesses?.join(", ") || "none recorded"}`
    )
    .join("\n\n");

  return `Based on these interview answers, provide an honest overall assessment.

${summaryData}

Return ONLY a JSON object (no markdown):
{
  "summary": "2-3 sentence overall performance summary — be honest about weak areas",
  "strongTopics": ["topic1", "topic2"],
  "weakTopics": ["topic1", "topic2"]
}`;
};

module.exports = {
  buildQuestionPrompt,
  buildFeedbackPrompt,
  buildResumeAnalysisPrompt,
  buildInterviewSummaryPrompt,
};