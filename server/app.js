const express      = require('express');
const cors         = require('cors');
const helmet       = require('helmet');
const morgan       = require('morgan');
const cookieParser = require('cookie-parser');
const passport     = require('passport');
require('dotenv').config();

const connectDB = require('./config/db');
require('./config/passport');

const authRoutes      = require('./routes/auth.routes');
const userRoutes      = require('./routes/user.routes');
const interviewRoutes = require('./routes/interview.routes');
const questionRoutes  = require('./routes/question.routes');
const feedbackRoutes  = require('./routes/feedback.routes');
const codingRoutes    = require('./routes/coding.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const resumeRoutes    = require('./routes/resume.routes');

const { globalErrorHandler }                 = require('./middleware/error.middleware');
const { apiLimiter, authLimiter, aiLimiter } = require('./middleware/rateLimit.middleware');

connectDB();

const app = express();

app.use(helmet());
app.use(cors({
  origin:      process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods:     ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use(passport.initialize());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), env: process.env.NODE_ENV });
});

if (process.env.NODE_ENV === 'development') {
  app.use('/api/debug', require('./routes/debug.routes'));
  console.log('🔧 Debug: GET /api/debug/env  |  GET /api/debug/ai');
}

app.use('/api/auth',       apiLimiter, authRoutes);
app.use('/api/users',      apiLimiter, userRoutes);
app.use('/api/interviews', apiLimiter, interviewRoutes);
app.use('/api/questions',  apiLimiter, questionRoutes);
app.use('/api/feedback',   aiLimiter,  feedbackRoutes);
app.use('/api/coding',     apiLimiter, codingRoutes);
app.use('/api/analytics',  apiLimiter, analyticsRoutes);
app.use('/api/resume',     apiLimiter, resumeRoutes);

app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

app.use(globalErrorHandler);

module.exports = app;