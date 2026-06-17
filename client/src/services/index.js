import api from './api';

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  refresh: () => api.post('/auth/refresh'),
};

export const interviewService = {
  start: (data) => api.post('/interviews/start', data),
  getNextQuestion: (id) => api.get(`/interviews/${id}/next-question`),
  submitAnswer: (id, data) => api.post(`/interviews/${id}/answer`, data),
  complete: (id) => api.post(`/interviews/${id}/complete`),
  getHistory: (params) => api.get('/interviews/history', { params }),
  getById: (id) => api.get(`/interviews/${id}`),
};

export const questionService = {
  getAll: (params) => api.get('/questions', { params }),
  getById: (id) => api.get(`/questions/${id}`),
};

export const feedbackService = {
  analyze: (data) => api.post('/feedback/analyze', data),
  getAnswerFeedback: (interviewId, index) => api.get(`/feedback/${interviewId}/${index}`),
};


export const codingService = {
  getProblems: (params) => api.get('/coding/problems', { params }),
  getProblem: (id) => api.get(`/coding/problems/${id}`),
  runCode: (data) => api.post('/coding/run', data),
  submitCode: (data) => api.post('/coding/submit', data),
};

export const analyticsService = {
  getOverview: () => api.get('/analytics/overview'),
  getTrend: (weeks) => api.get('/analytics/trend', { params: { weeks } }),
  getTopics: () => api.get('/analytics/topics'),
  getHeatmap: () => api.get('/analytics/heatmap'),
};


export const resumeService = {
  upload: (formData) => api.post('/resume/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getLatest: () => api.get('/resume/latest'),
  getById: (id) => api.get(`/resume/${id}`),
};

export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/change-password', data),
  getLeaderboard: () => api.get('/users/leaderboard'),
};