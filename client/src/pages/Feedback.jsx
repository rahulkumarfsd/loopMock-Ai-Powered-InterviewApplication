import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { interviewService } from '../services';
import ScoreRing from '../components/ui/ScoreRing';
import Spinner from '../components/ui/Spinner';
import {
  Brain,
  Shuffle,
  MessageSquare,
  Monitor,
  Database,
  Boxes,
  ArrowLeft,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Lightbulb,
} from 'lucide-react';

const TYPE_ICONS = {
  dsa: Brain,
  'system-design': Shuffle,
  behavioral: MessageSquare,
  frontend: Monitor,
  backend: Database,
  mixed: Boxes,
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
    <div className="flex h-full min-h-screen items-center justify-center flex-col gap-4 p-4 text-center">
      <p className="text-danger text-sm">{error}</p>
      <button onClick={() => navigate('/dashboard')} className="btn-outline text-sm">← Dashboard</button>
    </div>
  );
  if (!interview) return null;

  const answers  = interview.answers || [];
  const fb       = answers[selected]?.feedback;
  const scoreColor = (s) => s >= 8 ? '#10d98c' : s >= 6 ? '#f59e0b' : '#f87171';

  const IconComponent = TYPE_ICONS[interview.type] || Boxes;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mb-6 sm:mb-8">
        <div>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="btn-ghost text-xs mb-2 px-0 flex items-center gap-1.5"
          >
            <ArrowLeft size={14} /> Dashboard
          </button>
          <h1 className="font-display text-xl sm:text-2xl font-bold">Interview Review</h1>
          <div className="flex items-center gap-2 text-[#7a7a8a] text-xs sm:text-sm capitalize mt-1">
            <IconComponent size={16} className="text-teal-500 flex-shrink-0" />
            <span>{interview.type?.replace('-', ' ')} · {answers.length} questions</span>
          </div>
        </div>
        <button onClick={() => navigate('/interview')} className="btn-primary w-full sm:w-auto justify-center text-sm">
          <RefreshCw size={14} className="mr-1.5" /> Practice Again
        </button>
      </div>

      <div className="card p-5 sm:p-8 mb-6 flex flex-col md:flex-row items-center gap-6 md:gap-8">
        <div className="flex-shrink-0">
          <ScoreRing score={interview.averageScore || 0} size={120} stroke={8} />
        </div>
        <div className="flex-1 w-full text-center md:text-left">
          <h2 className="font-display text-lg sm:text-xl font-bold mb-2">Overall Performance</h2>
          <p className="text-[#7a7a8a] text-xs sm:text-sm mb-4 leading-relaxed">
            {interview.summary || 'Interview completed successfully.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            {interview.strongTopics?.length > 0 && (
              <div className="text-center md:text-left">
                <p className="text-[11px] text-success font-medium uppercase tracking-wider mb-1.5">Strong Topics</p>
                <div className="flex gap-1.5 flex-wrap justify-center md:justify-start">
                  {interview.strongTopics.map((t) => <span key={t} className="badge badge-green text-xs">{t}</span>)}
                </div>
              </div>
            )}
            {interview.weakTopics?.length > 0 && (
              <div className="text-center md:text-left">
                <p className="text-[11px] text-danger font-medium uppercase tracking-wider mb-1.5">Needs Work</p>
                <div className="flex gap-1.5 flex-wrap justify-center md:justify-start">
                  {interview.weakTopics.map((t) => <span key={t} className="badge badge-red text-xs">{t}</span>)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {answers.length > 0 && (
        <>
          <h3 className="text-[10px] sm:text-xs text-[#7a7a8a] uppercase tracking-wider mb-3">Per-Question Breakdown</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-6">
            {answers.map((a, i) => (
              <button key={i} onClick={() => setSelected(i)}
                className={`p-3 sm:p-4 rounded-xl text-left transition-all border ${
                  selected === i ? 'border-accent bg-accent/10' : 'border-border bg-bg-3 hover:border-border-2'
                }`}>
                <p className="text-[10px] sm:text-xs text-[#7a7a8a] mb-1">Question {i + 1}</p>
                <p className="text-xs sm:text-sm font-medium truncate">{a.questionText}</p>
                <p className="text-base sm:text-lg font-bold mt-1"
                  style={{ color: scoreColor(a.feedback?.overallScore || 0) }}>
                  {a.feedback?.overallScore ?? '—'}
                  <span className="text-xs text-[#7a7a8a] font-normal"> /10</span>
                </p>
              </button>
            ))}
          </div>

          {fb && (
            <div className="card p-4 sm:p-6 space-y-5 animate-fade-in">
              <div>
                <p className="text-[10px] sm:text-xs text-[#7a7a8a] mb-1">Question {selected + 1}</p>
                <p className="font-medium text-xs sm:text-sm leading-relaxed text-[#e0e0e6]">{answers[selected].questionText}</p>
              </div>

              <div className="bg-bg-4 rounded-xl p-4">
                <p className="text-[10px] sm:text-xs text-[#7a7a8a] mb-1.5">Your Answer</p>
                <p className="text-xs sm:text-sm text-[#c0c0cc] leading-relaxed whitespace-pre-wrap">
                  {answers[selected].answerText || '(no answer recorded)'}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {['correctness', 'clarity', 'depth', 'communication'].map((k) => (
                  <div key={k} className="bg-bg-4 rounded-xl p-3 text-center border border-border/40">
                    <p className="text-[10px] sm:text-xs text-[#7a7a8a] capitalize mb-1 sm:mb-2">{k}</p>
                    <p className="font-display text-lg sm:text-xl font-bold" style={{ color: scoreColor(fb[k] || 0) }}>
                      {fb[k] ?? 0}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-success/5 border border-success/15 rounded-xl p-4">
                  <p className="text-xs text-success font-medium mb-2.5 flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> Strengths
                  </p>
                  {fb.strengths?.length > 0
                    ? fb.strengths.map((s, i) => (
                        <p key={i} className="text-xs text-[#7a7a8a] py-1.5 border-b border-white/5 last:border-0 leading-relaxed">{s}</p>
                      ))
                    : <p className="text-xs text-[#4a4a5a]">None noted</p>}
                </div>
                
                <div className="bg-danger/5 border border-danger/15 rounded-xl p-4">
                  <p className="text-xs text-danger font-medium mb-2.5 flex items-center gap-1.5">
                    <XCircle size={14} /> Weaknesses
                  </p>
                  {fb.weaknesses?.length > 0
                    ? fb.weaknesses.map((s, i) => (
                        <p key={i} className="text-xs text-[#7a7a8a] py-1.5 border-b border-white/5 last:border-0 leading-relaxed">{s}</p>
                      ))
                    : <p className="text-xs text-[#4a4a5a]">None noted</p>}
                </div>

                <div className="bg-accent/5 border border-accent/15 rounded-xl p-4">
                  <p className="text-xs text-teal-500-2 font-medium mb-2.5 flex items-center gap-1.5">
                    <Lightbulb size={14} /> Suggestions
                  </p>
                  {fb.suggestions?.length > 0
                    ? fb.suggestions.map((s, i) => (
                        <p key={i} className="text-xs text-[#7a7a8a] py-1.5 border-b border-white/5 last:border-0 leading-relaxed">{s}</p>
                      ))
                    : <p className="text-xs text-[#4a4a5a]">None</p>}
                </div>
              </div>

              {fb.aiExplanation && (
                <div className="text-xs sm:text-sm text-[#7a7a8a] bg-bg-4 rounded-xl px-4 py-3 leading-relaxed border border-border/30">
                  {fb.aiExplanation}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {answers.length === 0 && (
        <div className="card p-8 text-center flex flex-col items-center justify-center max-w-md mx-auto">
          <p className="text-[#7a7a8a] text-sm">No answers recorded for this interview</p>
          <button onClick={() => navigate('/dashboard')} className="btn-outline text-sm mt-4 w-full">
            Go to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}