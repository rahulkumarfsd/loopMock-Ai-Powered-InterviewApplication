const Question = require("../models/Question.model");
const { asyncHandler, ApiError, sendSuccess } = require("../utils/apiError");
const {
  executeCode,
  getRuntimes,
  testConnectivity,
} = require("../services/judge0ce.service");

const { getCache, setCache } = require("../config/redis");

const getProblems = asyncHandler(async (req, res) => {
   const {
    difficulty,
    topic,
    company,
    search,
    page = 1,
    limit = 20,
  } = req.query;

  const query = {
    type: { $in: ["dsa", "frontend", "backend"] },
    isActive: true,
  };
  if (difficulty && difficulty !== "all") query.difficulty = difficulty;
  if (topic) query.topic = { $regex: topic, $options: "i" };
  if (company) query.company = { $in: [company.toLowerCase()] };
  if (search)
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { tags: { $elemMatch: { $regex: search, $options: "i" } } },
    ];

  const [problems, total] = await Promise.all([
    Question.find(query)
      .sort({ difficulty: 1, usageCount: -1 })
      .skip((page - 1) * Number(limit))
      .limit(Number(limit))
      .select("title difficulty topic type company tags usageCount"),
    Question.countDocuments(query),
  ]);

  const ORDER = { easy: 1, medium: 2, hard: 3 };
  problems.sort(
    (a, b) => (ORDER[a.difficulty] || 2) - (ORDER[b.difficulty] || 2),
  );

  sendSuccess(res, 200, "Problems fetched", {
    problems,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
  });
});

const getProblem = asyncHandler(async (req, res, next) => {
  const problem = await Question.findById(req.params.id).select(
    "-sampleAnswer -coding.testCases.expectedOutput",
  );
  if (!problem) return next(new ApiError(404, "Problem not found"));
  sendSuccess(res, 200, "Problem fetched", { problem });
});

const runCode = asyncHandler(async (req, res, next) => {
  const { code, language, problemId, customInput, useCustom } = req.body;
  if (!code?.trim()) return next(new ApiError(400, "Code is required"));
  if (!language) return next(new ApiError(400, "Language is required"));

  let testCases = [];

  if (!useCustom && problemId) {
    const problem = await Question.findById(problemId);
    if (problem?.coding?.testCases?.length) {
      testCases = problem.coding.testCases
        .filter((tc) => !tc.isHidden)
        .slice(0, 3);
    }
  }

  if (testCases.length === 0) {
    testCases = [{ input: customInput || "", expectedOutput: "" }];
  }

  const results = [];
  for (const tc of testCases) {
    const result = await executeCode({
      code,
      language,
      stdin: tc.input,
      expectedOutput: tc.expectedOutput,
      timeLimit: 5,
    });
    results.push(result);
  }

  sendSuccess(res, 200, "Code executed", { results });
});

const submitCode = asyncHandler(async (req, res, next) => {
  const { code, language, problemId } = req.body;
  if (!code?.trim()) return next(new ApiError(400, "Code is required"));
  if (!language) return next(new ApiError(400, "Language is required"));
  if (!problemId) return next(new ApiError(400, "Problem ID is required"));

  const problem = await Question.findById(problemId);
  if (!problem) return next(new ApiError(404, "Problem not found"));

  const allCases = problem.coding?.testCases || [];
  if (allCases.length === 0)
    return next(new ApiError(400, "No test cases for this problem"));

  const results = [];
  for (const tc of allCases) {
    const result = await executeCode({
      code,
      language,
      stdin: tc.input,
      expectedOutput: tc.expectedOutput,
      timeLimit: (problem.coding?.timeLimit || 5000) / 1000,
    });
    results.push({ ...result, isHidden: tc.isHidden });
  }

  const passed = results.filter((r) => r.passed).length;
  const total = results.length;
  const allPassed = passed === total;
  const maxTime = Math.max(
    ...results.map((r) => parseFloat(r.time) || 0),
  ).toFixed(3);
  const firstFail = results.find((r) => !r.passed);

  await Question.findByIdAndUpdate(problemId, { $inc: { usageCount: 1 } });

  sendSuccess(res, 200, "Submission complete", {
    results,
    passed,
    total,
    allPassed,
    score: Math.round((passed / total) * 10),
    maxTime,
    verdict: allPassed ? "Accepted" : firstFail?.statusDesc || "Wrong Answer",
  });
});

const listLanguages = asyncHandler(async (req, res) => {
  sendSuccess(res, 200, "Languages fetched", { languages: getRuntimes() });
});

module.exports = {
  getProblems,
  getProblem,
  runCode,
  submitCode,
  listLanguages,
};
