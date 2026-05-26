import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { codingService } from '../services';
import Spinner from '../components/ui/Spinner';
import toast from 'react-hot-toast';

// ── Language configs ──────────────────────────────────
const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript', monacoId: 'javascript' },
  { id: 'python',     label: 'Python',     monacoId: 'python'     },
  { id: 'java',       label: 'Java',       monacoId: 'java'       },
  { id: 'cpp',        label: 'C++',        monacoId: 'cpp'        },
  { id: 'typescript', label: 'TypeScript', monacoId: 'typescript' },
  { id: 'go',         label: 'Go',         monacoId: 'go'         },
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
  easy:   { text: 'text-green-400',  bg: 'bg-green-400/10 text-green-400' },
  medium: { text: 'text-yellow-400', bg: 'bg-yellow-400/10 text-yellow-400' },
  hard:   { text: 'text-red-400',    bg: 'bg-red-400/10 text-red-400' },
};

export default function CodingInterview() {
  const { id }   = useParams();
  const navigate = useNavigate();

  // Problem list state
  const [problems,   setProblems]   = useState([]);
  const [loadingList,setLoadingList]= useState(true);
  const [filter,     setFilter]     = useState({ difficulty: 'all', search: '' });
  const [page,       setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Active problem state
  const [problem,    setProblem]    = useState(null);
  const [loadingProb,setLoadingProb]= useState(false);

  // Editor state
  const [lang,       setLang]       = useState('javascript');
  const [code,       setCode]       = useState(STARTER.javascript);
  const [customInput,setCustomInput]= useState('');
  const [useCustom,  setUseCustom]  = useState(false);

  // Results state
  const [results,    setResults]    = useState(null);
  const [running,    setRunning]    = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [verdict,    setVerdict]    = useState(null); // { type, passed, total, time }
  const [activeTab,  setActiveTab]  = useState('testcases'); // testcases | results | customInput

  // ── Load problem list ─────────────────────────────
  useEffect(() => {
    if (id) return; // in problem view
    fetchProblems();
  }, [filter.difficulty, page]);

  const fetchProblems = async () => {
    setLoadingList(true);
    try {
      const params = { page, limit: 20 };
      if (filter.difficulty !== 'all') params.difficulty = filter.difficulty;
      if (filter.search) params.search = filter.search;
      const { data } = await codingService.getProblems(params);
      setProblems(data.problems || []);
      setTotalPages(data.pages || 1);
    } catch {
      toast.error('Failed to load problems');
    } finally {
      setLoadingList(false);
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      setPage(1);
      fetchProblems();
    }
  };

  // ── Load problem by ID ────────────────────────────
  useEffect(() => {
    if (!id) return;
    loadProblem(id);
  }, [id]);

  const loadProblem = async (problemId) => {
    setLoadingProb(true);
    setProblem(null);
    setResults(null);
    setVerdict(null);
    try {
      const { data } = await codingService.getProblem(problemId);
      setProblem(data.problem);
      // Load starter code for current language
      const starter = data.problem?.coding?.starterCode?.[lang] || STARTER[lang];
      setCode(starter);
      setActiveTab('testcases');
    } catch {
      toast.error('Problem not found');
      navigate('/coding');
    } finally {
      setLoadingProb(false);
    }
  };

  // ── Language change ───────────────────────────────
  const changeLang = (newLang) => {
    setLang(newLang);
    const starter = problem?.coding?.starterCode?.[newLang] || STARTER[newLang];
    setCode(starter);
    setResults(null);
    setVerdict(null);
  };

  // ── Run code ──────────────────────────────────────
  const run = async () => {
    if (!code.trim()) return toast.error('Write some code first');
    setRunning(true);
    setResults(null);
    setVerdict(null);
    setActiveTab('results');
    try {
      const { data } = await codingService.runCode({
        code,
        language:    lang,
        problemId:   problem?._id,
        customInput: useCustom ? customInput : undefined,
      });
      setResults(data.results || []);
      const passed = data.results?.filter((r) => r.passed).length || 0;
      const total  = data.results?.length || 0;
      toast.success(`${passed}/${total} test cases passed`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Execution failed');
    } finally {
      setRunning(false);
    }
  };

  // ── Submit ────────────────────────────────────────
  const submit = async () => {
    if (!problem?._id)  return toast.error('No problem selected');
    if (!code.trim())   return toast.error('Write some code first');
    setSubmitting(true);
    setResults(null);
    setVerdict(null);
    setActiveTab('results');
    try {
      const { data } = await codingService.submitCode({ code, language: lang, problemId: problem._id });
      setResults(data.results || []);
      setVerdict({ type: data.allPassed ? 'accepted' : 'wrong', ...data });
      if (data.allPassed) {
        toast.success(`Accepted! ${data.passed}/${data.total} passed in ${data.maxTime}s 🎉`);
      } else {
        toast.error(`${data.verdict}: ${data.passed}/${data.total} test cases passed`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const resetCode = () => {
    const starter = problem?.coding?.starterCode?.[lang] || STARTER[lang];
    setCode(starter);
    setResults(null);
    setVerdict(null);
    toast('Code reset to starter');
  };

  // ── PROBLEM LIST VIEW ─────────────────────────────
  if (!id) return (
    <div className="min-h-screen bg-[#0d0d0f]">
      {/* Header */}
      <div className="border-b border-[#2a2a35] px-6 py-4 flex items-center gap-4">
        <h1 className="font-display text-lg font-bold text-white">Problems</h1>
        <div className="flex gap-2 ml-4">
          {['all', 'easy', 'medium', 'hard'].map((d) => (
            <button key={d} onClick={() => { setFilter(f => ({ ...f, difficulty: d })); setPage(1); }}
              className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all
                ${filter.difficulty === d
                  ? d === 'easy' ? 'bg-green-400/20 text-green-400'
                  : d === 'medium' ? 'bg-yellow-400/20 text-yellow-400'
                  : d === 'hard' ? 'bg-red-400/20 text-red-400'
                  : 'bg-[#6c63ff]/20 text-[#a78bfa]'
                  : 'bg-[#212128] text-[#7a7a8a] hover:text-white'}`}>
              {d}
            </button>
          ))}
        </div>
        <div className="flex-1 max-w-sm ml-auto">
          <input
            className="w-full bg-[#212128] border border-[#2a2a35] text-white rounded-xl px-4 py-2 text-sm placeholder:text-[#4a4a5a] focus:outline-none focus:border-[#6c63ff]"
            placeholder="Search problems…"
            value={filter.search}
            onChange={(e) => setFilter(f => ({ ...f, search: e.target.value }))}
            onKeyDown={handleSearch}
          />
        </div>
      </div>

      {/* Problem table */}
      <div className="px-6 py-4">
        {loadingList ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : problems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#7a7a8a] mb-3">No problems found</p>
            <p className="text-xs text-[#4a4a5a]">
              Run <code className="bg-[#212128] px-2 py-0.5 rounded text-[#c0c0cc]">node data/seed.js</code> to populate the question bank
            </p>
          </div>
        ) : (
          <>
            {/* Table header */}
            <div className="grid grid-cols-12 text-xs text-[#4a4a5a] uppercase tracking-wider pb-3 border-b border-[#2a2a35]">
              <div className="col-span-1">#</div>
              <div className="col-span-5">Title</div>
              <div className="col-span-2">Difficulty</div>
              <div className="col-span-2">Topic</div>
              <div className="col-span-2">Companies</div>
            </div>

            {/* Rows */}
            {problems.map((p, i) => (
              <div key={p._id}
                className="grid grid-cols-12 items-center py-3.5 border-b border-[#2a2a35] hover:bg-[#1a1a1f] cursor-pointer transition-colors group"
                onClick={() => navigate(`/coding/${p._id}`)}>
                <div className="col-span-1 text-xs text-[#4a4a5a]">{(page - 1) * 20 + i + 1}</div>
                <div className="col-span-5">
                  <span className="text-sm text-white group-hover:text-[#a78bfa] transition-colors font-medium">
                    {p.title}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className={`text-xs font-medium capitalize ${DIFF_COLOR[p.difficulty]?.text || 'text-[#7a7a8a]'}`}>
                    {p.difficulty}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-xs text-[#7a7a8a] capitalize">{p.topic?.replace(/-/g, ' ')}</span>
                </div>
                <div className="col-span-2 flex gap-1 flex-wrap">
                  {p.company?.slice(0, 2).map((c) => (
                    <span key={c} className="text-[10px] bg-[#212128] text-[#7a7a8a] px-1.5 py-0.5 rounded capitalize">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-6">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-4 py-2 bg-[#212128] text-[#7a7a8a] rounded-lg text-sm disabled:opacity-40 hover:text-white transition-colors">
                  ← Prev
                </button>
                <span className="text-sm text-[#7a7a8a]">Page {page} of {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="px-4 py-2 bg-[#212128] text-[#7a7a8a] rounded-lg text-sm disabled:opacity-40 hover:text-white transition-colors">
                  Next 
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  // ── PROBLEM SOLVING VIEW (LeetCode layout) ────────
  if (loadingProb) return (
    <div className="flex h-screen items-center justify-center bg-[#0d0d0f]">
      <Spinner size="lg" />
    </div>
  );

  if (!problem) return null;

  const visibleTests = problem.coding?.testCases?.filter((t) => !t.isHidden) || [];

  return (
    <div className="flex flex-col bg-[#0d0d0f]" style={{ height: '100vh' }}>

      {/* ── Top bar ── */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-[#2a2a35] bg-[#141416] flex-shrink-0">
        <button onClick={() => navigate('/coding')}
          className="text-[#7a7a8a] hover:text-white text-sm transition-colors flex items-center gap-1.5">
          ← Problems
        </button>
        <div className="w-px h-4 bg-[#2a2a35]" />
        <span className="text-white text-sm font-medium truncate">{problem.title}</span>
        <span className={`text-xs font-medium capitalize px-2 py-0.5 rounded ${DIFF_COLOR[problem.difficulty]?.bg}`}>
          {problem.difficulty}
        </span>
        <div className="flex-1" />
        {/* Language selector */}
        <select
          value={lang}
          onChange={(e) => changeLang(e.target.value)}
          className="bg-[#212128] border border-[#2a2a35] text-white text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#6c63ff]">
          {LANGUAGES.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
        </select>
        <button onClick={resetCode} className="text-xs text-[#7a7a8a] hover:text-white transition-colors px-2 py-1.5">
          ↺ Reset
        </button>
        <button onClick={run} disabled={running || submitting}
          className="flex items-center gap-1.5 bg-[#212128] border border-[#2a2a35] hover:border-[#35354a] text-white text-xs px-4 py-1.5 rounded-lg transition-all disabled:opacity-50">
          {running ? <><Spinner size="sm" /> Running…</> : '▶ Run'}
        </button>
        <button onClick={submit} disabled={running || submitting}
          className="flex items-center gap-1.5 bg-[#10d98c] hover:bg-[#0ec47e] text-[#0d0d0f] font-semibold text-xs px-4 py-1.5 rounded-lg transition-all disabled:opacity-50">
          {submitting ? <><Spinner size="sm" /> Submitting…</> : 'Submit'}
        </button>
      </div>

      {/* ── Main 2-column layout ── */}
      <div className="flex flex-1 min-h-0">

        {/* ── LEFT: Problem description ── */}
        <div className="w-[420px] flex-shrink-0 border-r border-[#2a2a35] flex flex-col min-h-0">
          {/* Tabs */}
          <div className="flex border-b border-[#2a2a35] flex-shrink-0">
            {['Description', 'Hints'].map((tab) => (
              <button key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`px-4 py-3 text-xs font-medium transition-colors
                  ${activeTab === tab.toLowerCase()
                    ? 'text-white border-b-2 border-[#6c63ff]'
                    : 'text-[#7a7a8a] hover:text-white'}`}>
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-auto p-5">
            {/* Problem statement */}
            <div className="prose prose-sm prose-invert max-w-none">
              {/* Format body — split on \n\n for paragraphs */}
              {problem.body.split('\n\n').map((para, i) => {
                // Code block detection
                if (para.startsWith('```') || para.includes('Input:') || para.includes('Output:')) {
                  return (
                    <pre key={i} className="bg-[#1a1a1f] border border-[#2a2a35] rounded-xl p-4 text-xs font-mono text-[#c0c0cc] whitespace-pre-wrap my-3">
                      {para.replace(/```\w*/g, '').replace(/```/g, '').trim()}
                    </pre>
                  );
                }
                return <p key={i} className="text-sm text-[#c0c0cc] leading-relaxed mb-3">{para}</p>;
              })}
            </div>

            {/* Examples */}
            {problem.coding?.examples?.length > 0 && (
              <div className="mt-5">
                {problem.coding.examples.map((ex, i) => (
                  <div key={i} className="mb-4">
                    <p className="text-xs font-semibold text-white mb-2">Example {i + 1}</p>
                    <div className="bg-[#1a1a1f] border border-[#2a2a35] rounded-xl p-4 font-mono text-xs space-y-1.5">
                      <div><span className="text-[#7a7a8a]">Input: </span><span className="text-[#c0c0cc]">{ex.input}</span></div>
                      <div><span className="text-[#7a7a8a]">Output: </span><span className="text-[#c0c0cc]">{ex.output}</span></div>
                      {ex.explanation && <div className="pt-1.5 border-t border-[#2a2a35]"><span className="text-[#7a7a8a]">Explanation: </span><span className="text-[#c0c0cc]">{ex.explanation}</span></div>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Constraints */}
            {problem.coding?.constraints?.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-white mb-2">Constraints</p>
                <ul className="space-y-1">
                  {problem.coding.constraints.map((c, i) => (
                    <li key={i} className="text-xs text-[#7a7a8a] font-mono">• {c}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Companies */}
            {problem.company?.length > 0 && (
              <div className="mt-5 pt-4 border-t border-[#2a2a35]">
                <p className="text-xs text-[#4a4a5a] mb-2">Companies</p>
                <div className="flex flex-wrap gap-1.5">
                  {problem.company.map((c) => (
                    <span key={c} className="text-[10px] bg-[#212128] text-[#7a7a8a] px-2 py-0.5 rounded capitalize border border-[#2a2a35]">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {problem.tags?.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-[#4a4a5a] mb-2">Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {problem.tags.map((t) => (
                    <span key={t} className="text-[10px] bg-[#6c63ff]/10 text-[#a78bfa] px-2 py-0.5 rounded border border-[#6c63ff]/20">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Hints tab */}
            {activeTab === 'hints' && problem.hints?.length > 0 && (
              <div className="mt-4 space-y-3">
                {problem.hints.map((h, i) => (
                  <details key={i} className="bg-[#1a1a1f] border border-[#2a2a35] rounded-xl overflow-hidden">
                    <summary className="px-4 py-3 text-xs text-[#a78bfa] cursor-pointer select-none hover:text-[#6c63ff] transition-colors">
                      Hint {i + 1}
                    </summary>
                    <p className="px-4 pb-3 text-xs text-[#7a7a8a] leading-relaxed">{h}</p>
                  </details>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: Editor + Console ── */}
        <div className="flex-1 flex flex-col min-h-0 min-w-0">

          {/* Monaco Editor */}
          <div className="flex-1 min-h-0">
            <Editor
              height="100%"
              language={LANGUAGES.find(l => l.id === lang)?.monacoId || 'javascript'}
              value={code}
              onChange={(v) => setCode(v || '')}
              theme="vs-dark"
              options={{
                fontSize:              14,
                fontFamily:            "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
                fontLigatures:         true,
                minimap:               { enabled: false },
                padding:               { top: 16, bottom: 16 },
                scrollBeyondLastLine:  false,
                wordWrap:              'on',
                lineNumbers:           'on',
                renderLineHighlight:   'line',
                tabSize:               2,
                insertSpaces:          true,
                formatOnPaste:         true,
                suggestOnTriggerCharacters: true,
                quickSuggestions:      true,
                bracketPairColorization: { enabled: true },
                guides: { bracketPairs: true },
              }}
            />
          </div>

          {/* ── Bottom console ── */}
          <div className="flex-shrink-0 border-t border-[#2a2a35] bg-[#141416]" style={{ minHeight: 220, maxHeight: 320 }}>
            {/* Console tabs */}
            <div className="flex items-center border-b border-[#2a2a35]">
              {[
                { id: 'testcases',   label: 'Test Cases' },
                { id: 'results',     label: 'Results' },
                { id: 'customInput', label: 'Custom Input' },
              ].map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 text-xs font-medium transition-colors
                    ${activeTab === tab.id ? 'text-white border-b-2 border-[#6c63ff]' : 'text-[#7a7a8a] hover:text-white'}`}>
                  {tab.label}
                </button>
              ))}
              {/* Verdict badge */}
              {verdict && (
                <div className={`ml-auto mr-3 px-3 py-1 rounded-full text-xs font-bold
                  ${verdict.type === 'accepted' ? 'bg-green-400/15 text-green-400' : 'bg-red-400/15 text-red-400'}`}>
                  {verdict.type === 'accepted' ? '✓ Accepted' : `✗ ${verdict.verdict}`}
                </div>
              )}
            </div>

            <div className="overflow-auto p-4" style={{ maxHeight: 260 }}>

              {/* Test cases tab */}
              {activeTab === 'testcases' && (
                <div className="space-y-3">
                  {visibleTests.length === 0 ? (
                    <p className="text-xs text-[#4a4a5a]">No visible test cases — click Run to test with custom input</p>
                  ) : visibleTests.map((tc, i) => (
                    <div key={i}>
                      <p className="text-xs text-[#7a7a8a] mb-1.5">Case {i + 1}</p>
                      <div className="bg-[#0d0d0f] border border-[#2a2a35] rounded-lg p-3 font-mono text-xs text-[#c0c0cc] whitespace-pre-wrap">
                        <span className="text-[#7a7a8a]">Input: </span>{tc.input}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Results tab */}
              {activeTab === 'results' && (
                <div>
                  {!results && !running && !submitting && (
                    <p className="text-xs text-[#4a4a5a]">Run or submit your code to see results</p>
                  )}
                  {(running || submitting) && (
                    <div className="flex items-center gap-2 text-[#7a7a8a] text-xs">
                      <Spinner size="sm" />
                      <span>{submitting ? 'Running all test cases…' : 'Running visible test cases…'}</span>
                    </div>
                  )}
                  {results && (
                    <div className="space-y-3">
                      {/* Summary row */}
                      {verdict && (
                        <div className={`flex items-center gap-3 p-3 rounded-xl border text-sm font-medium
                          ${verdict.type === 'accepted'
                            ? 'bg-green-400/5 border-green-400/20 text-green-400'
                            : 'bg-red-400/5 border-red-400/20 text-red-400'}`}>
                          {verdict.type === 'accepted' ? '✓ Accepted' : `✗ ${verdict.verdict}`}
                          <span className="text-xs font-normal ml-auto text-[#7a7a8a]">
                            {verdict.passed}/{verdict.total} · {verdict.maxTime}s
                          </span>
                        </div>
                      )}
                      {/* Per test case */}
                      {results.map((r, i) => (
                        <div key={i} className={`rounded-xl border p-3 ${r.passed ? 'border-green-400/20 bg-green-400/5' : 'border-red-400/20 bg-red-400/5'}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-xs font-bold ${r.passed ? 'text-green-400' : 'text-red-400'}`}>
                              {r.passed ? '✓ Passed' : '✗ Failed'}
                            </span>
                            {r.isHidden && <span className="text-[10px] text-[#4a4a5a] bg-[#212128] px-1.5 py-0.5 rounded">hidden</span>}
                            <span className="text-[10px] text-[#4a4a5a] ml-auto">{r.time}s</span>
                          </div>
                          {r.stdout && (
                            <div className="font-mono text-xs text-[#c0c0cc] bg-[#0d0d0f] rounded-lg p-2.5 mb-1.5 whitespace-pre-wrap">
                              <span className="text-[#4a4a5a]">Output: </span>{r.stdout}
                            </div>
                          )}
                          {r.stderr && (
                            <div className="font-mono text-xs text-red-400 bg-red-400/5 rounded-lg p-2.5 whitespace-pre-wrap">
                              {r.stderr}
                            </div>
                          )}
                          {r.compile && (
                            <div className="font-mono text-xs text-yellow-400 bg-yellow-400/5 rounded-lg p-2.5 whitespace-pre-wrap">
                              <span className="text-[#4a4a5a]">Compile: </span>{r.compile}
                            </div>
                          )}
                          {!r.passed && !r.stderr && !r.compile && (
                            <div className="text-xs text-[#7a7a8a]">{r.statusDesc || 'Wrong Answer'}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Custom input tab */}
              {activeTab === 'customInput' && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <label className="flex items-center gap-2 text-xs text-[#7a7a8a] cursor-pointer">
                      <input type="checkbox" checked={useCustom} onChange={(e) => setUseCustom(e.target.checked)}
                        className="rounded" />
                      Use custom input instead of test cases
                    </label>
                  </div>
                  <textarea
                    className="w-full bg-[#0d0d0f] border border-[#2a2a35] rounded-lg p-3 text-xs font-mono text-[#c0c0cc] focus:outline-none focus:border-[#6c63ff] resize-none"
                    rows={5}
                    placeholder="Enter custom input here (stdin)…"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                  />
                  <p className="text-[10px] text-[#4a4a5a] mt-1.5">
                    When enabled, Run will use this input instead of the built-in test cases
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}