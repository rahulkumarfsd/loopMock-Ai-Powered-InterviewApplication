import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { analyticsService } from '../services';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area,
} from 'recharts';
import { AnalyticsSkeleton } from '@/components/skeletons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, TrendingUp, Flame, HelpCircle, CheckCircle2, AlertTriangle } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function Analytics() {
  const [overview, setOverview] = useState(null);
  const [trend, setTrend] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      analyticsService.getOverview(),
      analyticsService.getTrend(8),
      analyticsService.getTopics(),
    ])
      .then(([ov, tr, tp]) => {
        setOverview(ov.data);
        setTrend(tr.data.trend || []);
        setTopics(tp.data.topics || []);
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AnalyticsSkeleton />;

  if (error) return (
    <div className="flex h-full min-h-[60vh] items-center justify-center flex-col gap-3 p-4">
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 max-w-md text-center">
        <p className="text-destructive text-sm mb-4">{error}</p>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>Retry</Button>
      </div>
    </div>
  );

  const stats = overview?.stats || {};
  const radarData = Object.entries(overview?.topicScores || {})
    .map(([k, v]) => ({ topic: k.replace(/([A-Z])/g, ' $1').trim(), score: v, fullMark: 10 }))
    .filter((d) => d.score > 0);

  const topicsSorted = [...topics].sort((a, b) => (b.score || 0) - (a.score || 0));
  const strong = topicsSorted.filter((t) => (t.score || 0) >= 7);
  const weak = topicsSorted.filter((t) => (t.score || 0) > 0 && (t.score || 0) < 6);

  const scoreColor = (s) => s >= 7 ? 'text-emerald-500' : s >= 5 ? 'text-amber-500' : 'text-destructive';

  const STAT_CARDS = [
    { label: 'Total Interviews', value: stats.totalInterviews || 0, icon: Target, color: 'text-primary' },
    { label: 'Average Score', value: `${stats.averageScore || 0}/10`, icon: TrendingUp, color: 'text-emerald-500' },
    { label: 'Best Streak', value: `${stats.streak || 0} days`, icon: Flame, color: 'text-amber-500' },
    { label: 'Total Questions', value: stats.totalQuestions || 0, icon: HelpCircle, color: 'text-sky-500' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-1">Performance Analytics</h1>
        <p className="text-muted-foreground text-sm">Track your progress across all interview types</p>
      </div>

      {/* Stats */}
      <motion.div variants={container} initial="hidden" animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
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

      {/* Charts */}
      <Tabs defaultValue="overview" className="mb-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="topics">Topics</TabsTrigger>
          <TabsTrigger value="strengths">Strengths</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Score Trend (8 weeks)</CardTitle>
              </CardHeader>
              <CardContent>
                {trend.length > 0 ? (
                  <div className="w-full h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trend} margin={{ right: 10, left: -20 }}>
                        <defs>
                          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                        <XAxis dataKey="week" tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} />
                        <YAxis domain={[0, 10]} tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} />
                        <Tooltip contentStyle={{ background: 'var(--popover)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11, color: 'var(--popover-foreground)' }} />
                        <Area type="monotone" dataKey="avgScore" stroke="var(--primary)" strokeWidth={2} fill="url(#colorScore)" dot={{ fill: 'var(--primary)', r: 3 }} activeDot={{ r: 5 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[250px]">
                    <p className="text-sm text-muted-foreground">Complete interviews to see your trend</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Skill Radar</CardTitle>
              </CardHeader>
              <CardContent>
                {radarData.length > 0 ? (
                  <div className="w-full h-[250px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                        <PolarGrid stroke="var(--border)" />
                        <PolarAngleAxis dataKey="topic" tick={{ fill: 'var(--muted-foreground)', fontSize: 9 }} />
                        <Radar dataKey="score" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.15} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[250px]">
                    <p className="text-sm text-muted-foreground">No skill data yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="topics">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Topic Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              {topicsSorted.filter((t) => t.score > 0).length > 0 ? (
                <div className="space-y-4">
                  {topicsSorted.filter((t) => t.score > 0).map(({ topic, score }) => (
                    <div key={topic} className="flex items-center gap-4">
                      <span className="text-sm capitalize w-28 sm:w-36 truncate flex-shrink-0">
                        {topic.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <div className="flex-1">
                        <Progress value={(score / 10) * 100} className="h-2" />
                      </div>
                      <span className={`text-sm font-medium w-8 text-right flex-shrink-0 ${scoreColor(score)}`}>
                        {score.toFixed(1)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Complete interviews to see topic scores</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strengths">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <Card className="border-emerald-500/20 bg-emerald-500/5">
              <CardContent className="p-4 sm:p-5">
                <h3 className="text-sm font-medium text-emerald-500 mb-3 flex items-center gap-1.5">
                  <CheckCircle2 size={16} /> Strong Areas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {strong.length > 0
                    ? strong.map((t) => <Badge key={t.topic} variant="success">{t.topic}</Badge>)
                    : <p className="text-xs text-muted-foreground">Keep practicing to discover your strengths</p>}
                </div>
              </CardContent>
            </Card>
            <Card className="border-destructive/20 bg-destructive/5">
              <CardContent className="p-4 sm:p-5">
                <h3 className="text-sm font-medium text-destructive mb-3 flex items-center gap-1.5">
                  <AlertTriangle size={16} /> Needs Work
                </h3>
                <div className="flex flex-wrap gap-2">
                  {weak.length > 0
                    ? weak.map((t) => <Badge key={t.topic} variant="destructive">{t.topic}</Badge>)
                    : <p className="text-xs text-muted-foreground">No weak areas detected yet!</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}