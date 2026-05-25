const updateUserStats = (user, interview) => {
  const stats = user.stats;
  const now = new Date();

  // Streak: compare BEFORE updating lastActive
  const today     = now.toDateString();
  const yesterday = new Date(now - 86400000).toDateString();
  const lastActive = stats.lastActive ? new Date(stats.lastActive).toDateString() : null;

  if (lastActive === yesterday) {
    stats.streak += 1;
  } else if (lastActive !== today) {
    stats.streak = 1;
  }
  // If lastActive === today, streak stays same (already counted today)

  // Rolling average
  const prev = stats.totalInterviews;
  stats.totalInterviews = prev + 1;
  stats.averageScore = parseFloat(
    ((stats.averageScore * prev + interview.averageScore) / stats.totalInterviews).toFixed(2)
  );
  stats.totalQuestions += interview.questionsAnswered || 0;
  stats.lastActive = now;

  return stats;
};

const updateTopicScores = (user, interview) => {
  const topicMap = {
    dsa: 'dsa',
    'system-design': 'systemDesign',
    behavioral: 'behavioral',
    frontend: 'frontend',
    backend: 'backend',
    mixed: null,
  };

  const key = topicMap[interview.type];
  if (!key || !interview.averageScore) return user.topicScores;

  const current = user.topicScores[key] || 0;
  user.topicScores[key] = parseFloat(
    (current === 0 ? interview.averageScore : current * 0.7 + interview.averageScore * 0.3).toFixed(2)
  );

  return user.topicScores;
};

module.exports = { updateUserStats, updateTopicScores };