import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useInterviewStore from '../store/interveiwStore.js';
import { useTimer } from '../hooks/useTimer';
import { useVoice } from '../hooks/useVoice';
import Spinner from '../components/ui/Spinner';
import Modal from '../components/ui/Modal';
import toast from 'react-hot-toast';

const MODES = [
  { type: 'dsa',           label: 'DSA Interview',   desc: 'Arrays, trees, graphs, DP',          emoji: '🧠' },
  { type: 'system-design', label: 'System Design',   desc: 'Design Twitter, Uber, WhatsApp',      emoji: '⚙️' },
  { type: 'behavioral',    label: 'Behavioral',      desc: 'STAR method, Amazon LPs, leadership', emoji: '💬' },
  { type: 'frontend',      label: 'Frontend Dev',    desc: 'React, JS, CSS, browser APIs',        emoji: '🖥️' },
  { type: 'backend',       label: 'Backend Dev',     desc: 'Node.js, databases, REST APIs',       emoji: '🔧' },
  { type: 'mixed',         label: 'Mixed Round',     desc: 'Questions across all categories',     emoji: '🎲' },
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

  // ── Route: /interview (no id) ────────────────────────
  // If no interview in store, show start screen — never show infinite spinner
  const hasActiveInterview = interview && interview.status === 'in-progress';

  // ── Route: /interview/:id ────────────────────────────
  useEffect(() => {
    if (!id) return; // handled by start screen below

    const init = async () => {
      // If store already has this interview loaded, just fetch next question
      if (interview && interview._id === id && interview.status === 'in-progress') {
        await loadQuestion();
        return;
      }
      // Otherwise load from API
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
    return (
      <div className="p-8 max-w-7xl">
        <h1 className="font-display text-2xl font-bold mb-2">AI Interview</h1>
        <p className="text-[#7a7a8a] text-sm mb-8">
          Choose your interview type and start practicing with real AI feedback
        </p>

        {/* Mode grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {MODES.map((m) => (
            <button key={m.type}
              onClick={() => setConfig(c => ({ ...c, type: m.type }))}
              className={`card p-5 text-left transition-all hover:-translate-y-0.5
                ${config.type === m.type ? 'border-accent bg-accent/5' : 'hover:border-border-2'}`}>
              <div className="text-2xl mb-3">{m.emoji}</div>
              <h3 className="font-medium text-sm mb-1">{m.label}</h3>
              <p className="text-xs text-[#7a7a8a] leading-relaxed">{m.desc}</p>
              {config.type === m.type && (
                <div className="mt-3 w-2 h-2 rounded-full bg-accent" />
              )}
            </button>
          ))}
        </div>

        {/* Config row */}
        <div className="card p-5 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#7a7a8a] mb-1.5">Number of Questions</label>
              <select className="input" value={config.totalQuestions}
                onChange={(e) => setConfig(c => ({ ...c, totalQuestions: Number(e.target.value) }))}>
                {[3, 5, 8, 10].map(n => (
                  <option key={n} value={n}>{n} questions (~{n * 4} min)</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-[#7a7a8a] mb-1.5">Answer Mode</label>
              <select className="input" value={config.mode}
                onChange={(e) => setConfig(c => ({ ...c, mode: e.target.value }))}>
                <option value="text">Text</option>
                <option value="voice">Voice (mic)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Start button */}
        <button onClick={handleStart} disabled={starting}
          className="btn-primary text-base px-8 py-3">
          {starting ? <><Spinner size="sm" /> Starting…</> : `▶ Start ${MODES.find(m => m.type === config.type)?.label}`}
        </button>

        {/* Recent sessions hint */}
        <p className="text-xs text-[#4a4a5a] mt-4">
          Your answers are scored instantly by AI with strengths, weaknesses, and improvement suggestions.
        </p>
      </div>
    );
  }

  // ── LOADING: fetching interview from API ──────────────
  if (isLoading && !currentQuestion && phase === 'question') {
    return (
      <div className="flex h-full min-h-screen items-center justify-center gap-3">
        <Spinner size="lg" />
        <span className="text-[#7a7a8a]">Loading question…</span>
      </div>
    );
  }

  if (!interview) return null;

  const answered = interview.questionsAnswered || 0;
  const total    = interview.totalQuestions    || 5;

  // ── ACTIVE INTERVIEW ──────────────────────────────────
  return (
    <div className="p-8 max-w-7xl">
      {/* Progress header */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-sm text-[#7a7a8a]">
          Question <strong className="text-white">{questionNumber}</strong> of {total}
        </span>
        <div className="flex-1 h-1.5 bg-bg-4 rounded-full overflow-hidden">
          <div className="h-full bg-accent rounded-full transition-all duration-500"
            style={{ width: `${Math.min((answered / total) * 100, 100)}%` }} />
        </div>
        <span className={`font-mono text-sm px-3 py-1 rounded-lg
          ${timer.seconds < 120 ? 'bg-danger/10 text-danger' : 'bg-bg-4 text-warn'}`}>
          {timer.formatted}
        </span>
        <button onClick={handleEndEarly} className="btn-outline text-xs py-1.5 px-3">
          End & Review
        </button>
      </div>

      {/* Question card */}
      {currentQuestion && (
        <div className="card p-6 mb-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-3 flex items-center justify-center text-xs font-bold flex-shrink-0">
              AI
            </div>
            <span className="text-xs text-[#7a7a8a] capitalize">
              AI Interviewer · {currentQuestion.type?.replace('-', ' ')}
            </span>
            {currentQuestion.difficulty && (
              <span className={`badge ${diffBadge[currentQuestion.difficulty] || 'badge-purple'} ml-auto`}>
                {currentQuestion.difficulty}
              </span>
            )}
          </div>
          <p className="text-base leading-relaxed">{currentQuestion.body}</p>
          {currentQuestion.hints?.length > 0 && (
            <details className="mt-4">
              <summary className="text-xs text-accent-2 cursor-pointer hover:text-accent select-none">
                Show hints ({currentQuestion.hints.length})
              </summary>
              <ul className="mt-2 space-y-1.5">
                {currentQuestion.hints.map((h, i) => (
                  <li key={i} className="text-xs text-[#7a7a8a] pl-3 border-l border-accent/30">{h}</li>
                ))}
              </ul>
            </details>
          )}
        </div>
      )}

      {/* No question + not loading = error state */}
      {!currentQuestion && !isLoading && phase === 'question' && (
        <div className="card p-8 text-center mb-5">
          <p className="text-[#7a7a8a] text-sm mb-4">Could not load question</p>
          <button onClick={loadQuestion} className="btn-outline text-sm">Try Again</button>
        </div>
      )}

      {/* Answer area */}
      {phase === 'question' && currentQuestion && (
        <div className="card overflow-hidden mb-4">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-bg-4">
            <span className="text-xs text-[#7a7a8a]">Your Answer</span>
            {isSupported && (
              <button onClick={listening ? stopVoice : startVoice}
                className={`ml-auto btn-ghost text-xs py-1 px-2 ${listening ? 'text-danger' : ''}`}>
                {listening ? '⏹ Stop Voice' : '🎤 Voice'}
              </button>
            )}
          </div>

          {listening && (
            <div className="flex items-center gap-3 px-4 py-2 bg-accent/5 border-b border-border">
              <div className="flex gap-0.5 h-4 items-end">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-1 bg-accent rounded-full animate-pulse"
                    style={{ height: '60%', animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
              <span className="text-xs text-accent-2">Listening…</span>
            </div>
          )}

          <textarea
            className="w-full bg-transparent p-4 text-sm text-white placeholder:text-[#4a4a5a] focus:outline-none resize-none min-h-[180px]"
            placeholder="Type your answer… cover key concepts, trade-offs, examples, and edge cases."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />

          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <span className="text-xs text-[#4a4a5a]">{answer.length} chars</span>
            <div className="flex gap-2">
              <button onClick={() => setAnswer('')} className="btn-ghost text-xs py-1 px-3">Clear</button>
              <button onClick={handleSubmit} disabled={isSubmitting || !answer.trim()}
                className="btn-primary text-xs py-2 px-5">
                {isSubmitting ? <Spinner size="sm" /> : 'Submit Answer →'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback panel */}
      {phase === 'feedback' && lastFeedback && (
        <div className="card p-6 mb-5 animate-fade-in">
          {/* Score */}
          <div className="flex items-center gap-6 mb-6">
            <div className="text-center flex-shrink-0">
              <div className="font-display text-4xl font-bold"
                style={{ color: lastFeedback.overallScore >= 8 ? '#10d98c' : lastFeedback.overallScore >= 6 ? '#f59e0b' : '#f87171' }}>
                {lastFeedback.overallScore}
                <span className="text-lg text-[#7a7a8a]">/10</span>
              </div>
              <p className="text-xs text-[#7a7a8a] mt-1">Overall</p>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-2">
              {['correctness', 'clarity', 'depth', 'communication'].map((k) => (
                <div key={k} className="bg-bg-4 rounded-lg p-3">
                  <p className="text-xs text-[#7a7a8a] capitalize mb-1.5">{k}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-bg rounded-full overflow-hidden">
                      <div className="h-full bg-accent rounded-full"
                        style={{ width: `${(lastFeedback[k] / 10) * 100}%` }} />
                    </div>
                    <span className="text-xs font-medium w-4 text-right">{lastFeedback[k]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* S / W / S */}
          <div className="grid grid-cols-3 gap-4 mb-5">
            {[
              { label: '✓ Strengths',   key: 'strengths',   cls: 'bg-success/5 border-success/20 text-success' },
              { label: '✗ Weaknesses',  key: 'weaknesses',  cls: 'bg-danger/5 border-danger/20 text-danger'   },
              { label: '→ Suggestions', key: 'suggestions', cls: 'bg-accent/5 border-accent/20 text-accent-2' },
            ].map(({ label, key, cls }) => (
              <div key={key} className={`border rounded-xl p-4 ${cls.split(' ').slice(0,2).join(' ')}`}>
                <p className={`text-xs font-medium mb-2 ${cls.split(' ')[2]}`}>{label}</p>
                {lastFeedback[key]?.length > 0
                  ? lastFeedback[key].map((s, i) => (
                      <p key={i} className="text-xs text-[#7a7a8a] py-1.5 border-b border-white/5 last:border-0">{s}</p>
                    ))
                  : <p className="text-xs text-[#4a4a5a]">None noted</p>}
              </div>
            ))}
          </div>

          {lastFeedback.aiExplanation && (
            <p className="text-sm text-[#7a7a8a] bg-bg-4 rounded-xl px-4 py-3 mb-5">
              {lastFeedback.aiExplanation}
            </p>
          )}

          <div className="flex items-center justify-between">
            <span className="text-xs text-[#4a4a5a]">{answered}/{total} answered</span>
            <button onClick={handleNext} className="btn-primary">
              {answered >= total ? '✓ Complete Interview' : 'Next Question →'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}