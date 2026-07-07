import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthStore from '../store/authStore';
import useInterviewStore from '../store/interveiwStore.js';
import { analyticsService, interviewService } from '../services';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { DashboardSkeleton } from '@/components/skeletons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Brain, Boxes, MessageSquare, Monitor, Database, Shuffle,
  Calendar, Layers, Play, TrendingUp, Flame, HelpCircle, Target, Loader2,
} from 'lucide-react';

const MODES = [
  { type: 'dsa',          label: 'DSA Interview',  desc: 'Arrays, trees, graphs, dynamic programming', icon: Brain },
  { type: 'system-design', label: 'System Design',  desc: 'Design Twitter, Uber, WhatsApp at scale',     icon: Shuffle },
  { type: 'behavioral',    label: 'Behavioral',     desc: 'STAR method, leadership, conflict resolution',icon: MessageSquare },
  { type: 'frontend',      label: 'Frontend Dev',   desc: 'React, JS, CSS, browser APIs',               icon: Monitor },
  { type: 'backend',       label: 'Backend Dev',    desc: 'Node.js, databases, REST, system design',    icon: Database },
  { type: 'mixed',         label: 'Mixed Round',    desc: 'Random questions across all categories',      icon: Boxes },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { startInterview, reset } = useInterviewStore();

  const [overview, setOverview] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [config, setConfig] = useState({ totalQuestions: '5', mode: 'text' });
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState(null);

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
      const interview = await startInterview({
        type: modal.type,
        totalQuestions: Number(config.totalQuestions),
        mode: config.mode,
      });
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

  const scoreVariant = (s) => s >= 8 ? 'success' : s >= 6 ? 'warning' : 'destructive';

  if (loading) return <DashboardSkeleton />;

  if (error) return (
    <div className="flex h-full min-h-[60vh] items-center justify-center flex-col gap-4 p-4 text-center">
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 max-w-md">
        <p className="text-destructive text-sm mb-4">Failed to load dashboard: {error}</p>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    </div>
  );

  const stats = overview?.stats || {};

  const STAT_CARDS = [
    { label: 'Interviews Done', value: stats.totalInterviews || 0, icon: Target, color: 'text-primary' },
    { label: 'Avg Score', value: `${stats.averageScore || 0}/10`, icon: TrendingUp, color: 'text-emerald-500' },
    { label: 'Streak', value: `${stats.streak || 0} days`, icon: Flame, color: 'text-amber-500' },
    { label: 'Questions Done', value: stats.totalQuestions || 0, icon: HelpCircle, color: 'text-sky-500' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
            {user?.name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Ready for your next practice session?</p>
        </div>
        <Button onClick={() => setModal(MODES[0])} className="w-full sm:w-auto">
          <Play size={16} /> Start Interview
        </Button>
      </div>

      {/* Stats */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8"
      >
        {STAT_CARDS.map((s) => (
          <motion.div key={s.label} variants={item}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</p>
                  <s.icon size={16} className={s.color} />
                </div>
                <p className={`text-xl sm:text-2xl font-bold ${s.color}`}>{s.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Interview Modes */}
      <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 sm:mb-4">
        Choose Interview Mode
      </h2>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 sm:mb-8"
      >
        {MODES.map((m) => (
          <motion.div key={m.type} variants={item}>
            <Card
              className="cursor-pointer hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 transition-all group"
              onClick={() => setModal(m)}
            >
              <CardContent className="p-4 sm:p-5">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/15 transition-colors">
                  <m.icon size={20} className="text-primary" />
                </div>
                <h3 className="font-medium text-sm mb-1">{m.label}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{m.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Sessions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Recent Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Calendar size={32} className="text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">No interviews yet — start one above!</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {history.map((iv) => {
                  const MatchedIcon = MODES.find((m) => m.type === iv.type)?.icon || Layers;
                  return (
                    <div
                      key={iv._id}
                      className="flex items-center gap-3 py-3 cursor-pointer hover:bg-accent/50 rounded-lg px-2 -mx-2 transition-colors"
                      onClick={() => navigate(`/feedback/${iv._id}`)}
                    >
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <MatchedIcon size={18} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium capitalize truncate">{iv.type?.replace('-', ' ')} Interview</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {iv.questionsAnswered} questions · {new Date(iv.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={scoreVariant(iv.averageScore)} className="flex-shrink-0">
                        {iv.averageScore?.toFixed(1) || '—'}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Skill Radar */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Skill Radar</CardTitle>
          </CardHeader>
          <CardContent>
            {radarData.some((d) => d.score > 0) ? (
              <div className="w-full h-[220px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="var(--border)" />
                    <PolarAngleAxis dataKey="topic" tick={{ fill: 'var(--muted-foreground)', fontSize: 9 }} />
                    <Radar name="Score" dataKey="score" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.15} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[220px]">
                <p className="text-sm text-muted-foreground text-center">Complete interviews to build your radar</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Start Interview Dialog */}
      <Dialog open={!!modal} onOpenChange={(o) => !starting && !o && setModal(null)}>
        <DialogContent>
          {modal && (
            <>
              <DialogHeader>
                <DialogTitle>Start {modal.label}</DialogTitle>
                <DialogDescription>{modal.desc}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label>Number of Questions</Label>
                  <Select value={config.totalQuestions} onValueChange={(v) => setConfig((c) => ({ ...c, totalQuestions: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[3, 5, 8, 10].map((n) => (
                        <SelectItem key={n} value={String(n)}>{n} questions (~{n * 5} min)</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Answer Mode</Label>
                  <Select value={config.mode} onValueChange={(v) => setConfig((c) => ({ ...c, mode: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="voice">Voice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setModal(null)} disabled={starting}>
                  Cancel
                </Button>
                <Button onClick={handleStart} disabled={starting}>
                  {starting ? <><Loader2 size={16} className="animate-spin" /> Starting...</> : 'Start Now'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}