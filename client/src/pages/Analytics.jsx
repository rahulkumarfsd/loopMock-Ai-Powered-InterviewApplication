import { useEffect, useState } from 'react';
import { analyticsService } from '../services';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import Spinner from '../components/ui/Spinner';

export default function Analytics() {
  const [overview, setOverview] = useState(null);
  const [trend,    setTrend]    = useState([]);
  const [topics,   setTopics]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    Promise.all([
      analyticsService.getOverview(),
      analyticsService.getTrend(8),
      analyticsService.getTopics(),
    ])
      .then(([ov, tr, tp]) => {
        setOverview(ov.data);
        setTrend(tr.data.trend   || []);
        setTopics(tp.data.topics || []);
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex h-full min-h-screen items-center justify-center"><Spinner size="lg" /></div>
  );

  if (error) return (
    <div className="flex h-full min-h-screen items-center justify-center flex-col gap-3">
      <p className="text-danger text-sm">{error}</p>
      <button onClick={() => window.location.reload()} className="btn-outline text-sm">Retry</button>
    </div>
  );

  const stats = overview?.stats || {};

  const radarData = Object.entries(overview?.topicScores || {})
    .map(([k, v]) => ({ topic: k.replace(/([A-Z])/g, ' $1').trim(), score: v, fullMark: 10 }))
    .filter((d) => d.score > 0);

  const topicsSorted = [...topics].sort((a, b) => (b.score || 0) - (a.score || 0));
  const strong = topicsSorted.filter((t) => (t.score || 0) >= 7);
  const weak   = topicsSorted.filter((t) => (t.score || 0) > 0 && (t.score || 0) < 6);

  const scoreColor = (s) => s >= 7 ? '#10d98c' : s >= 5 ? '#f59e0b' : '#f87171';

  return (
    <div className="p-8 max-w-6xl">
      <h1 className="font-display text-2xl font-bold mb-2">Performance Analytics</h1>
      <p className="text-[#7a7a8a] text-sm mb-8">Track your progress across all interview types</p>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Interviews', value: stats.totalInterviews || 0,         color: 'text-accent-2' },
          { label: 'Average Score',    value: `${stats.averageScore || 0}/10`,     color: 'text-success'  },
          { label: 'Best Streak',      value: `${stats.streak || 0} days`,         color: 'text-warn'     },
          { label: 'Total Questions',  value: stats.totalQuestions || 0,           color: 'text-info'     },
        ].map((s) => (
          <div key={s.label} className="card p-5">
            <p className="text-xs text-[#7a7a8a] uppercase tracking-wider mb-2">{s.label}</p>
            <p className={`font-display text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="card p-5 col-span-2">
          <h3 className="text-xs text-[#7a7a8a] uppercase tracking-wider mb-4">Score Trend (8 weeks)</h3>
          {trend.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trend}>
                <CartesianGrid stroke="#2a2a35" strokeDasharray="3 3" />
                <XAxis dataKey="week" tick={{ fill: '#7a7a8a', fontSize: 11 }} />
                <YAxis domain={[0, 10]} tick={{ fill: '#7a7a8a', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#1a1a1f', border: '1px solid #2a2a35', borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="avgScore" stroke="#6c63ff" strokeWidth={2}
                  dot={{ fill: '#a78bfa', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[200px]">
              <p className="text-sm text-[#4a4a5a]">Complete interviews to see your trend</p>
            </div>
          )}
        </div>

        <div className="card p-5">
          <h3 className="text-xs text-[#7a7a8a] uppercase tracking-wider mb-4">Skill Radar</h3>
          {radarData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#2a2a35" />
                <PolarAngleAxis dataKey="topic" tick={{ fill: '#7a7a8a', fontSize: 10 }} />
                <Radar dataKey="score" stroke="#6c63ff" fill="#6c63ff" fillOpacity={0.15} />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[200px]">
              <p className="text-sm text-[#4a4a5a]">No skill data yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Topic bars */}
      <div className="card p-6 mb-6">
        <h3 className="text-xs text-[#7a7a8a] uppercase tracking-wider mb-5">Topic Breakdown</h3>
        {topicsSorted.filter((t) => t.score > 0).length > 0 ? (
          <div className="space-y-3">
            {topicsSorted.filter((t) => t.score > 0).map(({ topic, score }) => (
              <div key={topic} className="flex items-center gap-4">
                <span className="text-sm capitalize w-36 flex-shrink-0">
                  {topic.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <div className="flex-1 h-2 bg-bg-4 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${Math.min((score / 10) * 100, 100)}%`, background: scoreColor(score) }} />
                </div>
                <span className="text-sm font-medium w-8 text-right" style={{ color: scoreColor(score) }}>
                  {score.toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#4a4a5a]">Complete interviews to see topic scores</p>
        )}
      </div>

      {/* Strong / Weak */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-success/5 border border-success/20 rounded-2xl p-5">
          <h3 className="text-sm font-medium text-success mb-3">✓ Strong Areas</h3>
          {strong.length > 0
            ? strong.map((t) => <span key={t.topic} className="badge badge-green mr-2 mb-2">{t.topic}</span>)
            : <p className="text-xs text-[#7a7a8a]">Keep practicing to discover your strengths</p>}
        </div>
        <div className="bg-danger/5 border border-danger/20 rounded-2xl p-5">
          <h3 className="text-sm font-medium text-danger mb-3">⚠ Needs Work</h3>
          {weak.length > 0
            ? weak.map((t) => <span key={t.topic} className="badge badge-red mr-2 mb-2">{t.topic}</span>)
            : <p className="text-xs text-[#7a7a8a]">No weak areas detected yet!</p>}
        </div>
      </div>
    </div>
  );
}