import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { interviewService } from '../services';
import ScoreRing from '../components/ui/ScoreRing';
import Spinner from '../components/ui/Spinner';

const TYPE_EMOJI = {
  dsa: '🧠', 'system-design': '⚙️', behavioral: '💬',
  frontend: '🖥️', backend: '🔧', mixed: '🎲',
};

export default function Feedback() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const [interview, setInterview] = useState(null);
  const [selected,  setSelected]  = useState(0);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  useEffect(() => {
    interviewService.getById(id)
      .then(({ data }) => setInterview(data.interview))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load interview'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex h-full min-h-screen items-center justify-center"><Spinner size="lg" /></div>
  );
  if (error) return (
    <div className="flex h-full min-h-screen items-center justify-center flex-col gap-4">
      <p className="text-danger text-sm">{error}</p>
      <button onClick={() => navigate('/dashboard')} className="btn-outline text-sm">← Dashboard</button>
    </div>
  );
  if (!interview) return null;

  const answers  = interview.answers || [];
  const fb       = answers[selected]?.feedback;
  const scoreColor = (s) => s >= 8 ? '#10d98c' : s >= 6 ? '#f59e0b' : '#f87171';
  const scoreBg    = (s) => s >= 8 ? 'bg-success/10 text-success' : s >= 6 ? 'bg-warn/10 text-warn' : 'bg-danger/10 text-danger';

  return (
    <div className="p-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button onClick={() => navigate('/dashboard')} className="btn-ghost text-xs mb-2 px-0">← Dashboard</button>
          <h1 className="font-display text-2xl font-bold">Interview Review</h1>
          <p className="text-[#7a7a8a] text-sm capitalize mt-1">
            {TYPE_EMOJI[interview.type]} {interview.type?.replace('-', ' ')} · {answers.length} questions
          </p>
        </div>
        <button onClick={() => navigate('/interview')} className="btn-primary">Practice Again</button>
      </div>

      {/* Overall score card */}
      <div className="card p-8 mb-6 flex items-center gap-8">
        <ScoreRing score={interview.averageScore || 0} size={140} stroke={10} />
        <div className="flex-1">
          <h2 className="font-display text-xl font-bold mb-2">Overall Performance</h2>
          <p className="text-[#7a7a8a] text-sm mb-4 leading-relaxed">
            {interview.summary || 'Interview completed successfully.'}
          </p>
          <div className="flex gap-6 flex-wrap">
            {interview.strongTopics?.length > 0 && (
              <div>
                <p className="text-xs text-success font-medium mb-1.5">Strong Topics</p>
                <div className="flex gap-1.5 flex-wrap">
                  {interview.strongTopics.map((t) => <span key={t} className="badge badge-green">{t}</span>)}
                </div>
              </div>
            )}
            {interview.weakTopics?.length > 0 && (
              <div>
                <p className="text-xs text-danger font-medium mb-1.5">Needs Work</p>
                <div className="flex gap-1.5 flex-wrap">
                  {interview.weakTopics.map((t) => <span key={t} className="badge badge-red">{t}</span>)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Answer selector */}
      {answers.length > 0 && (
        <>
          <h3 className="text-xs text-[#7a7a8a] uppercase tracking-wider mb-3">Per-Question Breakdown</h3>
          <div className="grid grid-cols-3 gap-2 mb-5">
            {answers.map((a, i) => (
              <button key={i} onClick={() => setSelected(i)}
                className={`p-3 rounded-xl text-left transition-all border ${
                  selected === i ? 'border-accent bg-accent/10' : 'border-border bg-bg-3 hover:border-border-2'
                }`}>
                <p className="text-xs text-[#7a7a8a] mb-1">Q{i + 1}</p>
                <p className="text-sm font-medium truncate">{a.questionText?.slice(0, 45)}…</p>
                <p className="text-lg font-bold mt-1"
                  style={{ color: scoreColor(a.feedback?.overallScore || 0) }}>
                  {a.feedback?.overallScore ?? '—'}
                  <span className="text-xs text-[#7a7a8a]">/10</span>
                </p>
              </button>
            ))}
          </div>

          {/* Detailed feedback for selected */}
          {fb && (
            <div className="card p-6 animate-fade-in">
              <div className="mb-4">
                <p className="text-xs text-[#7a7a8a] mb-1">Question {selected + 1}</p>
                <p className="font-medium text-sm leading-relaxed">{answers[selected].questionText}</p>
              </div>

              {/* User's answer */}
              <div className="bg-bg-4 rounded-xl p-4 mb-5">
                <p className="text-xs text-[#7a7a8a] mb-1.5">Your Answer</p>
                <p className="text-sm text-[#c0c0cc] leading-relaxed">
                  {answers[selected].answerText || '(no answer recorded)'}
                </p>
              </div>

              {/* Score breakdown */}
              <div className="grid grid-cols-4 gap-3 mb-5">
                {['correctness', 'clarity', 'depth', 'communication'].map((k) => (
                  <div key={k} className="bg-bg-4 rounded-xl p-3 text-center">
                    <p className="text-xs text-[#7a7a8a] capitalize mb-2">{k}</p>
                    <p className="font-display text-xl font-bold" style={{ color: scoreColor(fb[k] || 0) }}>
                      {fb[k] ?? 0}
                    </p>
                  </div>
                ))}
              </div>

              {/* S / W / S cards */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-success/5 border border-success/15 rounded-xl p-4">
                  <p className="text-xs text-success font-medium mb-2">✓ Strengths</p>
                  {fb.strengths?.length > 0
                    ? fb.strengths.map((s, i) => (
                        <p key={i} className="text-xs text-[#7a7a8a] py-1.5 border-b border-white/5 last:border-0">{s}</p>
                      ))
                    : <p className="text-xs text-[#4a4a5a]">None noted</p>}
                </div>
                <div className="bg-danger/5 border border-danger/15 rounded-xl p-4">
                  <p className="text-xs text-danger font-medium mb-2">✗ Weaknesses</p>
                  {fb.weaknesses?.length > 0
                    ? fb.weaknesses.map((s, i) => (
                        <p key={i} className="text-xs text-[#7a7a8a] py-1.5 border-b border-white/5 last:border-0">{s}</p>
                      ))
                    : <p className="text-xs text-[#4a4a5a]">None noted</p>}
                </div>
                <div className="bg-accent/5 border border-accent/15 rounded-xl p-4">
                  <p className="text-xs text-accent-2 font-medium mb-2">→ Suggestions</p>
                  {fb.suggestions?.length > 0
                    ? fb.suggestions.map((s, i) => (
                        <p key={i} className="text-xs text-[#7a7a8a] py-1.5 border-b border-white/5 last:border-0">{s}</p>
                      ))
                    : <p className="text-xs text-[#4a4a5a]">None</p>}
                </div>
              </div>

              {fb.aiExplanation && (
                <p className="text-sm text-[#7a7a8a] bg-bg-4 rounded-xl px-4 py-3">
                  {fb.aiExplanation}
                </p>
              )}
            </div>
          )}
        </>
      )}

      {answers.length === 0 && (
        <div className="card p-8 text-center">
          <p className="text-[#7a7a8a] text-sm">No answers recorded for this interview</p>
          <button onClick={() => navigate('/dashboard')} className="btn-outline text-sm mt-4">Go to Dashboard</button>
        </div>
      )}
    </div>
  );
}