import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useInterviewStore from '../store/interveiwStore.js';
import { useTimer } from '../hooks/useTimer';
import { useVoice } from '../hooks/useVoice';
import Spinner from '../components/ui/Spinner';
import Modal from '../components/ui/Modal';
import toast from 'react-hot-toast';
import {
  Brain,
  Shuffle,
  MessageSquare,
  Monitor,
  Database,
  Boxes,
  Mic,
  MicOff,
  Sparkles,
  Clock,
  Flag,
  Play,
  CheckCircle2,
  XCircle,
  Lightbulb,
} from 'lucide-react';

const MODES = [
  { type: 'dsa',           label: 'DSA Interview',   desc: 'Arrays, trees, graphs, DP',           icon: Brain },
  { type: 'system-design', label: 'System Design',  desc: 'Design Twitter, Uber, WhatsApp',      icon: Shuffle },
  { type: 'behavioral',    label: 'Behavioral',      desc: 'STAR method, Amazon LPs, leadership', icon: MessageSquare },
  { type: 'frontend',      label: 'Frontend Dev',    desc: 'React, JS, CSS, browser APIs',        icon: Monitor },
  { type: 'backend',       label: 'Backend Dev',     desc: 'Node.js, databases, REST APIs',       icon: Database },
  { type: 'mixed',         label: 'Mixed Round',     desc: 'Questions across all categories',     icon: Boxes },
];

export default function Interview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    interview, currentQuestion, questionNumber, lastFeedback,
    isLoading, isSubmitting,
    startInterview, loadInterview, fetchNextQuestion,
    submitAnswer, completeInterview, reset,
  } = useInterviewStore();

  const [answer,   setAnswer]   = useState('');
  const [phase,    setPhase]    = useState('question'); // question | feedback
  const [config,   setConfig]   = useState({ type: 'dsa', totalQuestions: 5, mode: 'text' });
  const [starting, setStarting] = useState(false);

  const timer     = useTimer(600);
  const startTime = useRef(Date.now());
  const { listening, transcript, start: startVoice, stop: stopVoice, isSupported } = useVoice((t) => setAnswer(t));

  const hasActiveInterview = interview && interview.status === 'in-progress';

  useEffect(() => {
    if (!id) return;

    const init = async () => {
      if (interview && interview._id === id && interview.status === 'in-progress') {
        await loadQuestion();
        return;
      }
      const iv = await loadInterview(id);
      if (!iv) { navigate('/interview', { replace: true }); return; }
      if (iv.status === 'completed') { navigate(`/feedback/${iv._id}`, { replace: true }); return; }
      await loadQuestion();
    };

    init();
  }, [id]);

  const loadQuestion = async () => {
    const q = await fetchNextQuestion();
    if (q) {
      setAnswer('');
      setPhase('question');
      timer.reset();
      timer.start();
      startTime.current = Date.now();
    }
  };

  const handleStart = async () => {
    setStarting(true);
    const iv = await startInterview(config);
    setStarting(false);
    if (iv) navigate(`/interview/${iv._id}`);
  };

  const handleSubmit = async () => {
    if (!answer.trim()) return toast.error('Write an answer first');
    stopVoice();
    timer.pause();
    const timeTaken = Math.floor((Date.now() - startTime.current) / 1000);
    const result = await submitAnswer({
      answerText: answer,
      answerType: listening ? 'voice' : 'text',
      timeTaken,
    });
    if (result) setPhase('feedback');
  };

  const handleNext = async () => {
    const answered = interview?.questionsAnswered || 0;
    const total    = interview?.totalQuestions    || 5;
    if (answered >= total) {
      const done = await completeInterview();
      if (done) navigate(`/feedback/${done._id}`);
    } else {
      setPhase('question');
      await loadQuestion();
    }
  };

  const handleEndEarly = async () => {
    const done = await completeInterview();
    if (done) navigate(`/feedback/${done._id}`);
  };

  const diffBadge = { easy: 'badge-green', medium: 'badge-amber', hard: 'badge-red' };

  // ── START SCREEN (no interview active) ───────────────
  if (!id || (!hasActiveInterview && !isLoading)) {
    const ActiveModeIcon = MODES.find(m => m.type === config.type)?.icon || Brain;
    
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <div className='mt-12 sm:mt-0'>
          <h1 className="font-display text-xl sm:text-2xl font-bold mb-1">AI Interview Simulator</h1>
        <p className="text-[#7a7a8a] text-xs sm:text-sm mb-6 sm:mb-8">
          Choose your interview type and start practicing with real AI feedback loops
        </p>
        </div>
        {/* Mode grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 sm:mb-8">
          {MODES.map((m) => {
            const ModeIcon = m.icon;
            return (
              <button key={m.type}
                onClick={() => setConfig(c => ({ ...c, type: m.type }))}
                className={`card p-4 sm:p-5 text-left transition-all relative
                  ${config.type === m.type ? 'border-accent bg-accent/5 ring-1 ring-accent/30' : 'hover:border-border-2'}`}>
                <div className={`w-10 h-10 rounded-xl bg-bg-4 flex items-center justify-center mb-3 ${config.type === m.type ? 'text-accent' : 'text-[#7a7a8a]'}`}>
                  <ModeIcon size={20} />
                </div>
                <h3 className="font-medium text-sm mb-1">{m.label}</h3>
                <p className="text-xs text-[#7a7a8a] leading-relaxed line-clamp-2">{m.desc}</p>
                {config.type === m.type && (
                  <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-accent" />
                )}
              </button>
            );
          })}
        </div>

        {/* Config row */}
        <div className="card p-4 sm:p-5 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#7a7a8a] mb-1.5">Number of Questions</label>
              <select className="input w-full text-sm" value={config.totalQuestions}
                onChange={(e) => setConfig(c => ({ ...c, totalQuestions: Number(e.target.value) }))}>
                {[3, 5, 8, 10].map(n => (
                  <option key={n} value={n}>{n} questions (~{n * 4} min)</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-[#7a7a8a] mb-1.5">Answer Mode</label>
              <select className="input w-full text-sm" value={config.mode}
                onChange={(e) => setConfig(c => ({ ...c, mode: e.target.value }))}>
                <option value="text">Text Entry</option>
                <option value="voice">Voice Interaction (Mic)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Start button */}
        <button onClick={handleStart} disabled={starting}
          className="btn-primary text-sm sm:text-base px-6 sm:px-8 py-2.5 sm:py-3 w-full sm:w-auto justify-center">
          {starting ? (
            <div className="flex items-center gap-2"><Spinner size="sm" /> Starting Session…</div>
          ) : (
            <div className="flex items-center gap-2"><Play size={16} /> Start {MODES.find(m => m.type === config.type)?.label}</div>
          )}
        </button>

        <p className="text-xs text-[#4a4a5a] mt-4 max-w-xl leading-relaxed">
          Your answers are scored instantly by automated models tracking core clarity metrics, structural accuracy, and communication.
        </p>
      </div>
    );
  }

  // ── LOADING: fetching interview question ──────────────
  if (isLoading && !currentQuestion && phase === 'question') {
    return (
      <div className="flex h-full min-h-screen items-center justify-center gap-3 p-4">
        <Spinner size="lg" />
        <span className="text-[#7a7a8a] text-sm font-medium">Assembling next question context…</span>
      </div>
    );
  }

  if (!interview) return null;

  const answered = interview.questionsAnswered || 0;
  const total    = interview.totalQuestions    || 5;

  // ── ACTIVE INTERVIEW ──────────────────────────────────
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-4 sm:space-y-6">
      {/* Progress header container */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 sm:gap-4 bg-bg-3 p-3 sm:p-4 rounded-2xl border border-border/40">
        <span className="text-xs sm:text-sm text-[#7a7a8a] flex-shrink-0">
          Question <strong className="text-white">{questionNumber}</strong> of {total}
        </span>
        <div className="flex-1 h-2 bg-bg-4 rounded-full overflow-hidden min-w-[120px]">
          <div className="h-full bg-accent rounded-full transition-all duration-500"
            style={{ width: `${Math.min((answered / total) * 100, 100)}%` }} />
        </div>
        <div className="flex items-center justify-between md:justify-end gap-3 flex-shrink-0">
          <span className={`font-mono text-xs sm:text-sm px-3 py-1 rounded-xl flex items-center gap-1.5
            ${timer.seconds < 120 ? 'bg-danger/10 text-danger' : 'bg-bg-4 text-warn'}`}>
            <Clock size={14} /> {timer.formatted}
          </span>
          <button onClick={handleEndEarly} className="btn-outline text-xs py-1.5 px-3 flex items-center gap-1.5">
            <Flag size={13} /> End early
          </button>
        </div>
      </div>

      {/* Question panel block */}
      {currentQuestion && (
        <div className="card p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-3 flex items-center justify-center text-xs font-bold flex-shrink-0 text-white">
              AI
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-[#e0e0e6]">AI Interview Panel</span>
              <span className="text-[10px] text-[#7a7a8a] capitalize mt-0.5">{currentQuestion.type?.replace('-', ' ')}</span>
            </div>
            {currentQuestion.difficulty && (
              <span className={`badge ${diffBadge[currentQuestion.difficulty] || 'badge-purple'} ml-auto text-[10px] sm:text-xs`}>
                {currentQuestion.difficulty}
              </span>
            )}
          </div>
          <p className="text-sm sm:text-base leading-relaxed text-[#e0e0e6]">{currentQuestion.body}</p>
          
          {currentQuestion.hints?.length > 0 && (
            <details className="mt-4 group">
              <summary className="text-xs text-accent-2 cursor-pointer hover:text-accent select-none font-medium flex items-center gap-1">
                Show available prompt hints ({currentQuestion.hints.length})
              </summary>
              <ul className="mt-2.5 space-y-2 pl-1">
                {currentQuestion.hints.map((h, i) => (
                  <li key={i} className="text-xs text-[#7a7a8a] pl-3 border-l border-accent/40 leading-relaxed">{h}</li>
                ))}
              </ul>
            </details>
          )}
        </div>
      )}

      {/* Fetching error fallback element layout */}
      {!currentQuestion && !isLoading && phase === 'question' && (
        <div className="card p-8 text-center max-w-sm mx-auto">
          <p className="text-[#7a7a8a] text-sm mb-4">Failed to fetch prompt generation context</p>
          <button onClick={loadQuestion} className="btn-outline text-sm w-full justify-center">Try Reconnecting</button>
        </div>
      )}

      {/* Answer box implementation panel */}
      {phase === 'question' && currentQuestion && (
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg-4">
            <span className="text-xs font-medium text-[#7a7a8a]">Your Workspace</span>
            {isSupported && (
              <button onClick={listening ? stopVoice : startVoice}
                className={`btn-ghost text-xs py-1 px-2.5 flex items-center gap-1.5 rounded-lg transition-colors
                  ${listening ? 'text-danger bg-danger/10 hover:bg-danger/20' : 'text-accent bg-accent/10 hover:bg-accent/20'}`}>
                {listening ? <><MicOff size={13} /> Stop Voice</> : <><Mic size={13} /> Voice capture</>}
              </button>
            )}
          </div>

          {listening && (
            <div className="flex items-center gap-3 px-4 py-2 bg-accent/5 border-b border-border">
              <div className="flex gap-0.5 h-3 items-end mb-0.5">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-0.5 bg-accent rounded-full animate-pulse"
                    style={{ height: '70%', animationDelay: `${i * 0.12}s` }} />
                ))}
              </div>
              <span className="text-[11px] font-medium text-accent-2 animate-pulse">Streaming raw audio stream pipeline…</span>
            </div>
          )}

          <textarea
            className="w-full bg-transparent p-4 text-xs sm:text-sm text-white placeholder:text-[#4a4a5a] focus:outline-none resize-none min-h-[160px] sm:min-h-[200px] leading-relaxed"
            placeholder="Type your explanation architecture block structure here... Include tradeoffs, core runtime dependencies, and alternative edge-case models."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />

          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-bg-3/50">
            <span className="text-[11px] font-mono text-[#4a4a5a]">{answer.length} tokens used</span>
            <div className="flex gap-2">
              <button onClick={() => setAnswer('')} className="btn-ghost text-xs py-1.5 px-3">Reset</button>
              <button onClick={handleSubmit} disabled={isSubmitting || !answer.trim()}
                className="btn-primary text-xs py-1.5 sm:py-2 px-4 sm:px-5">
                {isSubmitting ? <Spinner size="sm" /> : 'Commit Answer '}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Multi-layered dynamic Evaluation panel block */}
      {phase === 'feedback' && lastFeedback && (
        <div className="card p-4 sm:p-6 space-y-6 animate-fade-in">
          {/* Main Score row */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 pb-6 border-b border-border/40">
            <div className="text-center bg-bg-4 p-4 rounded-2xl border border-border/60 min-w-[110px] w-full lg:w-auto">
              <div className="font-display text-3xl sm:text-4xl font-bold"
                style={{ color: lastFeedback.overallScore >= 8 ? '#10d98c' : lastFeedback.overallScore >= 6 ? '#f59e0b' : '#f87171' }}>
                {lastFeedback.overallScore}
                <span className="text-base sm:text-lg text-[#7a7a8a] font-normal">/10</span>
              </div>
              <p className="text-[10px] uppercase font-semibold text-[#7a7a8a] tracking-wider mt-1">Overall</p>
            </div>
            
            <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
              {['correctness', 'clarity', 'depth', 'communication'].map((k) => (
                <div key={k} className="bg-bg-4 rounded-xl p-3 border border-border/30">
                  <div className="flex justify-between items-center mb-1.5">
                    <p className="text-xs text-[#7a7a8a] capitalize font-medium">{k}</p>
                    <span className="text-xs font-bold text-[#e0e0e6]">{lastFeedback[k]}<span className="text-[10px] text-[#5a5a6a] font-normal">/10</span></span>
                  </div>
                  <div className="h-1.5 bg-bg rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full"
                      style={{ width: `${(lastFeedback[k] / 10) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* S / W / S dynamic flex container columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Strengths',   key: 'strengths',   textCls: 'text-success', bgCls: 'bg-success/5 border-success/15', icon: CheckCircle2 },
              { label: 'Weaknesses',  key: 'weaknesses',  textCls: 'text-danger',  bgCls: 'bg-danger/5 border-danger/15',   icon: XCircle },
              { label: 'Suggestions', key: 'suggestions', textCls: 'text-accent-2',bgCls: 'bg-accent/5 border-accent/15',   icon: Lightbulb },
            ].map(({ label, key, textCls, bgCls, icon: TargetIcon }) => (
              <div key={key} className={`border rounded-xl p-4 flex flex-col ${bgCls}`}>
                <p className={`text-xs font-semibold mb-2.5 flex items-center gap-1.5 ${textCls}`}>
                  <TargetIcon size={14} /> {label}
                </p>
                <div className="space-y-2 flex-1">
                  {lastFeedback[key]?.length > 0 ? (
                    lastFeedback[key].map((s, i) => (
                      <p key={i} className="text-xs text-[#7a7a8a] py-1 border-b border-white/5 last:border-0 leading-relaxed">{s}</p>
                    ))
                  ) : (
                    <p className="text-xs text-[#4a4a5a] italic">No parameters captured</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {lastFeedback.aiExplanation && (
            <div className="text-xs sm:text-sm text-[#7a7a8a] bg-bg-4 rounded-xl px-4 py-3 leading-relaxed border border-border/40 flex items-start gap-2">
              <Sparkles size={16} className="text-accent mt-0.5 flex-shrink-0" />
              <span>{lastFeedback.aiExplanation}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-border/40">
            <span className="text-xs font-medium text-[#4a4a5a] text-center sm:text-left">{answered} / {total} pipeline frames completed</span>
            <button onClick={handleNext} className="btn-primary w-full sm:w-auto justify-center text-sm">
              {answered >= total ? '✓ Complete Evaluation' : 'Next Question '}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}