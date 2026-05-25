const cron      = require('node-cron');
const User      = require('../models/User.model');
const Interview = require('../models/Interview.model');
const { sendWeeklyReport, sendStreakReminder } = require('../services/email.service');

const initCronJobs = () => {

  // ── Weekly report — every Monday 9am ──────────────
  cron.schedule('0 9 * * 1', async () => {
    console.log('📧 Weekly reports running…');
    try {
      const since = new Date(Date.now() - 7 * 86400000);
      const users = await User.find({ 'stats.totalInterviews': { $gt: 0 } });

      for (const user of users) {
        const interviews = await Interview.find({
          user: user._id, status: 'completed', createdAt: { $gte: since },
        });
        if (!interviews.length) continue;

        const scores   = interviews.map((i) => i.averageScore).filter(Boolean);
        const avgScore = scores.length
          ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : 0;

        const byType = {};
        interviews.forEach((iv) => {
          byType[iv.type] = (byType[iv.type] || []).concat(iv.averageScore || 0);
        });
        const typeAvgs = Object.entries(byType).map(([t, s]) => ({
          type: t, score: s.reduce((a, b) => a + b, 0) / s.length,
        }));
        const best = [...typeAvgs].sort((a, b) => b.score - a.score)[0];
        const weak = [...typeAvgs].sort((a, b) => a.score - b.score)[0];

        await sendWeeklyReport(user, {
          interviews: interviews.length,
          avgScore,
          streak:    user.stats.streak,
          bestTopic: best?.type?.replace('-', ' ') || 'N/A',
          weakTopic: weak?.type?.replace('-', ' ') || null,
        });
      }
      console.log(` Weekly reports sent to ${users.length} users`);
    } catch (err) {
      console.error('Weekly report error:', err.message);
    }
  });

  // ── Streak reminder — every day 8pm ───────────────
  cron.schedule('0 20 * * *', async () => {
    console.log('🔥 Streak reminders running…');
    try {
      const yesterday  = new Date(Date.now() - 86400000);
      const twoDaysAgo = new Date(Date.now() - 2 * 86400000);

      const atRisk = await User.find({
        'stats.streak':     { $gte: 3 },
        'stats.lastActive': { $gte: twoDaysAgo, $lt: yesterday },
      });

      for (const user of atRisk) {
        await sendStreakReminder(user, user.stats.streak);
      }
      console.log(` Streak reminders sent to ${atRisk.length} users`);
    } catch (err) {
      console.error('Streak reminder error:', err.message);
    }
  });

  // ── Monthly usage reset — 1st of month midnight ───
  cron.schedule('0 0 1 * *', async () => {
    console.log('🔄 Monthly usage reset…');
    try {
      await User.updateMany({}, {
        $set: {
          'usage.interviewsThisMonth': 0,
          'usage.resumesThisMonth':    0,
          'usage.lastResetAt':         new Date(),
        },
      });
      console.log(' Monthly usage reset done');
    } catch (err) {
      console.error('Usage reset error:', err.message);
    }
  });

  console.log('⏰ Cron jobs active: weekly reports · streak reminders · monthly reset');
};

module.exports = { initCronJobs };