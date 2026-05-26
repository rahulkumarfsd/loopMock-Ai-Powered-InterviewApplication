import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useInterviewStore from '../store/interveiwStore.js';
import Modal from '../components/ui/Modal';
import Spinner from '../components/ui/Spinner';
import { Building2, Landmark } from 'lucide-react';
import {
  Amazon,
  Google,
  Meta,
  Microsoft,
  Infosys,
  Tata,
  Flipkart,
  Swiggy,
} from 'react-simple-icons';

// Mapping custom component icons directly alongside hex design values
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
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full">
      <h1 className="font-display text-xl sm:text-2xl font-bold mb-1">Company-Specific Prep</h1>
      <p className="text-[#7a7a8a] text-xs sm:text-sm mb-6 sm:mb-8">
        Practice with interview styles tailored to each company's culture and hiring process
      </p>

      {/* Responsive Grid Setup */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {COMPANIES.map((c) => {
          const IconComponent = c.icon;
          return (
            <button
              key={c.name}
              onClick={() => setSelected(c)}
              className="card p-4 sm:p-5 text-left hover:border-border-2 hover:-translate-y-0.5 transition-all flex flex-col justify-between group h-full">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-bg-4 flex items-center justify-center flex-shrink-0 border border-border/30 group-hover:bg-bg-2 transition-colors">
                    {IconComponent ? (
                      <IconComponent size={20} color={c.color} />
                    ) : (
                      <Building2 size={20} className="text-accent" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-sm leading-tight text-[#e0e0e6]">{c.name}</h3>
                    <span className={`badge ${DIFF_BADGE[c.diff]} text-[10px] px-1.5 py-0.5 mt-1`}>{c.diff}</span>
                  </div>
                </div>
                <p className="text-xs text-[#7a7a8a] mb-4 leading-relaxed min-h-[32px] line-clamp-2">{c.focus}</p>
              </div>
              
              <div className="flex gap-1.5 flex-wrap pt-1 border-t border-border/20 w-full">
                {c.topics.map((t) => (
                  <span key={t} className="badge badge-purple text-[10px]">{t.replace('-', ' ')}</span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Setup Modal */}
      <Modal open={!!selected} onClose={() => !starting && setSelected(null)}
        title={selected ? `${selected.name} Interview Track` : ''}>
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-border/40">
              <div className="w-10 h-10 rounded-xl bg-bg-4 flex items-center justify-center border border-border/30">
                {selected.icon ? (
                  <selected.icon size={20} color={selected.color} />
                ) : (
                  <Building2 size={20} className="text-accent" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#e0e0e6]">{selected.name} Assessment</p>
                <p className="text-xs text-[#7a7a8a] mt-0.5 capitalize">{selected.diff} Difficulty target</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#7a7a8a] leading-relaxed">
              {selected.focus} — question sets are programmatically pulled based on target roles, cultural tenets, and historical engineering loop blueprints at {selected.name}.
            </p>
            
            <div>
              <label className="block text-xs font-medium text-[#7a7a8a] mb-1.5">Number of Questions</label>
              <select className="input w-full text-sm" value={questions}
                onChange={(e) => setQuestions(Number(e.target.value))}>
                {QUESTIONS.map((n) => (
                  <option key={n} value={n}>{n} questions (~{n * 5} min)</option>
                ))}
              </select>
            </div>
            
            <div className="bg-bg-4 rounded-xl p-3 border border-border/40">
              <p className="text-[10px] uppercase tracking-wider font-semibold text-[#7a7a8a] mb-1.5">Focus areas</p>
              <div className="flex gap-1.5 flex-wrap">
                {selected.topics.map((t) => (
                  <span key={t} className="badge badge-purple text-xs">{t.replace('-', ' ')}</span>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-2">
              <button onClick={() => setSelected(null)} disabled={starting}
                className="btn-outline w-full sm:flex-1 justify-center text-sm py-2">Cancel</button>
              <button onClick={handleStart} disabled={starting}
                className="btn-primary w-full sm:flex-1 justify-center text-sm py-2">
                {starting ? <Spinner size="sm" /> : `Start Session `}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}