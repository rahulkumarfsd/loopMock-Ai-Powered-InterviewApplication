import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useInterviewStore from '../store/interveiwStore.js';
import Modal from '../components/ui/Modal';
import Spinner from '../components/ui/Spinner';

const COMPANIES = [
  { name: 'Amazon',    slug: 'amazon',    diff: 'hard',   focus: 'Leadership Principles · SDE I–III',  emoji: '🟠', type: 'behavioral',    topics: ['behavioral','system-design','dsa'] },
  { name: 'Google',    slug: 'google',    diff: 'hard',   focus: 'Googliness · L4–L6 SWE',             emoji: '🔵', type: 'dsa',            topics: ['dsa','system-design','behavioral'] },
  { name: 'Meta',      slug: 'meta',      diff: 'hard',   focus: 'Move fast · bootcamp culture',        emoji: '🟣', type: 'dsa',            topics: ['dsa','system-design','behavioral'] },
  { name: 'Microsoft', slug: 'microsoft', diff: 'medium', focus: 'Growth mindset · SDE I–III',          emoji: '🟢', type: 'behavioral',    topics: ['dsa','behavioral','system-design'] },
  { name: 'Infosys',   slug: 'infosys',   diff: 'easy',   focus: 'Campus to corporate · fresher',       emoji: '💙', type: 'dsa',            topics: ['dsa','behavioral'] },
  { name: 'TCS',       slug: 'tcs',       diff: 'easy',   focus: 'NQT · Digital roles',                 emoji: '🏆', type: 'dsa',            topics: ['dsa','behavioral'] },
  { name: 'Flipkart',  slug: 'flipkart',  diff: 'medium', focus: 'E-commerce · SDE roles',              emoji: '🛒', type: 'system-design',  topics: ['dsa','system-design'] },
  { name: 'Swiggy',    slug: 'swiggy',    diff: 'medium', focus: 'Fast-paced startup · backend heavy',  emoji: '🍜', type: 'backend',        topics: ['backend','system-design','dsa'] },
  { name: 'Zoho',      slug: 'zoho',      diff: 'medium', focus: 'Product company · generalist roles',  emoji: '⚡', type: 'dsa',            topics: ['dsa','frontend','backend'] },
];

const DIFF_BADGE = { easy: 'badge-green', medium: 'badge-amber', hard: 'badge-red' };
const QUESTIONS  = [3, 5, 8];

export default function CompanyPrep() {
  const navigate = useNavigate();
  const { startInterview } = useInterviewStore();

  const [selected, setSelected] = useState(null);
  const [questions, setQuestions] = useState(5);
  const [starting,  setStarting]  = useState(false);

  const handleStart = async () => {
    if (!selected) return;
    setStarting(true);
    const interview = await startInterview({
      type:           selected.type,
      company:        selected.slug,
      totalQuestions: questions,
      mode:           'text',
    });
    setStarting(false);
    if (interview) {
      setSelected(null);
      navigate(`/interview/${interview._id}`);
    }
  };

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="font-display text-2xl font-bold mb-2">Company-Specific Prep</h1>
      <p className="text-[#7a7a8a] text-sm mb-8">
        Practice with interview styles tailored to each company's culture and hiring process
      </p>

      <div className="grid grid-cols-3 gap-4">
        {COMPANIES.map((c) => (
          <button
            key={c.name}
            onClick={() => setSelected(c)}
            className="card p-5 text-left hover:border-border-2 hover:-translate-y-0.5 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl">{c.emoji}</div>
              <div>
                <h3 className="font-medium text-sm">{c.name}</h3>
                <span className={`badge ${DIFF_BADGE[c.diff]} mt-1`}>{c.diff}</span>
              </div>
            </div>
            <p className="text-xs text-[#7a7a8a] mb-3 leading-relaxed">{c.focus}</p>
            <div className="flex gap-1.5 flex-wrap">
              {c.topics.map((t) => (
                <span key={t} className="badge badge-purple text-[10px]">{t.replace('-', ' ')}</span>
              ))}
            </div>
          </button>
        ))}
      </div>

      {/* Start modal */}
      <Modal open={!!selected} onClose={() => !starting && setSelected(null)}
        title={selected ? `${selected.emoji} ${selected.name} Interview` : ''}>
        {selected && (
          <div className="space-y-4">
            <p className="text-sm text-[#7a7a8a] leading-relaxed">
              {selected.focus} — questions tailored to {selected.name}'s interview style and culture.
            </p>
            <div>
              <label className="block text-xs text-[#7a7a8a] mb-1.5">Number of Questions</label>
              <select className="input" value={questions}
                onChange={(e) => setQuestions(Number(e.target.value))}>
                {QUESTIONS.map((n) => (
                  <option key={n} value={n}>{n} questions (~{n * 5} min)</option>
                ))}
              </select>
            </div>
            <div className="bg-bg-4 rounded-xl p-3">
              <p className="text-xs text-[#7a7a8a] mb-1">Focus area</p>
              <div className="flex gap-1.5 flex-wrap mt-1.5">
                {selected.topics.map((t) => (
                  <span key={t} className="badge badge-purple">{t.replace('-', ' ')}</span>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={() => setSelected(null)} disabled={starting}
                className="btn-outline flex-1 justify-center">Cancel</button>
              <button onClick={handleStart} disabled={starting}
                className="btn-primary flex-1 justify-center">
                {starting ? <Spinner size="sm" /> : `Start ${selected.name} Interview →`}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}