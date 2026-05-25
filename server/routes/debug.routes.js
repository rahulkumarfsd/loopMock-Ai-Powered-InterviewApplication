const router = require('express').Router();

// GET /api/debug/env
router.get('/env', (req, res) => {
  const check = (val) => {
    if (!val || val.trim() === '') return { status: 'MISSING' };
    if (val.includes('your_') || val.includes('change_this') || val.includes('another_long')) {
      return { status: 'PLACEHOLDER' };
    }
    return { status: 'SET', preview: val.slice(0, 10) + '...' };
  };

  res.json({
    MONGO_URI:            check(process.env.MONGO_URI),
    JWT_SECRET:           check(process.env.JWT_SECRET),
    GROQ_API_KEY:         check(process.env.GROQ_API_KEY),
    OPENAI_API_KEY:       check(process.env.OPENAI_API_KEY),
    GOOGLE_CLIENT_ID:     check(process.env.GOOGLE_CLIENT_ID),
    GOOGLE_CLIENT_SECRET: check(process.env.GOOGLE_CLIENT_SECRET),
    JUDGE0_API_KEY:       check(process.env.JUDGE0_API_KEY),
    REDIS_URL:            check(process.env.REDIS_URL),
    CLIENT_URL:           check(process.env.CLIENT_URL),
    NODE_ENV:             process.env.NODE_ENV || 'not set',
    PORT:                 process.env.PORT     || 'not set',
  });
});

// GET /api/debug/ai — tests Groq (falls back to OpenAI check if no Groq key)
router.get('/ai', async (req, res) => {
  const groqKey  = process.env.GROQ_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!groqKey && !openaiKey) {
    return res.status(500).json({ status: 'FAIL', reason: 'Neither GROQ_API_KEY nor OPENAI_API_KEY is set' });
  }

  // Try Groq first
  if (groqKey) {
    try {
      const Groq = require('groq-sdk');
      const client = new Groq({ apiKey: groqKey });
      const completion = await client.chat.completions.create({
        model:    'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: 'Reply with exactly this JSON: {"ok":true,"provider":"groq"}' }],
        max_tokens: 30,
        response_format: { type: 'json_object' },
      });
      const result = JSON.parse(completion.choices[0].message.content);
      return res.json({
        status:     'OK',
        provider:   'Groq',
        model:      'llama-3.1-8b-instant',
        response:   result,
        keyPreview: groqKey.slice(0, 10) + '...',
      });
    } catch (err) {
      return res.status(500).json({
        status:     'FAIL',
        provider:   'Groq',
        error:      err.message,
        keyPreview: groqKey.slice(0, 10) + '...',
        hint:       getHint(err.message),
      });
    }
  }
});

function getHint(msg) {
  if (msg.includes('401') || msg.includes('invalid') || msg.includes('auth')) {
    return 'API key is wrong — check console.groq.com/keys and regenerate';
  }
  if (msg.includes('429') || msg.includes('quota') || msg.includes('rate')) {
    return 'Rate limit hit — wait a moment and try again (Groq free tier is very generous)';
  }
  if (msg.includes('ENOTFOUND') || msg.includes('network')) {
    return 'Network error — check your internet connection';
  }
  if (msg.includes('not set')) {
    return 'Key not in .env — add GROQ_API_KEY=gsk_... to server/.env and restart';
  }
  return 'Unknown — see error field above';
}

module.exports = router;