import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useInterviewStore from '../store/interveiwStore.js';
import { analyticsService, interviewService } from '../services';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import Spinner from '../components/ui/Spinner';
import Modal from '../components/ui/Modal';
import {
  Brain,
  Boxes,
  MessageSquare,
  Monitor,
  Database,
  Shuffle,
  Calendar,
  Layers,
} from "lucide-react";

const MODES = [
  { type: 'dsa',           label: 'DSA Interview',  desc: 'Arrays, trees, graphs, dynamic programming', icon: Brain },
  { type: 'system-design', label: 'System Design',  desc: 'Design Twitter, Uber, WhatsApp at scale',     icon: Shuffle },
  { type: 'behavioral',    label: 'Behavioral',     desc: 'STAR method, leadership, conflict resolution',icon: MessageSquare },
  { type: 'frontend',      label: 'Frontend Dev',   desc: 'React, JS, CSS, browser APIs',               icon: Monitor },
  { type: 'backend',       label: 'Backend Dev',    desc: 'Node.js, databases, REST, system design',    icon: Database },
  { type: 'mixed',         label: 'Mixed Round',    desc: 'Random questions across all categories',     icon: Boxes },
];

export default function Dashboard() {
  const { user }    = useAuthStore();
  const navigate    = useNavigate();
  const { startInterview, reset } = useInterviewStore();

  const [overview,  setOverview]  = useState(null);
  const [history,   setHistory]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [modal,     setModal]     = useState(null);
  const [config,    setConfig]    = useState({ totalQuestions: 5, mode: 'text' });
  const [starting,  setStarting]  = useState(false);
  const [error,     setError]     = useState(null);

  useEffect(() => {
    reset(); 
    Promise.all([
      analyticsService.getOverview(),
      interviewService.getHistory({ limit: 4 }),
    ])
      .then(([ov, hist]) => {
        setOverview(ov.data);
        setHistory(hist.data.interviews || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleStart = async () => {
    setStarting(true);
    try {
      const interview = await startInterview({ type: modal.type, ...config });
      if (interview) {
        setModal(null);
        navigate(`/interview/${interview._id}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setStarting(false);
    }
  };

  const radarData = overview
    ? Object.entries(overview.topicScores || {}).map(([k, v]) => ({
        topic: k.replace(/([A-Z])/g, ' $1').trim(),
        score: v,
        fullMark: 10,
      }))
    : [];

  const scoreBg = (s) =>
    s >= 8 ? 'bg-success/10 text-success' :
    s >= 6 ? 'bg-warn/10 text-warn' :
             'bg-danger/10 text-danger';

  if (loading) return (
    <div className="flex h-full min-h-screen items-center justify-center">
      <Spinner size="lg" />
    </div>
  );

  if (error) return (
    <div className="flex h-full min-h-screen items-center justify-center flex-col gap-4 p-4 text-center">
      <p className="text-danger text-sm">Failed to load dashboard: {error}</p>
      <button onClick={() => window.location.reload()} className="btn-outline text-sm">Retry</button>
    </div>
  );

  const stats = overview?.stats || {};

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mb-6 sm:mb-8">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
            {user?.name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="text-[#7a7a8a] text-xs sm:text-sm mt-0.5 sm:mt-1">Ready for your next practice session?</p>
        </div>
        <button onClick={() => setModal(MODES[0])} className="btn-primary w-full sm:w-auto justify-center">
          ▶ Start Interview
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
        {[
          { label: 'Interviews Done', value: stats.totalInterviews || 0,          color: 'text-accent-2' },
          { label: 'Avg Score',       value: `${stats.averageScore || 0}/10`,      color: 'text-success'  },
          { label: 'Streak',          value: `🔥 ${stats.streak || 0} days`,        color: 'text-warn'     },
          { label: 'Questions Done',  value: stats.totalQuestions || 0,            color: 'text-info'     },
        ].map((s) => (
          <div key={s.label} className="card p-4 sm:p-5">
            <p className="text-[10px] sm:text-xs text-[#7a7a8a] uppercase tracking-wider mb-1 sm:mb-2">{s.label}</p>
            <p className={`font-display text-xl sm:text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Interview Modes Grid */}
      <h2 className="text-[11px] sm:text-xs font-medium text-[#7a7a8a] uppercase tracking-wider mb-3 sm:mb-4">
        Choose Interview Mode
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 sm:mb-8">
        {MODES.map((m) => (
          <button key={m.type} onClick={() => setModal(m)}
            className="card p-4 sm:p-5 text-left hover:border-border-2 hover:-translate-y-0.5 transition-all group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-bg-4 flex items-center justify-center mb-3 group-hover:bg-accent/10 transition-colors">
              <m.icon size={20} strokeWidth={2} className="text-accent" />
            </div>
            <h3 className="font-medium text-sm mb-1">{m.label}</h3>
            <p className="text-xs text-[#7a7a8a] leading-relaxed line-clamp-2">{m.desc}</p>
          </button>
        ))}
      </div>

      {/* Bottom Layout Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Sessions */}
        <div className="card p-4 sm:p-5">
          <h3 className="text-[10px] sm:text-xs text-[#7a7a8a] uppercase tracking-wider mb-3 sm:mb-4">Recent Sessions</h3>
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Calendar size={32} className="text-[#3a3a4a] mb-2" />
              <p className="text-xs sm:text-sm text-[#4a4a5a]">No interviews yet — start one above!</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {history.map((iv) => {
                const MatchedIcon = MODES.find((m) => m.type === iv.type)?.icon || Layers;
                return (
                  <div key={iv._id}
                    className="flex items-center gap-3 py-3 border-b border-border last:border-0 cursor-pointer hover:bg-bg-4 rounded-lg px-2 -mx-2 transition-colors"
                    onClick={() => navigate(`/feedback/${iv._id}`)}>
                    <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <MatchedIcon size={18} className="text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium capitalize truncate">{iv.type?.replace('-', ' ')} Interview</p>
                      <p className="text-[11px] sm:text-xs text-[#7a7a8a] truncate">
                        {iv.questionsAnswered} questions · {new Date(iv.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg flex-shrink-0 ${scoreBg(iv.averageScore)}`}>
                      {iv.averageScore?.toFixed(1) || '—'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Skill Radar */}
        <div className="card p-4 sm:p-5">
          <h3 className="text-[10px] sm:text-xs text-[#7a7a8a] uppercase tracking-wider mb-3 sm:mb-4">Skill Radar</h3>
          {radarData.some((d) => d.score > 0) ? (
            <div className="w-full h-[220px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" radius="70%" data={radarData}>
                  <PolarGrid stroke="#2a2a35" />
                  <PolarAngleAxis dataKey="topic" tick={{ fill: '#7a7a8a', fontSize: 9 }} />
                  <Radar name="Score" dataKey="score" stroke="#6c63ff" fill="#6c63ff" fillOpacity={0.15} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[220px]">
              <p className="text-xs sm:text-sm text-[#4a4a5a] text-center">Complete interviews to build your radar</p>
            </div>
          )}
        </div>
      </div>

      {/* Start Interview Modal */}
      <Modal open={!!modal} onClose={() => !starting && setModal(null)} title={modal ? `Start ${modal.label}` : ''}>
        {modal && (
          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-[#7a7a8a]">{modal.desc}</p>
            <div>
              <label className="block text-xs text-[#7a7a8a] mb-1.5">Number of Questions</label>
              <select className="input w-full text-sm" value={config.totalQuestions}
                onChange={(e) => setConfig((c) => ({ ...c, totalQuestions: Number(e.target.value) }))}>
                {[3, 5, 8, 10].map((n) => <option key={n} value={n}>{n} questions (~{n * 5} min)</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-[#7a7a8a] mb-1.5">Answer Mode</label>
              <select className="input w-full text-sm" value={config.mode}
                onChange={(e) => setConfig((c) => ({ ...c, mode: e.target.value }))}>
                <option value="text">Text</option>
                <option value="voice">Voice</option>
              </select>
            </div>
            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-2">
              <button onClick={() => setModal(null)} disabled={starting} className="btn-outline w-full justify-center text-sm py-2">
                Cancel
              </button>
              <button onClick={handleStart} disabled={starting} className="btn-primary w-full justify-center text-sm py-2">
                {starting ? <Spinner size="sm" /> : 'Start Now '}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}