import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useInterviewStore from '../store/interveiwStore.js';
import { useTimer } from '../hooks/useTimer';
import { useVoice } from '../hooks/useVoice';
import { toast } from 'sonner';
import { InterviewSkeleton } from '@/components/skeletons';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Brain, Shuffle, MessageSquare, Monitor, Database, Boxes,
  Mic, MicOff, Sparkles, Clock, Flag, Play, Loader2,
  CheckCircle2, XCircle, Lightbulb,
} from 'lucide-react';

const MODES = [
  { type: 'dsa',           label: 'DSA Interview',  desc: 'Arrays, trees, graphs, DP',            icon: Brain },
  { type: 'system-design', label: 'System Design',  desc: 'Design Twitter, Uber, WhatsApp',       icon: Shuffle },
  { type: 'behavioral',    label: 'Behavioral',     desc: 'STAR method, Amazon LPs, leadership',  icon: MessageSquare },
  { type: 'frontend',      label: 'Frontend Dev',   desc: 'React, JS, CSS, browser APIs',         icon: Monitor },
  { type: 'backend',       label: 'Backend Dev',    desc: 'Node.js, databases, REST APIs',        icon: Database },
  { type: 'mixed',         label: 'Mixed Round',    desc: 'Questions across all categories',      icon: Boxes },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

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
  const [phase,    setPhase]    = useState('question');
  const [config,   setConfig]   = useState({ type: 'dsa', totalQuestions: '5', mode: 'text' });
  const [starting, setStarting] = useState(false);

  const timer     = useTimer(600);
  const startTime = useRef(Date.now());
  const { listening, transcript, start: startVoice, stop: stopVoice, isSupported } = useVoice((t) => setAnswer(t));

  const hasActiveInterview = interview && interview.status === 'in-progress';

  useEffect(() => {
    if (!id) return;
    const init = async () => {
      if (interview && interview._id === id && interview.status === 'in-progress') {
        await loadQuestion(); return;
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
    if (q) { setAnswer(''); setPhase('question'); timer.reset(); timer.start(); startTime.current = Date.now(); }
  };

  const handleStart = async () => {
    setStarting(true);
    const iv = await startInterview({ ...config, totalQuestions: Number(config.totalQuestions) });
    setStarting(false);
    if (iv) navigate(`/interview/${iv._id}`);
  };

  const handleSubmit = async () => {
    if (!answer.trim()) return toast.error('Write an answer first');
    stopVoice(); timer.pause();
    const timeTaken = Math.floor((Date.now() - startTime.current) / 1000);
    const result = await submitAnswer({ answerText: answer, answerType: listening ? 'voice' : 'text', timeTaken });
    if (result) setPhase('feedback');
  };

  const handleNext = async () => {
    const answered = interview?.questionsAnswered || 0;
    const total = interview?.totalQuestions || 5;
    if (answered >= total) {
      const done = await completeInterview();
      if (done) navigate(`/feedback/${done._id}`);
    } else { setPhase('question'); await loadQuestion(); }
  };

  const handleEndEarly = async () => {
    const done = await completeInterview();
    if (done) navigate(`/feedback/${done._id}`);
  };

  const scoreColor = (s) => s >= 8 ? 'text-emerald-500' : s >= 6 ? 'text-amber-500' : 'text-destructive';
  const diffVariant = { easy: 'success', medium: 'warning', hard: 'destructive' };

  // ─── SETUP SCREEN ───────────────────────────────
  if (!id || (!hasActiveInterview && !isLoading)) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-1">AI Interview Simulator</h1>
          <p className="text-muted-foreground text-sm">
            Choose your interview type and start practicing with real AI feedback loops
          </p>
        </div>

        <motion.div variants={container} initial="hidden" animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 sm:mb-8">
          {MODES.map((m) => (
            <motion.div key={m.type} variants={item}>
              <Card
                className={`cursor-pointer transition-all relative hover:shadow-md ${
                  config.type === m.type ? 'border-primary bg-primary/5 shadow-md' : 'hover:border-primary/30'
                }`}
                onClick={() => setConfig(c => ({ ...c, type: m.type }))}
              >
                <CardContent className="p-4 sm:p-5">
                  <div className={`w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-3 ${
                    config.type === m.type ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    <m.icon size={20} />
                  </div>
                  <h3 className="font-medium text-sm mb-1">{m.label}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{m.desc}</p>
                  {config.type === m.type && (
                    <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary" />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <Card className="mb-6">
          <CardContent className="p-4 sm:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Number of Questions</Label>
                <Select value={config.totalQuestions} onValueChange={(v) => setConfig(c => ({ ...c, totalQuestions: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[3, 5, 8, 10].map(n => (
                      <SelectItem key={n} value={String(n)}>{n} questions (~{n * 4} min)</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Answer Mode</Label>
                <Select value={config.mode} onValueChange={(v) => setConfig(c => ({ ...c, mode: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text Entry</SelectItem>
                    <SelectItem value="voice">Voice Interaction (Mic)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleStart} disabled={starting} className="w-full sm:w-auto">
          {starting ? <><Loader2 size={16} className="animate-spin" /> Starting Session…</> : <><Play size={16} /> Start {MODES.find(m => m.type === config.type)?.label}</>}
        </Button>

        <p className="text-xs text-muted-foreground mt-4 max-w-xl leading-relaxed">
          Your answers are scored instantly by automated models tracking core clarity metrics, structural accuracy, and communication.
        </p>
      </div>
    );
  }

  // ─── LOADING STATE ──────────────────────────────
  if (isLoading && !currentQuestion && phase === 'question') {
    return (
      <div className="flex h-full min-h-[60vh] items-center justify-center gap-3 p-4">
        <Loader2 size={24} className="animate-spin text-primary" />
        <span className="text-muted-foreground text-sm font-medium">Assembling next question context…</span>
      </div>
    );
  }

  if (!interview) return null;

  const answered = interview.questionsAnswered || 0;
  const total = interview.totalQuestions || 5;

  // ─── ACTIVE INTERVIEW ──────────────────────────
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-4 sm:space-y-6">
      {/* Progress Bar */}
      <Card>
        <CardContent className="p-3 sm:p-4 flex flex-col md:flex-row md:items-center gap-3">
          <span className="text-xs sm:text-sm text-muted-foreground flex-shrink-0">
            Question <strong className="text-foreground">{questionNumber}</strong> of {total}
          </span>
          <div className="flex-1 min-w-[120px]">
            <Progress value={Math.min((answered / total) * 100, 100)} className="h-2" />
          </div>
          <div className="flex items-center justify-between md:justify-end gap-3 flex-shrink-0">
            <Badge variant={timer.seconds < 120 ? 'destructive' : 'secondary'} className="font-mono text-xs gap-1.5">
              <Clock size={12} /> {timer.formatted}
            </Badge>
            <Button variant="outline" size="sm" onClick={handleEndEarly} className="h-7 text-xs gap-1.5">
              <Flag size={12} /> End early
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Question */}
      {currentQuestion && (
        <Card>
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                AI
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-foreground">AI Interview Panel</span>
                <span className="text-[10px] text-muted-foreground capitalize mt-0.5">{currentQuestion.type?.replace('-', ' ')}</span>
              </div>
              {currentQuestion.difficulty && (
                <Badge variant={diffVariant[currentQuestion.difficulty] || 'secondary'} className="ml-auto text-[10px]">
                  {currentQuestion.difficulty}
                </Badge>
              )}
            </div>
            <p className="text-sm sm:text-base leading-relaxed text-foreground">{currentQuestion.body}</p>

            {currentQuestion.hints?.length > 0 && (
              <details className="mt-4 group">
                <summary className="text-xs text-primary cursor-pointer hover:text-primary/80 select-none font-medium flex items-center gap-1">
                  Show available prompt hints ({currentQuestion.hints.length})
                </summary>
                <ul className="mt-2.5 space-y-2 pl-1">
                  {currentQuestion.hints.map((h, i) => (
                    <li key={i} className="text-xs text-muted-foreground pl-3 border-l-2 border-primary/40 leading-relaxed">{h}</li>
                  ))}
                </ul>
              </details>
            )}
          </CardContent>
        </Card>
      )}

      {/* Error state */}
      {!currentQuestion && !isLoading && phase === 'question' && (
        <Card className="max-w-sm mx-auto">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground text-sm mb-4">Failed to fetch prompt generation context</p>
            <Button variant="outline" onClick={loadQuestion} className="w-full">Try Reconnecting</Button>
          </CardContent>
        </Card>
      )}

      {/* Answer Area */}
      {phase === 'question' && currentQuestion && (
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/50">
            <span className="text-xs font-medium text-muted-foreground">Your Workspace</span>
            {isSupported && (
              <Button
                variant="ghost"
                size="sm"
                className={`h-7 text-xs gap-1.5 ${listening ? 'text-destructive bg-destructive/10 hover:bg-destructive/20' : 'text-primary bg-primary/10 hover:bg-primary/20'}`}
                onClick={listening ? stopVoice : startVoice}
              >
                {listening ? <><MicOff size={13} /> Stop Voice</> : <><Mic size={13} /> Voice capture</>}
              </Button>
            )}
          </div>

          {listening && (
            <div className="flex items-center gap-3 px-4 py-2 bg-primary/5 border-b border-border">
              <div className="flex gap-0.5 h-3 items-end">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-0.5 bg-primary rounded-full animate-pulse" style={{ height: '70%', animationDelay: `${i * 0.12}s` }} />
                ))}
              </div>
              <span className="text-[11px] font-medium text-primary animate-pulse">Streaming raw audio stream pipeline…</span>
            </div>
          )}

          <Textarea
            className="w-full bg-transparent border-0 rounded-none shadow-none focus-visible:ring-0 p-4 text-sm placeholder:text-muted-foreground resize-none min-h-[160px] sm:min-h-[200px] leading-relaxed"
            placeholder="Type your explanation architecture block structure here... Include tradeoffs, core runtime dependencies, and alternative edge-case models."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />

          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/30">
            <span className="text-[11px] font-mono text-muted-foreground">{answer.length} tokens used</span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setAnswer('')} className="h-8 text-xs">Reset</Button>
              <Button size="sm" onClick={handleSubmit} disabled={isSubmitting || !answer.trim()} className="h-8 text-xs">
                {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : 'Commit Answer'}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Feedback */}
      {phase === 'feedback' && lastFeedback && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card>
            <CardContent className="p-4 sm:p-6 space-y-6">
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 pb-6 border-b border-border/40">
                <div className="text-center bg-muted p-4 rounded-2xl border border-border/60 min-w-[110px] w-full lg:w-auto">
                  <div className={`text-3xl sm:text-4xl font-bold ${scoreColor(lastFeedback.overallScore)}`}>
                    {lastFeedback.overallScore}
                    <span className="text-base sm:text-lg text-muted-foreground font-normal">/10</span>
                  </div>
                  <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider mt-1">Overall</p>
                </div>

                <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {['correctness', 'clarity', 'depth', 'communication'].map((k) => (
                    <Card key={k} className="border-border/40">
                      <CardContent className="p-3">
                        <div className="flex justify-between items-center mb-1.5">
                          <p className="text-xs text-muted-foreground capitalize font-medium">{k}</p>
                          <span className={`text-xs font-bold ${scoreColor(lastFeedback[k] || 0)}`}>
                            {lastFeedback[k]}<span className="text-[10px] text-muted-foreground font-normal">/10</span>
                          </span>
                        </div>
                        <Progress value={((lastFeedback[k] || 0) / 10) * 100} className="h-1.5" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Strengths',   key: 'strengths',   icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/5 border-emerald-500/15' },
                  { label: 'Weaknesses',  key: 'weaknesses',  icon: XCircle,      color: 'text-destructive', bg: 'bg-destructive/5 border-destructive/15' },
                  { label: 'Suggestions', key: 'suggestions', icon: Lightbulb,    color: 'text-primary',     bg: 'bg-primary/5 border-primary/15' },
                ].map(({ label, key, icon: Icon, color, bg }) => (
                  <div key={key} className={`border rounded-xl p-4 flex flex-col ${bg}`}>
                    <p className={`text-xs font-semibold mb-2.5 flex items-center gap-1.5 ${color}`}>
                      <Icon size={14} /> {label}
                    </p>
                    <div className="space-y-2 flex-1">
                      {lastFeedback[key]?.length > 0
                        ? lastFeedback[key].map((s, i) => (
                            <p key={i} className="text-xs text-muted-foreground py-1 border-b border-border/20 last:border-0 leading-relaxed">{s}</p>
                          ))
                        : <p className="text-xs text-muted-foreground italic">No parameters captured</p>}
                    </div>
                  </div>
                ))}
              </div>

              {lastFeedback.aiExplanation && (
                <div className="text-xs sm:text-sm text-muted-foreground bg-muted rounded-xl px-4 py-3 leading-relaxed border border-border/40 flex items-start gap-2">
                  <Sparkles size={16} className="text-primary mt-0.5 flex-shrink-0" />
                  <span>{lastFeedback.aiExplanation}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-border/40">
                <span className="text-xs font-medium text-muted-foreground text-center sm:text-left">
                  {answered} / {total} pipeline frames completed
                </span>
                <Button onClick={handleNext} className="w-full sm:w-auto">
                  {answered >= total ? '✓ Complete Evaluation' : 'Next Question →'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}