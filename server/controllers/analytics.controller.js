const Interview = require("../models/Interview.model");
const User = require("../models/User.model");
const { asyncHandler, sendSuccess } = require("../utils/apiError");

const getOverview = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  sendSuccess(res, 200, "Overview fetched", {
    stats: user.stats,
    topicScores: user.topicScores,
  });
});

const getScoreTrend = asyncHandler(async (req, res) => {
  const { weeks = 8 } = req.query;
  const since = new Date();
  since.setDate(since.getDate() - weeks * 7);

  const interviews = await Interview.find({
    user: req.user._id,
    status: "completed",
    createdAt: { $gte: since },
  })
    .select("averageScore createdAt type")
    .sort("createdAt");

  const weekMap = {};
  interviews.forEach((iv) => {
    const week = `W${Math.ceil((new Date() - new Date(iv.createdAt)) / (7 * 86400000))}`;
    if (!weekMap[week]) weekMap[week] = [];
    weekMap[week].push(iv.averageScore);
  });

  const trend = Object.entries(weekMap)
    .map(([week, scores]) => ({
      week,
      avgScore: parseFloat(
        (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2),
      ),
    }))
    .reverse();

  sendSuccess(res, 200, "Trend fetched", { trend });
});


const getTopicBreakdown = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const topics = Object.entries(user.topicScores).map(([topic, score]) => ({
    topic,
    score,
  }));
  sendSuccess(res, 200, "Topics fetched", { topics });
});


const getActivityHeatmap = asyncHandler(async (req, res) => {
  const since = new Date();
  since.setFullYear(since.getFullYear() - 1);

  const interviews = await Interview.find({
    user: req.user._id,
    status: "completed",
    createdAt: { $gte: since },
  }).select("createdAt");

  const heatmap = {};
  interviews.forEach((iv) => {
    const day = new Date(iv.createdAt).toISOString().split("T")[0];
    heatmap[day] = (heatmap[day] || 0) + 1;
  });

  sendSuccess(res, 200, "Heatmap fetched", { heatmap });
});

module.exports = {
  getOverview,
  getScoreTrend,
  getTopicBreakdown,
  getActivityHeatmap,
};
