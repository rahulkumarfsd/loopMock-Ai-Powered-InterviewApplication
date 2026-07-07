import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { interviewService } from '../services';
import ScoreRing from '../components/ui/ScoreRing';
import { FeedbackSkeleton } from '@/components/skeletons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Brain, Shuffle, MessageSquare, Monitor, Database, Boxes,
  ArrowLeft, RefreshCw, CheckCircle2, XCircle, Lightbulb,
} from 'lucide-react';

const TYPE_ICONS = {
  dsa: Brain, 'system-design': Shuffle, behavioral: MessageSquare,
  frontend: Monitor, backend: Database, mixed: Boxes,
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

export default function Feedback() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    interviewService.getById(id)
      .then(({ data }) => setInterview(data.interview))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load interview'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <FeedbackSkeleton />;
  if (error) return (
    <div className="flex h-full min-h-[60vh] items-center justify-center flex-col gap-4 p-4 text-center">
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 max-w-md">
        <p className="text-destructive text-sm mb-4">{error}</p>
        <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>← Dashboard</Button>
      </div>
    </div>
  );
  if (!interview) return null;

  const answers = interview.answers || [];
  const fb = answers[selected]?.feedback;
  const scoreColor = (s) => s >= 8 ? 'text-emerald-500' : s >= 6 ? 'text-amber-500' : 'text-destructive';
  const IconComponent = TYPE_ICONS[interview.type] || Boxes;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mb-6 sm:mb-8">
        <div>
          <Button variant="ghost" size="sm" className="mb-2 px-0 text-muted-foreground" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={14} /> Dashboard
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Interview Review</h1>
          <div className="flex items-center gap-2 text-muted-foreground text-sm capitalize mt-1">
            <IconComponent size={16} className="text-primary flex-shrink-0" />
            <span>{interview.type?.replace('-', ' ')} · {answers.length} questions</span>
          </div>
        </div>
        <Button onClick={() => navigate('/interview')} className="w-full sm:w-auto">
          <RefreshCw size={14} /> Practice Again
        </Button>
      </div>

      {/* Overall Score */}
      <Card className="mb-6">
        <CardContent className="p-5 sm:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8">
          <div className="flex-shrink-0">
            <ScoreRing score={interview.averageScore || 0} size={120} stroke={8} />
          </div>
          <div className="flex-1 w-full text-center md:text-left">
            <h2 className="text-lg sm:text-xl font-bold mb-2">Overall Performance</h2>
            <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
              {interview.summary || 'Interview completed successfully.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              {interview.strongTopics?.length > 0 && (
                <div className="text-center md:text-left">
                  <p className="text-xs text-emerald-500 font-medium uppercase tracking-wider mb-1.5">Strong Topics</p>
                  <div className="flex gap-1.5 flex-wrap justify-center md:justify-start">
                    {interview.strongTopics.map((t) => <Badge key={t} variant="success">{t}</Badge>)}
                  </div>
                </div>
              )}
              {interview.weakTopics?.length > 0 && (
                <div className="text-center md:text-left">
                  <p className="text-xs text-destructive font-medium uppercase tracking-wider mb-1.5">Needs Work</p>
                  <div className="flex gap-1.5 flex-wrap justify-center md:justify-start">
                    {interview.weakTopics.map((t) => <Badge key={t} variant="destructive">{t}</Badge>)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {answers.length > 0 && (
        <>
          <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Per-Question Breakdown</h3>
          <motion.div variants={container} initial="hidden" animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-6">
            {answers.map((a, i) => (
              <motion.div key={i} variants={item}>
                <Card
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selected === i ? 'border-primary bg-primary/5 shadow-md' : 'hover:border-primary/30'
                  }`}
                  onClick={() => setSelected(i)}
                >
                  <CardContent className="p-3 sm:p-4">
                    <p className="text-xs text-muted-foreground mb-1">Question {i + 1}</p>
                    <p className="text-sm font-medium truncate">{a.questionText}</p>
                    <p className={`text-lg font-bold mt-1 ${scoreColor(a.feedback?.overallScore || 0)}`}>
                      {a.feedback?.overallScore ?? '—'}
                      <span className="text-xs text-muted-foreground font-normal"> /10</span>
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {fb && (
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <Card className="mb-6">
                <CardContent className="p-4 sm:p-6 space-y-5">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Question {selected + 1}</p>
                    <p className="font-medium text-sm leading-relaxed">{answers[selected].questionText}</p>
                  </div>

                  <div className="bg-muted rounded-xl p-4">
                    <p className="text-xs text-muted-foreground mb-1.5">Your Answer</p>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {answers[selected].answerText || '(no answer recorded)'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                    {['correctness', 'clarity', 'depth', 'communication'].map((k) => (
                      <Card key={k} className="border-border/40">
                        <CardContent className="p-3 text-center">
                          <p className="text-xs text-muted-foreground capitalize mb-1">{k}</p>
                          <p className={`text-xl font-bold ${scoreColor(fb[k] || 0)}`}>{fb[k] ?? 0}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { label: 'Strengths', key: 'strengths', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/5 border-emerald-500/15' },
                      { label: 'Weaknesses', key: 'weaknesses', icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/5 border-destructive/15' },
                      { label: 'Suggestions', key: 'suggestions', icon: Lightbulb, color: 'text-primary', bg: 'bg-primary/5 border-primary/15' },
                    ].map(({ label, key, icon: Icon, color, bg }) => (
                      <div key={key} className={`border rounded-xl p-4 ${bg}`}>
                        <p className={`text-xs font-semibold mb-2.5 flex items-center gap-1.5 ${color}`}>
                          <Icon size={14} /> {label}
                        </p>
                        {fb[key]?.length > 0
                          ? fb[key].map((s, i) => (
                              <p key={i} className="text-xs text-muted-foreground py-1.5 border-b border-border/20 last:border-0 leading-relaxed">{s}</p>
                            ))
                          : <p className="text-xs text-muted-foreground">None noted</p>}
                      </div>
                    ))}
                  </div>

                  {fb.aiExplanation && (
                    <div className="text-sm text-muted-foreground bg-muted rounded-xl px-4 py-3 leading-relaxed border border-border/30">
                      {fb.aiExplanation}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </>
      )}

      {answers.length === 0 && (
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground text-sm mb-4">No answers recorded for this interview</p>
            <Button variant="outline" onClick={() => navigate('/dashboard')} className="w-full">Go to Dashboard</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}