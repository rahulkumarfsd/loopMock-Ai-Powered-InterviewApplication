import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { codingService } from '../services';
import Spinner from '../components/ui/Spinner';
import { toast } from 'sonner';

const LANGUAGES = [
  { id: 'javascript', label: 'JS',     monacoId: 'javascript' },
  { id: 'python',     label: 'Python', monacoId: 'python'     },
  { id: 'java',       label: 'Java',   monacoId: 'java'       },
  { id: 'cpp',        label: 'C++',    monacoId: 'cpp'        },
  { id: 'typescript', label: 'TS',     monacoId: 'typescript' },
  { id: 'go',         label: 'Go',     monacoId: 'go'         },
];

const STARTER = {
  javascript: '// Write your solution here\n\n',
  python:     '# Write your solution here\n\n',
  java:       'class Solution {\n    // Write your solution here\n    \n}\n',
  cpp:        '#include <bits/stdc++.h>\nusing namespace std;\n\n// Write your solution here\n\n',
  typescript: '// Write your solution here\n\n',
  go:         'package main\n\nimport "fmt"\n\nfunc main() {\n    // Write your solution here\n    _ = fmt.Println\n}\n',
};

const DIFF_COLOR = {
  easy:   { text: 'text-green-400',  bg: 'bg-green-400/10 text-green-400'   },
  medium: { text: 'text-yellow-400', bg: 'bg-yellow-400/10 text-yellow-400' },
  hard:   { text: 'text-red-400',    bg: 'bg-red-400/10 text-red-400'       },
};

function useBreakpoint() {
  const [bp, setBp] = useState(() => ({
    isMobile:  window.innerWidth < 640,
    isTablet:  window.innerWidth >= 640 && window.innerWidth < 1024,
    isDesktop: window.innerWidth >= 1024,
  }));
  useEffect(() => {
    const fn = () => setBp({
      isMobile:  window.innerWidth < 640,
      isTablet:  window.innerWidth >= 640 && window.innerWidth < 1024,
      isDesktop: window.innerWidth >= 1024,
    });
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return bp;
}

export default function CodingInterview() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const { isMobile, isTablet, isDesktop } = useBreakpoint();

  const [problems,    setProblems]    = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [filter,      setFilter]      = useState({ difficulty: 'all', search: '' });
  const [page,        setPage]        = useState(1);
  const [totalPages,  setTotalPages]  = useState(1);

  const [problem,     setProblem]     = useState(null);
  const [loadingProb, setLoadingProb] = useState(false);

  const [lang,        setLang]        = useState('javascript');
  const [code,        setCode]        = useState(STARTER.javascript);
  const [customInput, setCustomInput] = useState('');
  const [useCustom,   setUseCustom]   = useState(false);

  const [results,    setResults]    = useState(null);
  const [running,    setRunning]    = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [verdict,    setVerdict]    = useState(null);
  const [activeTab,  setActiveTab]  = useState('testcases');
  const [mobilePanel,setMobilePanel]= useState('problem');

  useEffect(() => { if (id) return; fetchProblems(); }, [filter.difficulty, page]);

  const fetchProblems = async () => {
    setLoadingList(true);
    try {
      const params = { page, limit: 20 };
      if (filter.difficulty !== 'all') params.difficulty = filter.difficulty;
      if (filter.search) params.search = filter.search;
      const { data } = await codingService.getProblems(params);
      setProblems(data.problems || []);
      setTotalPages(data.pages || 1);
    } catch { toast.error('Failed to load problems'); }
    finally  { setLoadingList(false); }
  };

  const handleSearch = (e) => { if (e.key === 'Enter') { setPage(1); fetchProblems(); } };

  useEffect(() => { if (!id) return; loadProblem(id); }, [id]);

  const loadProblem = async (problemId) => {
    setLoadingProb(true); setProblem(null); setResults(null); setVerdict(null);
    try {
      const { data } = await codingService.getProblem(problemId);
      setProblem(data.problem);
      setCode(data.problem?.coding?.starterCode?.[lang] || STARTER[lang]);
      setActiveTab('testcases');
      setMobilePanel('problem');
    } catch { toast.error('Problem not found'); navigate('/coding'); }
    finally  { setLoadingProb(false); }
  };

  const changeLang = (newLang) => {
    setLang(newLang);
    setCode(problem?.coding?.starterCode?.[newLang] || STARTER[newLang]);
    setResults(null); setVerdict(null);
  };

  const run = async () => {
    if (!code.trim()) return toast.error('Write some code first');
    setRunning(true); setResults(null); setVerdict(null);
    setActiveTab('results');
    if (isMobile) setMobilePanel('results');
    try {
      const { data } = await codingService.runCode({
        code, language: lang, problemId: problem?._id,
        customInput: useCustom ? customInput : undefined,
      });
      setResults(data.results || []);
      const passed = data.results?.filter(r => r.passed).length || 0;
      toast.success(`${passed}/${data.results?.length || 0} test cases passed`);
    } catch (err) { toast.error(err.response?.data?.message || 'Execution failed'); }
    finally { setRunning(false); }
  };

  const submit = async () => {
    if (!problem?._id) return toast.error('No problem selected');
    if (!code.trim())  return toast.error('Write some code first');
    setSubmitting(true); setResults(null); setVerdict(null);
    setActiveTab('results');
    if (isMobile) setMobilePanel('results');
    try {
      const { data } = await codingService.submitCode({ code, language: lang, problemId: problem._id });
      setResults(data.results || []);
      setVerdict({ type: data.allPassed ? 'accepted' : 'wrong', ...data });
      if (data.allPassed) toast.success(`Accepted! ${data.passed}/${data.total} passed 🎉`);
      else                toast.error(`${data.verdict}: ${data.passed}/${data.total} passed`);
    } catch (err) { toast.error(err.response?.data?.message || 'Submission failed'); }
    finally { setSubmitting(false); }
  };

  const resetCode = () => {
    setCode(problem?.coding?.starterCode?.[lang] || STARTER[lang]);
    setResults(null); setVerdict(null);
    toast('Code reset');
  };

  // ── PROBLEM LIST ──────────────────────────────────────────────────────────
  if (!id) return (
    <div className="min-h-screen bg-[#0d0d0f]">
      <div className="border-b border-[#2a2a35] px-4 sm:px-6 py-3 sm:py-4">
        <div className="mt-12 sm:mt-0 flex flex-col sm:flex-row sm:items-center gap-3">
          <h1 className="font-display text-lg font-bold text-white">Problems</h1>
          <div className="flex gap-1.5 flex-wrap">
            {['all','easy','medium','hard'].map(d => (
              <button key={d} onClick={() => { setFilter(f => ({...f, difficulty: d})); setPage(1); }}
                className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all
                  ${filter.difficulty === d
                    ? d==='easy'   ? 'bg-green-400/20 text-green-400'
                    : d==='medium' ? 'bg-yellow-400/20 text-yellow-400'
                    : d==='hard'   ? 'bg-red-400/20 text-red-400'
                    : 'bg-[#6c63ff]/20 text-[#a78bfa]'
                    : 'bg-[#212128] text-[#7a7a8a] hover:text-white'}`}>
                {d}
              </button>
            ))}
          </div>
          <div className="sm:ml-auto w-full sm:w-64 md:w-80">
            <input className="w-full bg-[#212128] border border-[#2a2a35] text-white rounded-xl px-3 py-2 text-sm placeholder:text-[#4a4a5a] focus:outline-none focus:border-[#6c63ff]"
              placeholder="Search problems…" value={filter.search}
              onChange={e => setFilter(f => ({...f, search: e.target.value}))}
              onKeyDown={handleSearch} />
          </div>
        </div>
      </div>

      <div className="px-3 sm:px-6 py-3 sm:py-4">
        {loadingList ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : problems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#7a7a8a] mb-3">No problems found</p>
            <p className="text-xs text-[#4a4a5a]">Run <code className="bg-[#212128] px-2 py-0.5 rounded text-[#c0c0cc]">node data/seed.js</code></p>
          </div>
        ) : (
          <>
            <div className="hidden sm:grid grid-cols-12 text-xs text-[#4a4a5a] uppercase tracking-wider pb-3 border-b border-[#2a2a35]">
              <div className="col-span-1">#</div>
              <div className="col-span-5">Title</div>
              <div className="col-span-2">Difficulty</div>
              <div className="col-span-2">Topic</div>
              <div className="col-span-2">Companies</div>
            </div>
            {problems.map((p, i) => (
              <div key={p._id} className="cursor-pointer border-b border-[#2a2a35] hover:bg-[#1a1a1f] transition-colors group"
                onClick={() => navigate(`/coding/${p._id}`)}>
                <div className="sm:hidden py-3 px-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white group-hover:text-[#a78bfa] font-medium truncate">{(page-1)*20+i+1}. {p.title}</p>
                      <p className="text-xs text-[#7a7a8a] mt-0.5 capitalize">{p.topic?.replace(/-/g,' ')}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className={`text-xs font-medium capitalize ${DIFF_COLOR[p.difficulty]?.text||'text-[#7a7a8a]'}`}>{p.difficulty}</span>
                      <div className="flex gap-1">
                        {p.company?.slice(0,2).map(c => <span key={c} className="text-[9px] bg-[#212128] text-[#7a7a8a] px-1.5 py-0.5 rounded capitalize">{c}</span>)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="hidden sm:grid grid-cols-12 items-center py-3.5">
                  <div className="col-span-1 text-xs text-[#4a4a5a]">{(page-1)*20+i+1}</div>
                  <div className="col-span-5"><span className="text-sm text-white group-hover:text-[#a78bfa] font-medium">{p.title}</span></div>
                  <div className="col-span-2"><span className={`text-xs font-medium capitalize ${DIFF_COLOR[p.difficulty]?.text||'text-[#7a7a8a]'}`}>{p.difficulty}</span></div>
                  <div className="col-span-2"><span className="text-xs text-[#7a7a8a] capitalize">{p.topic?.replace(/-/g,' ')}</span></div>
                  <div className="col-span-2 flex gap-1 flex-wrap">
                    {p.company?.slice(0,2).map(c => <span key={c} className="text-[10px] bg-[#212128] text-[#7a7a8a] px-1.5 py-0.5 rounded capitalize">{c}</span>)}
                  </div>
                </div>
              </div>
            ))}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-6">
                <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}
                  className="px-4 py-2 bg-[#212128] text-[#7a7a8a] rounded-lg text-sm disabled:opacity-40 hover:text-white">← Prev</button>
                <span className="text-sm text-[#7a7a8a]">{page} / {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages}
                  className="px-4 py-2 bg-[#212128] text-[#7a7a8a] rounded-lg text-sm disabled:opacity-40 hover:text-white">Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  if (loadingProb) return <div className="flex h-screen items-center justify-center bg-[#0d0d0f]"><Spinner size="lg" /></div>;
  if (!problem) return null;

  const visibleTests = problem.coding?.testCases?.filter(t => !t.isHidden) || [];

  // ── SHARED PANELS ─────────────────────────────────────────────────────────
  const ProblemPanel = () => (
    <div className="flex-1 overflow-auto p-4 sm:p-5">
      <div className="prose prose-sm prose-invert max-w-none">
        {problem.body.split('\n\n').map((para, i) => {
          if (para.startsWith('```') || para.includes('Input:') || para.includes('Output:'))
            return <pre key={i} className="bg-[#1a1a1f] border border-[#2a2a35] rounded-xl p-3 text-xs font-mono text-[#c0c0cc] whitespace-pre-wrap my-3 overflow-x-auto">{para.replace(/```\w*/g,'').replace(/```/g,'').trim()}</pre>;
          return <p key={i} className="text-sm text-[#c0c0cc] leading-relaxed mb-3">{para}</p>;
        })}
      </div>
      {problem.coding?.examples?.map((ex, i) => (
        <div key={i} className="mb-4 mt-4">
          <p className="text-xs font-semibold text-white mb-2">Example {i+1}</p>
          <div className="bg-[#1a1a1f] border border-[#2a2a35] rounded-xl p-3 font-mono text-xs space-y-1.5 overflow-x-auto">
            <div><span className="text-[#7a7a8a]">Input: </span><span className="text-[#c0c0cc] break-all">{ex.input}</span></div>
            <div><span className="text-[#7a7a8a]">Output: </span><span className="text-[#c0c0cc]">{ex.output}</span></div>
            {ex.explanation && <div className="pt-1.5 border-t border-[#2a2a35]"><span className="text-[#7a7a8a]">Explanation: </span><span className="text-[#c0c0cc]">{ex.explanation}</span></div>}
          </div>
        </div>
      ))}
      {problem.coding?.constraints?.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold text-white mb-2">Constraints</p>
          <ul className="space-y-1">{problem.coding.constraints.map((c,i) => <li key={i} className="text-xs text-[#7a7a8a] font-mono">• {c}</li>)}</ul>
        </div>
      )}
      {problem.hints?.length > 0 && (
        <div className="mt-5">
          <p className="text-xs font-semibold text-white mb-2">Hints</p>
          {problem.hints.map((h,i) => (
            <details key={i} className="bg-[#1a1a1f] border border-[#2a2a35] rounded-xl overflow-hidden mb-2">
              <summary className="px-4 py-3 text-xs text-[#a78bfa] cursor-pointer select-none">Hint {i+1}</summary>
              <p className="px-4 pb-3 text-xs text-[#7a7a8a] leading-relaxed">{h}</p>
            </details>
          ))}
        </div>
      )}
      {(problem.company?.length > 0 || problem.tags?.length > 0) && (
        <div className="mt-5 pt-4 border-t border-[#2a2a35] space-y-3">
          {problem.company?.length > 0 && (
            <div>
              <p className="text-xs text-[#4a4a5a] mb-1.5">Companies</p>
              <div className="flex flex-wrap gap-1.5">{problem.company.map(c => <span key={c} className="text-[10px] bg-[#212128] text-[#7a7a8a] px-2 py-0.5 rounded capitalize border border-[#2a2a35]">{c}</span>)}</div>
            </div>
          )}
          {problem.tags?.length > 0 && (
            <div>
              <p className="text-xs text-[#4a4a5a] mb-1.5">Tags</p>
              <div className="flex flex-wrap gap-1.5">{problem.tags.map(t => <span key={t} className="text-[10px] bg-[#6c63ff]/10 text-[#a78bfa] px-2 py-0.5 rounded border border-[#6c63ff]/20">{t}</span>)}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const ConsolePanel = () => (
    <div className="overflow-auto p-3 sm:p-4" style={{ maxHeight: isMobile ? '100%' : 260 }}>
      {activeTab === 'testcases' && (
        <div className="space-y-3">
          {visibleTests.length === 0
            ? <p className="text-xs text-[#4a4a5a]">No visible test cases</p>
            : visibleTests.map((tc,i) => (
              <div key={i}>
                <p className="text-xs text-[#7a7a8a] mb-1.5">Case {i+1}</p>
                <div className="bg-[#0d0d0f] border border-[#2a2a35] rounded-lg p-3 font-mono text-xs text-[#c0c0cc] whitespace-pre-wrap overflow-x-auto">
                  <span className="text-[#7a7a8a]">Input: </span>{tc.input}
                </div>
              </div>
            ))
          }
        </div>
      )}
      {activeTab === 'results' && (
        <div>
          {!results && !running && !submitting && <p className="text-xs text-[#4a4a5a]">Run or submit to see results</p>}
          {(running || submitting) && (
            <div className="flex items-center gap-2 text-[#7a7a8a] text-xs py-2">
              <Spinner size="sm" /><span>{submitting ? 'Running all test cases…' : 'Running…'}</span>
            </div>
          )}
          {results && (
            <div className="space-y-3">
              {verdict && (
                <div className={`flex items-center gap-3 p-3 rounded-xl border text-sm font-medium ${verdict.type==='accepted' ? 'bg-green-400/5 border-green-400/20 text-green-400' : 'bg-red-400/5 border-red-400/20 text-red-400'}`}>
                  {verdict.type==='accepted' ? '✓ Accepted' : `✗ ${verdict.verdict}`}
                  <span className="text-xs font-normal ml-auto text-[#7a7a8a]">{verdict.passed}/{verdict.total} · {verdict.maxTime}s</span>
                </div>
              )}
              {results.map((r,i) => (
                <div key={i} className={`rounded-xl border p-3 ${r.passed ? 'border-green-400/20 bg-green-400/5' : 'border-red-400/20 bg-red-400/5'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-bold ${r.passed ? 'text-green-400' : 'text-red-400'}`}>{r.passed ? '✓ Passed' : '✗ Failed'}</span>
                    {r.isHidden && <span className="text-[10px] text-[#4a4a5a] bg-[#212128] px-1.5 py-0.5 rounded">hidden</span>}
                    <span className="text-[10px] text-[#4a4a5a] ml-auto">{r.time}s</span>
                  </div>
                  {r.stdout && <div className="font-mono text-xs text-[#c0c0cc] bg-[#0d0d0f] rounded-lg p-2.5 mb-1.5 whitespace-pre-wrap overflow-x-auto"><span className="text-[#4a4a5a]">Output: </span>{r.stdout}</div>}
                  {r.stderr && <div className="font-mono text-xs text-red-400 bg-red-400/5 rounded-lg p-2.5 whitespace-pre-wrap overflow-x-auto">{r.stderr}</div>}
                  {!r.passed && !r.stderr && !r.compile && <div className="text-xs text-[#7a7a8a]">{r.statusDesc || 'Wrong Answer'}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {activeTab === 'customInput' && (
        <div>
          <label className="flex items-center gap-2 text-xs text-[#7a7a8a] cursor-pointer mb-3">
            <input type="checkbox" checked={useCustom} onChange={e => setUseCustom(e.target.checked)} className="rounded" />
            Use custom input instead of test cases
          </label>
          <textarea className="w-full bg-[#0d0d0f] border border-[#2a2a35] rounded-lg p-3 text-xs font-mono text-[#c0c0cc] focus:outline-none focus:border-[#6c63ff] resize-none"
            rows={4} placeholder="Enter custom stdin…" value={customInput} onChange={e => setCustomInput(e.target.value)} />
        </div>
      )}
    </div>
  );

  // ── TOP BAR — MOBILE: two rows. DESKTOP: one row ──────────────────────────
  const TopBar = () => (
    <div className="border-b border-[#2a2a35] bg-[#141416] flex-shrink-0">

      {/* ── Row 1: back + title + difficulty ── */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-[#2a2a35]/60">
        <button onClick={() => navigate('/coding')}
          className="text-[#7a7a8a] hover:text-white text-xs transition-colors flex items-center gap-1 flex-shrink-0">
          ← <span className="hidden sm:inline">Problems</span>
        </button>
        <div className="hidden sm:block w-px h-4 bg-[#2a2a35]" />
        <span className="text-white text-xs sm:text-sm font-medium truncate flex-1 min-w-0">{problem.title}</span>
        <span className={`text-xs font-medium capitalize px-2 py-0.5 rounded flex-shrink-0 ${DIFF_COLOR[problem.difficulty]?.bg}`}>
          {problem.difficulty}
        </span>
      </div>

      {/* ── Row 2: language selector + Run + Submit (always visible) ── */}
      <div className="flex items-center gap-2 px-3 py-2">
        <select value={lang} onChange={e => changeLang(e.target.value)}
          className="bg-[#212128] border border-[#2a2a35] text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#6c63ff] flex-shrink-0">
          {LANGUAGES.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
        </select>

        <button onClick={resetCode}
          className="text-xs text-[#7a7a8a] hover:text-white transition-colors px-2 py-1.5 hidden sm:block">
          ↺ Reset
        </button>

        {/* spacer on mobile to push buttons right */}
        <div className="flex-1 sm:flex-none" />

        {/* ▶ Run */}
        <button onClick={run} disabled={running || submitting}
          className="flex items-center gap-1.5 bg-[#212128] border border-[#2a2a35] hover:border-[#35354a] text-white text-xs px-3 py-1.5 rounded-lg transition-all disabled:opacity-50 flex-shrink-0">
          {running
            ? <><Spinner size="sm" /><span>Running…</span></>
            : <><span>▶</span><span>Run</span></>}
        </button>

        {/* Submit — always visible, never hidden */}
        <button onClick={submit} disabled={running || submitting}
          className="flex items-center gap-1.5 bg-[#10d98c] hover:bg-[#0ec47e] text-[#0d0d0f] font-semibold text-xs px-4 py-1.5 rounded-lg transition-all disabled:opacity-50 flex-shrink-0">
          {submitting
            ? <><Spinner size="sm" /><span>Submitting…</span></>
            : <span>Submit</span>}
        </button>
      </div>
    </div>
  );

  // ── MOBILE (<640px) ───────────────────────────────────────────────────────
  if (isMobile) return (
    <div className="flex flex-col bg-[#0d0d0f]" style={{ height: '100vh' }}>
      <TopBar />

      {/* Panel tabs */}
      <div className="flex border-b border-[#2a2a35] bg-[#141416] flex-shrink-0">
        {[
          { id: 'problem', label: ' Problem' },
          { id: 'editor',  label: ' Code'    },
          { id: 'results', label: ' Results'  },
        ].map(tab => (
          <button key={tab.id} onClick={() => setMobilePanel(tab.id)}
            className={`flex-1 py-2.5 text-xs font-medium transition-colors
              ${mobilePanel===tab.id ? 'text-white border-b-2 border-[#6c63ff] bg-[#1a1a1f]' : 'text-[#7a7a8a]'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        {mobilePanel === 'problem' && <div className="h-full overflow-auto"><ProblemPanel /></div>}

        {mobilePanel === 'editor' && (
          <div className="h-full flex flex-col">
            <Editor height="100%"
              language={LANGUAGES.find(l=>l.id===lang)?.monacoId||'javascript'}
              value={code} onChange={v=>setCode(v||'')} theme="vs-dark"
              options={{ fontSize:13, fontFamily:"'JetBrains Mono',monospace", minimap:{enabled:false}, padding:{top:12,bottom:12}, scrollBeyondLastLine:false, wordWrap:'on', lineNumbers:'on', tabSize:2, quickSuggestions:true }} />
          </div>
        )}

        {mobilePanel === 'results' && (
          <div className="h-full flex flex-col">
            <div className="flex border-b border-[#2a2a35] bg-[#141416] flex-shrink-0">
              {[{id:'testcases',label:'Test Cases'},{id:'results',label:'Results'},{id:'customInput',label:'Custom'}].map(tab=>(
                <button key={tab.id} onClick={()=>setActiveTab(tab.id)}
                  className={`flex-1 py-2.5 text-xs font-medium ${activeTab===tab.id?'text-white border-b-2 border-[#6c63ff]':'text-[#7a7a8a]'}`}>
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-auto"><ConsolePanel /></div>
          </div>
        )}
      </div>
    </div>
  );

  // ── TABLET (640px–1024px) ─────────────────────────────────────────────────
  if (isTablet) return (
    <div className="flex flex-col bg-[#0d0d0f]" style={{ height: '100vh' }}>
      <TopBar />
      <div className="flex border-b border-[#2a2a35] bg-[#141416] flex-shrink-0">
        {[{id:'problem',label:' Problem'},{id:'editor',label:' Editor'}].map(tab=>(
          <button key={tab.id} onClick={()=>setMobilePanel(tab.id)}
            className={`px-6 py-2.5 text-xs font-medium transition-colors ${mobilePanel===tab.id?'text-white border-b-2 border-[#6c63ff]':'text-[#7a7a8a] hover:text-white'}`}>
            {tab.label}
          </button>
        ))}
        {verdict && (
          <div className={`ml-auto mr-3 self-center px-3 py-1 rounded-full text-xs font-bold ${verdict.type==='accepted'?'bg-green-400/15 text-green-400':'bg-red-400/15 text-red-400'}`}>
            {verdict.type==='accepted'?'✓ Accepted':`✗ ${verdict.verdict}`}
          </div>
        )}
      </div>
      <div className="flex-1 min-h-0 overflow-hidden">
        {mobilePanel==='problem' && <div className="h-full overflow-auto"><ProblemPanel /></div>}
        {mobilePanel==='editor' && (
          <div className="h-full flex flex-col">
            <div style={{flex:'0 0 60%',minHeight:0}}>
              <Editor height="100%"
                language={LANGUAGES.find(l=>l.id===lang)?.monacoId||'javascript'}
                value={code} onChange={v=>setCode(v||'')} theme="vs-dark"
                options={{fontSize:13,fontFamily:"'JetBrains Mono',monospace",minimap:{enabled:false},padding:{top:12,bottom:12},scrollBeyondLastLine:false,wordWrap:'on',lineNumbers:'on',tabSize:2}} />
            </div>
            <div style={{flex:'0 0 40%',minHeight:0}} className="border-t border-[#2a2a35] bg-[#141416] flex flex-col overflow-hidden">
              <div className="flex items-center border-b border-[#2a2a35] flex-shrink-0">
                {[{id:'testcases',label:'Test Cases'},{id:'results',label:'Results'},{id:'customInput',label:'Custom'}].map(tab=>(
                  <button key={tab.id} onClick={()=>setActiveTab(tab.id)}
                    className={`px-4 py-2.5 text-xs font-medium ${activeTab===tab.id?'text-white border-b-2 border-[#6c63ff]':'text-[#7a7a8a] hover:text-white'}`}>
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="flex-1 overflow-auto"><ConsolePanel /></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // ── DESKTOP (≥1024px) ─────────────────────────────────────────────────────
  return (
    <div className="flex flex-col bg-[#0d0d0f]" style={{ height: '100vh' }}>
      <TopBar />
      <div className="flex flex-1 min-h-0">
        {/* Left: problem */}
        <div className="w-[380px] xl:w-[420px] flex-shrink-0 border-r border-[#2a2a35] flex flex-col min-h-0">
          <div className="flex border-b border-[#2a2a35] flex-shrink-0">
            {['Description','Hints'].map(tab=>(
              <button key={tab} onClick={()=>setActiveTab(tab.toLowerCase())}
                className={`px-4 py-3 text-xs font-medium transition-colors ${activeTab===tab.toLowerCase()?'text-white border-b-2 border-[#6c63ff]':'text-[#7a7a8a] hover:text-white'}`}>
                {tab}
              </button>
            ))}
          </div>
          <ProblemPanel />
        </div>

        {/* Right: editor + console */}
        <div className="flex-1 flex flex-col min-h-0 min-w-0">
          <div className="flex-1 min-h-0">
            <Editor height="100%"
              language={LANGUAGES.find(l=>l.id===lang)?.monacoId||'javascript'}
              value={code} onChange={v=>setCode(v||'')} theme="vs-dark"
              options={{fontSize:14,fontFamily:"'JetBrains Mono','Fira Code',monospace",fontLigatures:true,minimap:{enabled:false},padding:{top:16,bottom:16},scrollBeyondLastLine:false,wordWrap:'on',lineNumbers:'on',tabSize:2,insertSpaces:true,formatOnPaste:true,quickSuggestions:true,bracketPairColorization:{enabled:true},guides:{bracketPairs:true}}} />
          </div>
          <div className="flex-shrink-0 border-t border-[#2a2a35] bg-[#141416]" style={{minHeight:220,maxHeight:320}}>
            <div className="flex items-center border-b border-[#2a2a35]">
              {[{id:'testcases',label:'Test Cases'},{id:'results',label:'Results'},{id:'customInput',label:'Custom Input'}].map(tab=>(
                <button key={tab.id} onClick={()=>setActiveTab(tab.id)}
                  className={`px-4 py-2.5 text-xs font-medium transition-colors ${activeTab===tab.id?'text-white border-b-2 border-[#6c63ff]':'text-[#7a7a8a] hover:text-white'}`}>
                  {tab.label}
                </button>
              ))}
              {verdict && (
                <div className={`ml-auto mr-3 px-3 py-1 rounded-full text-xs font-bold ${verdict.type==='accepted'?'bg-green-400/15 text-green-400':'bg-red-400/15 text-red-400'}`}>
                  {verdict.type==='accepted'?'✓ Accepted':`✗ ${verdict.verdict}`}
                </div>
              )}
            </div>
            <ConsolePanel />
          </div>
        </div>
      </div>
    </div>
  );
}