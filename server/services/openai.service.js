const Groq = require('groq-sdk');
const { buildQuestionPrompt } = require('../utils/promptBuilder');
const { getCache, setCache }  = require('../config/redis');

let groq = null;

const getClient = () => {
  if (!groq) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not set in environment variables');
    }
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groq;
};

const callGPT = async (systemPrompt, userPrompt, maxTokens = 1000) => {
  const client = getClient();

  const completion = await client.chat.completions.create({
    model:       'llama-3.1-8b-instant',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user',   content: userPrompt },
    ],
    max_tokens:  maxTokens,
    temperature: 0.7,
    response_format: { type: 'json_object' },
  });

  const raw = completion.choices[0].message.content;
  try {
    return JSON.parse(raw);
  } catch {
    const cleaned = raw.replace(/```json|```/g, '').trim();
    try {
      return JSON.parse(cleaned);
    } catch {
      throw new Error(`Groq returned invalid JSON: ${raw.slice(0, 200)}`);
    }
  }
};

const generateQuestion = async ({ type, difficulty = 'medium', topic, company = '' }) => {
  const resolvedTopic = topic || DEFAULT_TOPICS[type] || 'general';
  const cacheKey = `gen_q:${type}:${difficulty}:${resolvedTopic}:${company}`;

  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const prompt = buildQuestionPrompt({ type, difficulty, topic: resolvedTopic, company });
  const result = await callGPT(
    'You are an expert technical interviewer. Always respond with valid JSON only.',
    prompt,
    800
  );

  const question = {
    _id:                null,
    title:              result.title      || 'Interview Question',
    body:               result.body       || result.question || '',
    type,
    difficulty,
    topic:              resolvedTopic,
    hints:              result.hints              || [],
    evaluationCriteria: result.evaluationCriteria || [],
    isAIGenerated:      true,
  };

  await setCache(cacheKey, question, 3600);
  return question;
};

const DEFAULT_TOPICS = {
  dsa:             'arrays and hash maps',
  'system-design': 'scalable web systems',
  behavioral:      'leadership and teamwork',
  frontend:        'React and JavaScript',
  backend:         'REST APIs and Node.js',
};

module.exports = { generateQuestion, callGPT };