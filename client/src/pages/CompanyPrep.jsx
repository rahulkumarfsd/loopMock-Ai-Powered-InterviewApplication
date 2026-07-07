import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useInterviewStore from '../store/interveiwStore.js';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Building2, Loader2 } from 'lucide-react';
import {
  Amazon, Google, Meta, Microsoft, Infosys, Tata, Flipkart, Swiggy,
} from 'react-simple-icons';

const COMPANIES = [
  { name: 'Amazon',    slug: 'amazon',    diff: 'hard',   focus: 'Leadership Principles · SDE I–III',   icon: Amazon,    color: '#FF9900', type: 'behavioral',    topics: ['behavioral','system-design','dsa'] },
  { name: 'Google',    slug: 'google',    diff: 'hard',   focus: 'Googliness · L4–L6 SWE',             icon: Google,    color: '#4285F4', type: 'dsa',            topics: ['dsa','system-design','behavioral'] },
  { name: 'Meta',      slug: 'meta',      diff: 'hard',   focus: 'Move fast · bootcamp culture',        icon: Meta,      color: '#044AF4', type: 'dsa',            topics: ['dsa','system-design','behavioral'] },
  { name: 'Microsoft', slug: 'microsoft', diff: 'medium', focus: 'Growth mindset · SDE I–III',          icon: Microsoft, color: '#626262', type: 'behavioral',    topics: ['dsa','behavioral','system-design'] },
  { name: 'Infosys',   slug: 'infosys',   diff: 'easy',   focus: 'Campus to corporate · fresher',       icon: Infosys,   color: '#007CC3', type: 'dsa',            topics: ['dsa','behavioral'] },
  { name: 'TCS',       slug: 'tcs',       diff: 'easy',   focus: 'NQT · Digital roles',                icon: Tata,      color: '#1B4D91', type: 'dsa',            topics: ['dsa','behavioral'] },
  { name: 'Flipkart',  slug: 'flipkart',  diff: 'medium', focus: 'E-commerce · SDE roles',              icon: Flipkart,  color: '#2874F0', type: 'system-design',  topics: ['dsa','system-design'] },
  { name: 'Swiggy',    slug: 'swiggy',    diff: 'medium', focus: 'Fast-paced startup · backend heavy',  icon: Swiggy,    color: '#FC6011', type: 'backend',        topics: ['backend','system-design','dsa'] },
  { name: 'Zoho',      slug: 'zoho',      diff: 'medium', focus: 'Product company · generalist roles',  icon: null,      color: '#E51A24', type: 'dsa',            topics: ['dsa','frontend','backend'] },
];

const DIFF_VARIANT = { easy: 'success', medium: 'warning', hard: 'destructive' };
const QUESTIONS = [3, 5, 8];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function CompanyPrep() {
  const navigate = useNavigate();
  const { startInterview } = useInterviewStore();
  const [selected, setSelected] = useState(null);
  const [questions, setQuestions] = useState('5');
  const [starting, setStarting] = useState(false);

  const handleStart = async () => {
    if (!selected) return;
    setStarting(true);
    const interview = await startInterview({
      type: selected.type,
      company: selected.slug,
      totalQuestions: Number(questions),
      mode: 'text',
    });
    setStarting(false);
    if (interview) {
      setSelected(null);
      navigate(`/interview/${interview._id}`);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-1">Company-Specific Prep</h1>
        <p className="text-muted-foreground text-sm">
          Practice with interview styles tailored to each company's culture and hiring process
        </p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {COMPANIES.map((c) => {
          const IconComponent = c.icon;
          return (
            <motion.div key={c.name} variants={item}>
              <Card
                className="cursor-pointer hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 transition-all group h-full flex flex-col"
                onClick={() => setSelected(c)}
              >
                <CardContent className="p-4 sm:p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 border border-border/30 group-hover:bg-accent transition-colors">
                      {IconComponent ? (
                        <IconComponent size={20} color={c.color} />
                      ) : (
                        <Building2 size={20} className="text-primary" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-sm leading-tight">{c.name}</h3>
                      <Badge variant={DIFF_VARIANT[c.diff]} className="mt-1 text-[10px]">{c.diff}</Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4 leading-relaxed min-h-[32px] line-clamp-2 flex-1">{c.focus}</p>
                  <div className="flex gap-1.5 flex-wrap pt-2 border-t border-border/20">
                    {c.topics.map((t) => (
                      <Badge key={t} variant="secondary" className="text-[10px]">{t.replace('-', ' ')}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Start Dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !starting && !o && setSelected(null)}>
        <DialogContent>
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center border border-border/30">
                    {selected.icon ? (
                      <selected.icon size={20} color={selected.color} />
                    ) : (
                      <Building2 size={20} className="text-primary" />
                    )}
                  </div>
                  <div>
                    <DialogTitle>{selected.name} Interview Track</DialogTitle>
                    <DialogDescription className="capitalize">{selected.diff} difficulty</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selected.focus} — question sets are programmatically pulled based on target roles, cultural tenets, and historical engineering loop blueprints at {selected.name}.
                </p>

                <div className="space-y-2">
                  <Label>Number of Questions</Label>
                  <Select value={questions} onValueChange={setQuestions}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {QUESTIONS.map((n) => (
                        <SelectItem key={n} value={String(n)}>{n} questions (~{n * 5} min)</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-muted rounded-xl p-3 border border-border/40">
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">Focus areas</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {selected.topics.map((t) => (
                      <Badge key={t} variant="secondary">{t.replace('-', ' ')}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelected(null)} disabled={starting}>Cancel</Button>
                <Button onClick={handleStart} disabled={starting}>
                  {starting ? <><Loader2 size={16} className="animate-spin" /> Starting...</> : 'Start Session'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}