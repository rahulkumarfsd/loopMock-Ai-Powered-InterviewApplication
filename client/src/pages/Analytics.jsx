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
    <div className="flex h-full min-h-screen items-center justify-center flex-col gap-3 p-4">
      <p className="text-danger text-sm text-center">{error}</p>
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
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
      <div className='mt-12 sm:mt-0'>
        <h1 className="font-display text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Performance Analytics</h1>
      <p className="text-[#7a7a8a] text-xs sm:text-sm mb-6 sm:mb-8">Track your progress across all interview types</p>

      </div>
      {/* Stats - Grid handles 1 col on mobile, 2 on tablet, 4 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
        {[
          { label: 'Total Interviews', value: stats.totalInterviews || 0,         color: 'text-teal-500-2' },
          { label: 'Average Score',    value: `${stats.averageScore || 0}/10`,     color: 'text-success'  },
          { label: 'Best Streak',      value: `${stats.streak || 0} days`,         color: 'text-warn'     },
          { label: 'Total Questions',  value: stats.totalQuestions || 0,           color: 'text-info'     },
        ].map((s) => (
          <div key={s.label} className="card p-4 sm:p-5">
            <p className="text-[10px] sm:text-xs text-[#7a7a8a] uppercase tracking-wider mb-1 sm:mb-2">{s.label}</p>
            <p className={`font-display text-xl sm:text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Charts row - Grid stacks on mobile, changes layout on tablet/desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
        {/* Line Chart */}
        <div className="card p-4 sm:p-5 lg:col-span-2">
          <h3 className="text-[10px] sm:text-xs text-[#7a7a8a] uppercase tracking-wider mb-4">Score Trend (8 weeks)</h3>
          {trend.length > 0 ? (
            <div className="w-full h-[200px] sm:h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend} margin={{ right: 10, left: -20 }}>
                  <CartesianGrid stroke="#2a2a35" strokeDasharray="3 3" />
                  <XAxis dataKey="week" tick={{ fill: '#7a7a8a', fontSize: 10 }} />
                  <YAxis domain={[0, 10]} tick={{ fill: '#7a7a8a', fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: '#1a1a1f', border: '1px solid #2a2a35', borderRadius: 8, fontSize: 11 }} />
                  <Line type="monotone" dataKey="avgScore" stroke="#6c63ff" strokeWidth={2}
                    dot={{ fill: '#a78bfa', r: 3 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[200px]">
              <p className="text-xs sm:text-sm text-[#4a4a5a]">Complete interviews to see your trend</p>
            </div>
          )}
        </div>

        {/* Radar Chart */}
        <div className="card p-4 sm:p-5">
          <h3 className="text-[10px] sm:text-xs text-[#7a7a8a] uppercase tracking-wider mb-4">Skill Radar</h3>
          {radarData.length > 0 ? (
            <div className="w-full h-[200px] sm:h-[250px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" radius="70%" data={radarData}>
                  <PolarGrid stroke="#2a2a35" />
                  <PolarAngleAxis dataKey="topic" tick={{ fill: '#7a7a8a', fontSize: 9 }} />
                  <Radar dataKey="score" stroke="#6c63ff" fill="#6c63ff" fillOpacity={0.15} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[200px]">
              <p className="text-xs sm:text-sm text-[#4a4a5a]">No skill data yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Topic bars */}
      <div className="card p-4 sm:p-6 mb-4 sm:mb-6">
        <h3 className="text-[10px] sm:text-xs text-[#7a7a8a] uppercase tracking-wider mb-4 sm:mb-5">Topic Breakdown</h3>
        {topicsSorted.filter((t) => t.score > 0).length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            {topicsSorted.filter((t) => t.score > 0).map(({ topic, score }) => (
              <div key={topic} className="flex items-center gap-3 sm:gap-4">
                <span className="text-xs sm:text-sm capitalize w-24 sm:w-36 truncate flex-shrink-0">
                  {topic.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <div className="flex-1 h-2 bg-bg-4 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${Math.min((score / 10) * 100, 100)}%`, background: scoreColor(score) }} />
                </div>
                <span className="text-xs sm:text-sm font-medium w-8 text-right flex-shrink-0" style={{ color: scoreColor(score) }}>
                  {score.toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs sm:text-sm text-[#4a4a5a]">Complete interviews to see topic scores</p>
        )}
      </div>

      {/* Strong / Weak - Stacks on mobile, splits side-by-side on tablet up */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-success/5 border border-success/20 rounded-2xl p-4 sm:p-5">
          <h3 className="text-xs sm:text-sm font-medium text-success mb-3">✓ Strong Areas</h3>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {strong.length > 0
              ? strong.map((t) => <span key={t.topic} className="badge badge-green inline-block">{t.topic}</span>)
              : <p className="text-xs text-[#7a7a8a]">Keep practicing to discover your strengths</p>}
          </div>
        </div>
        <div className="bg-danger/5 border border-danger/20 rounded-2xl p-4 sm:p-5">
          <h3 className="text-xs sm:text-sm font-medium text-danger mb-3">⚠ Needs Work</h3>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {weak.length > 0
              ? weak.map((t) => <span key={t.topic} className="badge badge-red inline-block">{t.topic}</span>)
              : <p className="text-xs text-[#7a7a8a]">No weak areas detected yet!</p>}
          </div>
        </div>
      </div>
    </div>
  );
}