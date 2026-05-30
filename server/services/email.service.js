const { Resend } = require('resend');

const resend  = new Resend(process.env.RESEND_API_KEY);
const FROM    = process.env.FROM_EMAIL || 'LoopMock <noreply@LoopMock.dev>';
const APP_URL = process.env.CLIENT_URL  || 'http://localhost:5173';

const base = (content) => `<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0d0d0f;font-family:Arial,sans-serif">
  <div style="max-width:580px;margin:0 auto;padding:32px 16px">
    <div style="text-align:center;margin-bottom:24px">
      <span style="font-size:22px;font-weight:800;color:#fff">Inter<span style="color:#6c63ff">AI</span></span>
    </div>
    <div style="background:#141416;border:1px solid #2a2a35;border-radius:16px;padding:32px">
      ${content}
    </div>
    <div style="text-align:center;margin-top:20px;color:#4a4a5a;font-size:12px">
      <p>LoopMock — AI-Powered Interview Practice</p>
      <a href="${APP_URL}" style="color:#6c63ff;text-decoration:none">Visit LoopMock</a>
    </div>
  </div>
</body></html>`;

const h1  = (t) => `<h1 style="color:#fff;font-size:22px;margin:0 0 8px">${t}</h1>`;
const p   = (t) => `<p style="color:#c0c0cc;font-size:14px;line-height:1.7;margin:12px 0">${t}</p>`;
const btn = (t, url, c = '#6c63ff') =>
  `<a href="${url}" style="display:inline-block;background:${c};color:#fff;padding:12px 28px;border-radius:10px;text-decoration:none;font-weight:600;font-size:14px;margin-top:16px">${t}</a>`;

const stat = (label, val) =>
  `<div style="background:#1a1a1f;border:1px solid #2a2a35;border-radius:10px;padding:16px;text-align:center">
    <div style="color:#7a7a8a;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">${label}</div>
    <div style="color:#fff;font-size:22px;font-weight:700">${val}</div>
  </div>`;

const templates = {
  welcome: (name) => base(`
    ${h1(`Welcome to LoopMock, ${name}! 🎉`)}
    ${p('You\'re all set. Here\'s what you can do:')}
    <ul style="color:#c0c0cc;font-size:14px;line-height:2;padding-left:20px">
      <li>🧠 Practice <b>DSA, System Design, Behavioral</b> interviews with AI</li>
      <li>💻 Solve coding problems in a <b>LeetCode-style</b> editor</li>
      <li>📄 Upload your resume for <b>AI skill gap analysis</b></li>
      <li>🏢 Prep for <b>Amazon, Google, TCS, Infosys</b> and more</li>
    </ul>
    ${btn('Start Practicing ', `${APP_URL}/dashboard`)}
  `),

  weeklyReport: (name, stats) => base(`
    ${h1(`Your Weekly Report, ${name} 📊`)}
    ${p('Here\'s how you did this week:')}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:20px 0">
      ${stat('Interviews', stats.interviews || 0)}
      ${stat('Avg Score', `${stats.avgScore || 0}/10`)}
      ${stat('Streak', `${stats.streak || 0} days 🔥`)}
      ${stat('Best Topic', stats.bestTopic || 'N/A')}
    </div>
    ${stats.weakTopic ? p(`💡 Focus area: <b>${stats.weakTopic}</b>`) : ''}
    ${btn('View Analytics ', `${APP_URL}/analytics`)}
  `),

  streakReminder: (name, days) => base(`
    ${h1(`Don't break your ${days}-day streak! 🔥`)}
    ${p(`Your <b>${days}-day streak</b> is at risk. Just one session keeps it alive.`)}
    ${btn('Practice Now ', `${APP_URL}/interview`, '#f59e0b')}
  `),

  verifyEmail: (name, token) => base(`
    ${h1(`Verify your email, ${name}`)}
    ${p('Click below to verify your email. Link expires in 24 hours.')}
    ${btn('Verify Email ', `${APP_URL}/verify-email?token=${token}`)}
  `),
};

const send = async ({ to, subject, html }) => {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[Email disabled] "${subject}"  ${to}`);
    return;
  }
  try {
    await resend.emails.send({ from: FROM, to, subject, html });
    console.log(`✉️  Sent "${subject}"  ${to}`);
  } catch (err) {
    console.error('Email error:', err.message);
  }
};

const sendWelcome       = (user)        => send({ to: user.email, subject: 'Welcome to LoopMock! 🎉',                 html: templates.welcome(user.name) });
const sendWeeklyReport  = (user, stats) => send({ to: user.email, subject: 'Your weekly LoopMock report 📊',          html: templates.weeklyReport(user.name, stats) });
const sendStreakReminder = (user, days)  => send({ to: user.email, subject: `Don't break your ${days}-day streak 🔥`, html: templates.streakReminder(user.name, days) });
const sendVerifyEmail   = (user, token) => send({ to: user.email, subject: 'Verify your LoopMock email',              html: templates.verifyEmail(user.name, token) });

module.exports = { sendWelcome, sendWeeklyReport, sendStreakReminder, sendVerifyEmail };