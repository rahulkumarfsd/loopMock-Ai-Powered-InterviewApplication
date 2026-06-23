/**
 * Judge0 CE — free, no API key needed
 * Public endpoint: https://ce.judge0.com
 * Same engine used by LeetCode
 *
 * Language IDs: https://ce.judge0.com/languages
 */
const axios = require('axios');

const JUDGE0_URL = 'https://ce.judge0.com';

// Language name  Judge0 language_id
// Full list: https://ce.judge0.com/languages
const LANGUAGE_IDS = {
  javascript: 63,   // Node.js 12.14.0
  python:     71,   // Python 3.8.1
  java:       62,   // Java 13.0.1
  cpp:        54,   // C++ (GCC 9.2.0)
  c:          50,   // C (GCC 9.2.0)
  typescript: 74,   // TypeScript 3.7.4
  go:         60,   // Go 1.13.5
  rust:       73,   // Rust 1.40.0
  kotlin:     78,   // Kotlin 1.3.70
  swift:      83,   // Swift 5.2.3
  csharp:     51,   // C# Mono 6.6.0
  php:        68,   // PHP 7.4.1
  ruby:       72,   // Ruby 2.7.0
};

// Judge0 status IDs
const STATUS = {
  1:  'In Queue',
  2:  'Processing',
  3:  'Accepted',
  4:  'Wrong Answer',
  5:  'Time Limit Exceeded',
  6:  'Compilation Error',
  7:  'Runtime Error (SIGSEGV)',
  8:  'Runtime Error (SIGXFSZ)',
  9:  'Runtime Error (SIGFPE)',
  10: 'Runtime Error (SIGABRT)',
  11: 'Runtime Error (NZEC)',
  12: 'Runtime Error (Other)',
  13: 'Internal Error',
  14: 'Exec Format Error',
};

const client = axios.create({
  baseURL: JUDGE0_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

const executeCode = async ({ code, language, stdin = '', expectedOutput = '', timeLimit = 5 }) => {
  const langId = LANGUAGE_IDS[language?.toLowerCase()];

  if (!langId) {
    return {
      passed:     false,
      stdout:     '',
      stderr:     `Unsupported language: "${language}". Supported: ${Object.keys(LANGUAGE_IDS).join(', ')}`,
      compile:    '',
      time:       '0',
      statusDesc: 'Unsupported Language',
    };
  }

  try {
    // Submit
    const { data: submission } = await client.post('/submissions', {
      language_id:     langId,
      source_code:     Buffer.from(code).toString('base64'),
      stdin:           Buffer.from(stdin).toString('base64'),
      expected_output: expectedOutput ? Buffer.from(expectedOutput).toString('base64') : undefined,
      cpu_time_limit:  timeLimit,
      memory_limit:    256000, // 256MB
      base64_encoded:  true,
    }, { params: { base64_encoded: true } });

    const token = submission.token;
    if (!token) throw new Error('No token returned from Judge0');

    // Poll for result (max 15 seconds)
    let result = null;
    for (let i = 0; i < 15; i++) {
      await sleep(1000);
      const { data } = await client.get(`/submissions/${token}`, {
        params: { base64_encoded: true },
      });
      if (data.status?.id > 2) { // > 2 means finished
        result = data;
        break;
      }
    }

    if (!result) {
      return { passed: false, stdout: '', stderr: 'Execution timed out waiting for result', compile: '', time: timeLimit.toString(), statusDesc: 'Time Limit Exceeded' };
    }

    // Decode base64 outputs
    const decode = (s) => s ? Buffer.from(s, 'base64').toString('utf-8').trim() : '';
    const stdout  = decode(result.stdout);
    const stderr  = decode(result.stderr);
    const compile = decode(result.compile_output);

    const statusId   = result.status?.id;
    const statusDesc = STATUS[statusId] || result.status?.description || 'Unknown';

    // Determine pass/fail
    let passed = false;
    if (statusId === 3) {
      // Judge0 says Accepted — but verify our own comparison if we have expected output
      if (expectedOutput !== '' && expectedOutput != null) {
        passed = strictCompare(stdout, expectedOutput);
      } else {
        passed = true;
      }
    } else {
      passed = false;
    }

    return {
      passed,
      stdout,
      stderr:    compile ? '' : stderr,
      compile,
      time:      result.time || '0',
      memory:    result.memory || 0,
      statusDesc: passed ? 'Accepted' : (compile ? 'Compilation Error' : statusDesc),
    };

  } catch (err) {
    const status  = err.response?.status;
    const detail  = err.response?.data?.error || err.response?.data?.message || err.message;

    console.error(`Judge0 error [${err.code || status}]:`, detail);

    if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
      return { passed: false, stdout: '', stderr: 'Time limit exceeded.', compile: '', time: timeLimit.toString(), statusDesc: 'Time Limit Exceeded' };
    }

    if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
      return { passed: false, stdout: '', stderr: 'Code execution service unreachable. Check internet connection.', compile: '', time: '0', statusDesc: 'Service Unavailable' };
    }

    return {
      passed:     false,
      stdout:     '',
      stderr:     `Execution error: ${detail || err.message}`,
      compile:    '',
      time:       '0',
      statusDesc: 'Service Error',
    };
  }
};

/**
 * Strict output comparison — case-sensitive
 * Only normalizes line endings and trailing whitespace
 */
const strictCompare = (actual, expected) => {
  const norm = (s) =>
    String(s)
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .split('\n')
      .map((l) => l.trimEnd())
      .join('\n')
      .trim();
  return norm(actual) === norm(expected);
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const getRuntimes = () => Object.entries(LANGUAGE_IDS).map(([name, id]) => ({ language: name, id }));

const testConnectivity = async () => {
  try {
    const { data } = await client.get('/languages', { timeout: 5000 });
    console.log(` Judge0 CE connected — ${data.length} languages available`);
    return true;
  } catch (err) {
    console.warn(`text-teal-500  Judge0 CE unreachable: ${err.message}`);
    return false;
  }
};

module.exports = { executeCode, getRuntimes, testConnectivity, LANGUAGE_IDS };