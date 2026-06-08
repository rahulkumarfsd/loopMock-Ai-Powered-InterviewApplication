const buildQuestionPrompt = ({ type, difficulty, topic, company }) => {
  const companyStr = company ? ` specifically asked at ${company}` : "";
  return `You are an expert technical interviewer. Generate a single ${difficulty} ${type} interview question${companyStr} on the topic of "${topic}".

Return ONLY a JSON object with this exact shape:
{
  "title": "short question title",
  "body": "full question with all context and requirements",
  "hints": ["hint1", "hint2"],
  "evaluationCriteria": ["criterion1", "criterion2", "criterion3"],
  "sampleAnswer": "a comprehensive ideal answer"
}

Make the question realistic, specific, and what a real interviewer at a top tech company would ask.`;
};

const buildFeedbackPrompt = ({
  questionText,
  answerText,
  type,
  difficulty,
}) => {
  return `You are an expert technical interviewer evaluating a candidate's answer.

QUESTION (${type}, ${difficulty}):
${questionText}

CANDIDATE'S ANSWER:
${answerText || "[No answer provided]"}

Evaluate the answer and return ONLY a JSON object:
{
  "overallScore": <number 0-10>,
  "correctness": <number 0-10>,
  "clarity": <number 0-10>,
  "depth": <number 0-10>,
  "communication": <number 0-10>,
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "aiExplanation": "2-3 sentence overall assessment"
}

Be honest, constructive, and specific. Reference actual content from the answer.`;
};




const buildResumeAnalysisPrompt = (resumeText) => {
  return `You are an expert technical recruiter analyzing a software developer's resume.

RESUME TEXT:
${resumeText.slice(0, 4000)}

Analyze and return ONLY a JSON object:
{
  "role": "detected primary role/title",
  "skills": {
    "strong": ["skill1", "skill2"],
    "weak": ["skill1", "skill2"],
    "missing": ["skill1", "skill2"]
  },
  "interviewProbability": <number 0-100>,
  "summary": "2-3 sentence assessment of the candidate",
  "generatedQuestions": [
    { "question": "question text", "context": "which part of resume triggered this" },
    { "question": "question text", "context": "which part of resume triggered this" },
    { "question": "question text", "context": "which part of resume triggered this" }
  ]
}

Base missing skills on what top companies require for this role. Be specific.`;
};

const buildInterviewSummaryPrompt = (answers) => {
  const summaryData = answers
    .map(
      (a, i) =>
        `Q${i + 1}: ${a.questionText}\nScore: ${a.feedback?.overallScore}/10\nWeaknesses: ${a.feedback?.weaknesses?.join(", ")}`,
    )
    .join("\n\n");

  return `Based on these interview answers, provide a brief overall assessment:

${summaryData}

Return ONLY a JSON object:
{
  "summary": "2-3 sentence overall performance summary",
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
