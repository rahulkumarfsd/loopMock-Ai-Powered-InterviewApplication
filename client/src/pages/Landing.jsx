import { AlertTriangle, ArrowRight, Bot, Brain, Building2, Check, CheckCircle2, Code2, FileText, MessageSquare, Mic, Play, Radar, Sparkles, Terminal, Upload, Users, Video, Wand2, Wifi, Zap } from "lucide-react";
import { Link} from 'react-router-dom';
import Login          from './Login';
import Register       from './Register';
import AuthCallback   from './AuthCallback';


export default function Landing() {
  return (
    <main className="dark min-h-screen bg-background text-foreground" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      <style dangerouslySetInnerHTML={{ __html: `:root {
  --radius: 0.75rem;
  /* Dark-only premium SaaS palette */
  --background: oklch(0.16 0.015 265);
  --foreground: oklch(0.97 0.005 250);
  --card: oklch(0.20 0.018 265);
  --card-foreground: oklch(0.97 0.005 250);
  --popover: oklch(0.20 0.018 265);
  --popover-foreground: oklch(0.97 0.005 250);
  --primary: oklch(0.72 0.18 280);
  --primary-foreground: oklch(0.16 0.015 265);
  --secondary: oklch(0.26 0.02 265);
  --secondary-foreground: oklch(0.97 0.005 250);
  --muted: oklch(0.24 0.018 265);
  --muted-foreground: oklch(0.68 0.02 260);
  --accent: oklch(0.72 0.16 200);
  --accent-foreground: oklch(0.16 0.015 265);
  --destructive: oklch(0.65 0.22 25);
  --destructive-foreground: oklch(0.97 0.005 250);
  --border: oklch(0.30 0.02 265 / 60%);
  --input: oklch(0.30 0.02 265);
  --ring: oklch(0.72 0.18 280);
  --success: oklch(0.75 0.17 155);
  --warning: oklch(0.82 0.16 80);
  --brand: oklch(0.72 0.18 280);
  --brand-2: oklch(0.78 0.15 210);

  --gradient-brand: linear-gradient(135deg, oklch(0.72 0.18 280), oklch(0.78 0.15 210));
  --gradient-hero: radial-gradient(1200px 600px at 50% -10%, oklch(0.72 0.18 280 / 0.25), transparent 60%),
                   radial-gradient(800px 400px at 80% 10%, oklch(0.78 0.15 210 / 0.18), transparent 60%),
                   radial-gradient(600px 400px at 10% 30%, oklch(0.75 0.17 155 / 0.10), transparent 60%);
  --gradient-card: linear-gradient(180deg, oklch(0.24 0.02 265 / 0.6), oklch(0.18 0.018 265 / 0.6));
  --shadow-glow: 0 0 60px -10px oklch(0.72 0.18 280 / 0.45);
  --shadow-card: 0 10px 40px -10px oklch(0 0 0 / 0.5);

  --sidebar: oklch(0.18 0.018 265);
  --sidebar-foreground: oklch(0.97 0.005 250);
  --sidebar-primary: oklch(0.72 0.18 280);
  --sidebar-primary-foreground: oklch(0.16 0.015 265);
  --sidebar-accent: oklch(0.26 0.02 265);
  --sidebar-accent-foreground: oklch(0.97 0.005 250);
  --sidebar-border: oklch(0.30 0.02 265 / 60%);
  --sidebar-ring: oklch(0.72 0.18 280);
}

@layer base {
  * {
    border-color: var(--color-border);
  }
  html, body {
    background-color: var(--color-background);
    color: var(--color-foreground);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
  }
}

@layer utilities {
  .bg-hero-radial { background-image: var(--gradient-hero); }
  .bg-gradient-brand { background-image: var(--gradient-brand); }
  .text-gradient-brand {
    background-image: var(--gradient-brand);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .glass {
    background: oklch(0.22 0.018 265 / 0.55);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border: 1px solid oklch(1 0 0 / 0.06);
  }
  .glass-strong {
    background: oklch(0.22 0.018 265 / 0.75);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid oklch(1 0 0 / 0.08);
  }
  .shadow-glow { box-shadow: var(--shadow-glow); }
  .shadow-card { box-shadow: var(--shadow-card); }
  .grid-bg {
    background-image:
      linear-gradient(to right, oklch(1 0 0 / 0.04) 1px, transparent 1px),
      linear-gradient(to bottom, oklch(1 0 0 / 0.04) 1px, transparent 1px);
    background-size: 56px 56px;
    mask-image: radial-gradient(ellipse at 50% 0%, black 30%, transparent 75%);
  }
  .ring-border-soft { box-shadow: inset 0 0 0 1px oklch(1 0 0 / 0.06); }
  .animate-float { animation: float 6s ease-in-out infinite; }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
  .animate-pulse-glow {
    animation: pulseGlow 3s ease-in-out infinite;
  }
  @keyframes pulseGlow {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }
  .marquee {
    animation: marquee 30s linear infinite;
  }
  @keyframes marquee {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }
}
` }} />
      <Nav />
      <Hero />
      <Stats />
      <Features />
      <Feedback />
      <CodingEnv />
      <SkillRadar />
      <Resume />
      <Companies />
      <PeerRooms />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}

// ===================== Nav =====================
function Nav() {
  const links = [
    { label: "Features", href: "#features" },
    { label: "Coding", href: "#coding" },
    { label: "Companies", href: "#companies" },
    { label: "Pricing", href: "#pricing" },
    { label: "Docs", href: "#faq" },
  ];
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto mt-4 max-w-6xl px-4">
        <div className="glass-strong flex items-center justify-between rounded-2xl px-4 py-2.5 shadow-card">
          <a href="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-brand shadow-glow">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </span>
            <span className="text-sm font-semibold tracking-tight">LoopMock</span>
            <span className="ml-2 hidden rounded-full border border-border bg-secondary/60 px-2 py-0.5 text-[10px] text-muted-foreground sm:inline">
              v2.0 · AI Native
            </span>
          </a>
          <nav className="hidden items-center gap-6 md:flex">
            {links.map((l) => (
              <a key={l.label} href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {/* <a href="#" className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline">Sign in</a> */}
            <Link to="/register" className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline">Sign in</Link>
            <a
              href="#cta"
              className="rounded-lg bg-gradient-brand px-3.5 py-2 text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:scale-[1.02]"
            >
              Start Mock Interview
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

// ===================== Hero =====================
function Hero() {
  return (
    <section className="relative overflow-hidden pt-36 pb-24">
      <div className="absolute inset-0 bg-hero-radial" />
      <div className="absolute inset-0 grid-bg" />
      <div className="relative mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-success" />
            Powered by Groq · Llama 3.1 · Real-time inference
          </div>
          <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight sm:text-6xl md:text-7xl">
            Ace technical interviews with an{" "}
            <span className="text-gradient-brand">AI recruiter</span> that actually grades you.
          </h1>
          <p className="mt-6 text-pretty text-lg text-muted-foreground">
            LoopMock simulates FAANG-grade mock interviews across DSA, system design, frontend, backend, and behavioral rounds — with instant recruiter-style feedback after every answer.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="#cta" className="group inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-3 text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:scale-[1.02]">
              Start Mock Interview
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a href="#preview" className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary/50 px-5 py-3 text-sm font-medium text-foreground backdrop-blur transition-colors hover:bg-secondary">
              <Play className="h-4 w-4" /> Watch 60s demo
            </a>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-brand" /> AI feedback in &lt;2s</span>
            <span className="inline-flex items-center gap-1.5"><Mic className="h-3.5 w-3.5 text-brand-2" /> Voice & text modes</span>
            <span className="inline-flex items-center gap-1.5"><Terminal className="h-3.5 w-3.5 text-success" /> Judge0 code execution</span>
          </div>
        </div>

        {/* Hero visualization */}
        <div id="preview" className="relative mx-auto mt-16 max-w-5xl">
          <div className="absolute -inset-8 -z-10 bg-gradient-brand opacity-20 blur-3xl" />
          <div className="glass-strong rounded-2xl p-3 shadow-card">
            <div className="flex items-center gap-2 px-3 py-2">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
              <div className="ml-3 rounded-md bg-secondary/60 px-2 py-0.5 text-[11px] text-muted-foreground">
                LoopMock.app / interview / amazon-sde2 / round-2
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 rounded-xl bg-background/60 p-3 md:grid-cols-12">
              {/* Interviewer panel */}
              <div className="md:col-span-5 rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-brand text-xs font-semibold text-primary-foreground">AI</div>
                  <div>
                    <div className="text-sm font-medium">Senior Recruiter · Amazon</div>
                    <div className="text-[11px] text-muted-foreground">Round 2 · System Design · 45 min</div>
                  </div>
                  <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[10px] text-success">
                    <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-success" /> Live
                  </span>
                </div>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="rounded-lg bg-secondary/60 p-3 text-muted-foreground">
                    Design a URL shortener that handles 10K writes/sec. Walk me through your data model, hashing strategy, and how you'd scale reads.
                  </div>
                  <div className="rounded-lg bg-gradient-brand/10 p-3">
                    <div className="text-[11px] uppercase tracking-wider text-brand">Your answer · transcribing</div>
                    <p className="mt-1 text-foreground/90">I'd use base62 encoding over an auto-incrementing ID, shard by hash prefix, and front the read path with a Redis LRU cache...</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <button className="inline-flex items-center gap-2 rounded-lg bg-gradient-brand px-3 py-2 text-xs font-medium text-primary-foreground">
                    <Mic className="h-3.5 w-3.5" /> Recording
                  </button>
                  <span className="text-[11px] text-muted-foreground">02:14 / 45:00</span>
                </div>
              </div>

              {/* Feedback panel */}
              <div className="md:col-span-7 rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Real-time AI evaluation</div>
                  <span className="rounded-full bg-secondary/60 px-2 py-0.5 text-[10px] text-muted-foreground">Updates every 3s</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { k: "Correctness", v: 88 },
                    { k: "Depth", v: 74 },
                    { k: "Clarity", v: 92 },
                    { k: "Communication", v: 81 },
                  ].map((m) => (
                    <div key={m.k} className="rounded-lg border border-border bg-background/50 p-3">
                      <div className="text-[11px] text-muted-foreground">{m.k}</div>
                      <div className="mt-1 text-2xl font-semibold tabular-nums">{m.v}</div>
                      <div className="mt-2 h-1 overflow-hidden rounded-full bg-secondary">
                        <div className="h-full bg-gradient-brand" style={{ width: `${m.v}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-start gap-2 rounded-lg bg-success/10 p-2.5 text-success">
                    <span>✓</span> Strong tradeoff reasoning on cache eviction.
                  </div>
                  <div className="flex items-start gap-2 rounded-lg bg-warning/10 p-2.5 text-warning">
                    <span>!</span> Missed: discuss collision handling for hash truncation.
                  </div>
                  <div className="flex items-start gap-2 rounded-lg bg-secondary/50 p-2.5 text-muted-foreground">
                    <span>›</span> Suggest adding back-of-envelope: 10K writes/sec → 864M/day → ~10 TB/year.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logos */}
        <div className="mt-16">
          <p className="text-center text-xs uppercase tracking-widest text-muted-foreground">
            Trained on interview patterns from
          </p>
          <div className="mt-5 grid grid-cols-2 items-center gap-6 opacity-70 sm:grid-cols-3 md:grid-cols-6">
            {["Google", "Amazon", "Meta", "Stripe", "Microsoft", "TCS"].map((n) => (
              <div key={n} className="text-center text-sm font-semibold tracking-tight text-muted-foreground">{n}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ===================== Stats =====================
function Stats() {
  const stats = [
    { n: "150K+", l: "Mock interviews completed" },
    { n: "92%", l: "Report higher confidence" },
    { n: "3.4×", l: "More offers vs. self-prep" },
    { n: "<2s", l: "Median AI feedback latency" },
  ];
  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="glass-strong grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.l} className="bg-card/60 p-6 text-center">
              <div className="text-3xl font-semibold text-gradient-brand sm:text-4xl">{s.n}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===================== Features =====================
const features = [
  { icon: Bot, title: "AI mock interviews", desc: "Multi-round simulations across DSA, system design, frontend, backend, and behavioral." },
  { icon: Zap, title: "Instant feedback", desc: "Recruiter-style scoring on correctness, depth, clarity, and communication after every answer." },
  { icon: Code2, title: "LeetCode-grade coding", desc: "Monaco editor with Judge0 execution across 40+ languages and test cases." },
  { icon: Radar, title: "Skill analytics", desc: "Performance radar, weakness mapping, and improvement trajectories over time." },
  { icon: FileText, title: "Resume analyzer", desc: "Upload your resume — get tailored interview questions for every project & skill." },
  { icon: Users, title: "Peer mock rooms", desc: "Live peer-to-peer interview rooms with WebSocket sync, video & shared editor." },
  { icon: Mic, title: "Voice or text", desc: "Realistic voice interviews with live transcription or low-bandwidth text mode." },
  { icon: Brain, title: "Adaptive difficulty", desc: "AI tracks your level and ramps questions to match your target company bar." },
];

function Features() {
  return (
    <section id="features" className="relative py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <span className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs text-muted-foreground">Why LoopMock</span>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Every tool you need to <span className="text-gradient-brand">crack the loop</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            One workspace replacing LeetCode, Pramp, Interviewing.io and your hiring manager's brain.
          </p>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40">
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-brand opacity-0 blur-2xl transition-opacity group-hover:opacity-30" />
              <div className="relative">
                <div className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-secondary/60">
                  <f.icon className="h-5 w-5 text-brand" />
                </div>
                <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===================== Feedback =====================
function Feedback() {
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs text-muted-foreground">Live AI feedback</span>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Feedback that reads like a <span className="text-gradient-brand">senior recruiter wrote it</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Our evaluator model breaks down every answer across five axes — and gives you the exact phrasing, tradeoff, or data structure you missed.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Granular scoring: correctness, depth, clarity, communication, problem solving",
                "Line-by-line code review with complexity analysis",
                "Behavioral STAR framework auto-detection",
                "Follow-up questions the interviewer would have asked",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2 text-foreground/90">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-success" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 -z-10 bg-gradient-brand opacity-20 blur-3xl" />
            <div className="glass rounded-2xl p-5 shadow-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Sparkles className="h-4 w-4 text-brand" /> Evaluation · Two Sum (Optimized)
                </div>
                <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] text-success">Score 92</span>
              </div>
              <pre className="mt-4 overflow-x-auto rounded-lg bg-background/70 p-3 text-[12px] leading-relaxed text-foreground/90"><code>{`function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (seen.has(diff)) return [seen.get(diff), i];
    seen.set(nums[i], i);
  }
}`}</code></pre>
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex items-start gap-2 rounded-lg bg-success/10 p-2.5 text-success">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5" /> Optimal O(n) with single-pass hash map. Clear naming.
                </div>
                <div className="flex items-start gap-2 rounded-lg bg-warning/10 p-2.5 text-warning">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5" /> Add explicit return for "no match" case — interviewers flag this.
                </div>
                <div className="flex items-start gap-2 rounded-lg bg-secondary/60 p-2.5 text-muted-foreground">
                  Time O(n) · Space O(n). Discuss tradeoff vs. two-pointer on sorted array.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===================== CodingEnv =====================
function CodingEnv() {
  return (
    <section id="coding" className="relative py-28">
      <div className="absolute inset-0 -z-10 bg-hero-radial opacity-50" />
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <span className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs text-muted-foreground">Coding environment</span>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            A real IDE. <span className="text-gradient-brand">Real execution.</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Monaco editor + Judge0 CE backend. 40+ languages, hidden test cases, complexity hints, and AI-assisted hints when you're stuck.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          <div className="flex items-center justify-between border-b border-border bg-background/60 px-4 py-2.5">
            <div className="flex items-center gap-2 text-xs">
              <span className="rounded-md bg-secondary/60 px-2 py-1 text-foreground">two-sum.ts</span>
              <span className="rounded-md px-2 py-1 text-muted-foreground">binary-tree-level.ts</span>
              <span className="rounded-md px-2 py-1 text-muted-foreground">lru-cache.ts</span>
            </div>
            <button className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-brand px-3 py-1.5 text-xs font-medium text-primary-foreground">
              <Play className="h-3.5 w-3.5" /> Run
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <aside className="border-r border-border bg-background/40 p-4 text-xs lg:col-span-3">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Problem</div>
              <div className="mt-2 text-sm font-medium">Two Sum · Medium</div>
              <p className="mt-3 text-muted-foreground">Given an array of integers <code className="rounded bg-secondary/60 px-1">nums</code> and an integer <code className="rounded bg-secondary/60 px-1">target</code>, return indices of the two numbers such that they add up to target.</p>
              <div className="mt-4 space-y-2">
                <div className="rounded-md bg-secondary/40 p-2">
                  <div className="text-[10px] uppercase text-muted-foreground">Example</div>
                  <code className="text-foreground">nums = [2,7,11,15], target = 9 → [0,1]</code>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {["Array", "Hash Map", "Amazon", "Google"].map((t) => (
                  <span key={t} className="rounded-full border border-border bg-secondary/40 px-2 py-0.5 text-[10px] text-muted-foreground">{t}</span>
                ))}
              </div>
            </aside>
            <div className="bg-[oklch(0.14_0.015_265)] p-4 font-mono text-[12.5px] leading-relaxed lg:col-span-6">
              <pre className="text-foreground/90"><code>{`// TypeScript · O(n) time, O(n) space
function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (map.has(need)) return [map.get(need)!, i];
    map.set(nums[i], i);
  }
  return [];
}`}</code></pre>
            </div>
            <aside className="border-l border-border bg-background/40 p-4 text-xs lg:col-span-3">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Test cases</div>
              <ul className="mt-2 space-y-1.5">
                {[
                  ["[2,7,11,15], 9", "[0,1]", true],
                  ["[3,2,4], 6", "[1,2]", true],
                  ["[3,3], 6", "[0,1]", true],
                  ["[1,5,9], 14", "[1,2]", true],
                ].map(([inp, out, ok], i) => (
                  <li key={i} className="flex items-center justify-between rounded-md bg-secondary/40 px-2 py-1.5">
                    <span className="truncate text-muted-foreground">{inp}</span>
                    <CheckCircle2 className={`h-3.5 w-3.5 ${ok ? "text-success" : "text-destructive"}`} />
                  </li>
                ))}
              </ul>
              <div className="mt-4 rounded-md border border-border bg-card p-2.5">
                <div className="text-[10px] uppercase text-muted-foreground">AI Hint</div>
                <p className="mt-1 text-foreground/90">Track previously seen values in a map; constant-time lookup avoids the O(n²) brute force.</p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===================== SkillRadar =====================
function SkillRadar() {
  const axes = ["DSA", "System Design", "Frontend", "Backend", "Behavioral", "Communication"];
  const cx = 160, cy = 160, r = 120;
  const angle = (i) => (Math.PI * 2 * i) / axes.length - Math.PI / 2;
  const point = (i, v) => {
    const rr = r * v;
    return [cx + Math.cos(angle(i)) * rr, cy + Math.sin(angle(i)) * rr];
  };
  const values = [0.86, 0.62, 0.78, 0.7, 0.55, 0.82];
  const target = [0.9, 0.85, 0.8, 0.85, 0.75, 0.9];

  const poly = (vals) =>
    vals.map((v, i) => point(i, v).join(",")).join(" ");

  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative order-2 lg:order-1">
            <div className="absolute -inset-6 -z-10 bg-gradient-brand opacity-20 blur-3xl" />
            <div className="glass rounded-2xl p-6 shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Skill performance · last 30 days</div>
                  <div className="text-[11px] text-muted-foreground">vs. Google L4 target bar</div>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-brand" /> You</span>
                  <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-accent" /> Target</span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-center">
                <svg viewBox="0 0 320 320" className="h-[320px] w-[320px]">
                  {[0.25, 0.5, 0.75, 1].map((s, i) => (
                    <polygon
                      key={i}
                      points={axes.map((_, j) => point(j, s).join(",")).join(" ")}
                      fill="none"
                      stroke="oklch(1 0 0 / 0.06)"
                    />
                  ))}
                  {axes.map((_, i) => {
                    const [x, y] = point(i, 1);
                    return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="oklch(1 0 0 / 0.06)" />;
                  })}
                  <polygon points={poly(target)} fill="oklch(0.78 0.15 210 / 0.15)" stroke="oklch(0.78 0.15 210)" strokeWidth="1.5" />
                  <polygon points={poly(values)} fill="oklch(0.72 0.18 280 / 0.25)" stroke="oklch(0.72 0.18 280)" strokeWidth="2" />
                  {axes.map((label, i) => {
                    const [x, y] = point(i, 1.18);
                    return (
                      <text key={label} x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="fill-muted-foreground" style={{ fontSize: 11 }}>
                        {label}
                      </text>
                    );
                  })}
                </svg>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-3 text-center text-xs">
                <div className="rounded-lg border border-border bg-background/40 p-3">
                  <div className="text-muted-foreground">Sessions</div>
                  <div className="text-xl font-semibold">42</div>
                </div>
                <div className="rounded-lg border border-border bg-background/40 p-3">
                  <div className="text-muted-foreground">Streak</div>
                  <div className="text-xl font-semibold">17d 🔥</div>
                </div>
                <div className="rounded-lg border border-border bg-background/40 p-3">
                  <div className="text-muted-foreground">Improvement</div>
                  <div className="text-xl font-semibold text-success">+18%</div>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <span className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs text-muted-foreground">Skill analytics</span>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Know exactly <span className="text-gradient-brand">where you stand</span> on the hiring bar
            </h2>
            <p className="mt-4 text-muted-foreground">
              The performance radar maps your strengths against the target role's expected bar — so you stop grinding random LeetCode and start fixing the right gaps.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              {[
                ["Topic-level mastery", "Per-subtopic depth: graphs, DP, sharding, CAP, React fiber..."],
                ["Trajectory tracking", "30/60/90 day improvement curves & regression alerts"],
                ["Bar comparison", "FAANG, mid-cap, startup, and TCS preset bars"],
                ["Daily streak", "Habit loop with intelligent rest days"],
              ].map(([t, d]) => (
                <div key={t} className="rounded-xl border border-border bg-card p-4">
                  <div className="font-medium">{t}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===================== Resume =====================
function Resume() {
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs text-muted-foreground">Resume analyzer</span>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Drop your resume. <span className="text-gradient-brand">Get grilled.</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              We parse every bullet, every project, every keyword — then generate the exact deep-dive questions interviewers will ask. No surprises in the loop.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-3 text-center text-sm">
              {[
                { n: "12", l: "Projects parsed" },
                { n: "48", l: "Questions generated" },
                { n: "94%", l: "Hit rate vs real loops" },
              ].map((s) => (
                <div key={s.l} className="rounded-xl border border-border bg-card p-4">
                  <div className="text-2xl font-semibold">{s.n}</div>
                  <div className="text-xs text-muted-foreground">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 -z-10 bg-gradient-brand opacity-20 blur-3xl" />
            <div className="glass rounded-2xl p-5 shadow-card">
              <div className="flex items-center gap-3 rounded-xl border border-dashed border-border bg-background/40 p-4">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-secondary/60">
                  <FileText className="h-5 w-5 text-brand" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">arjun_sde2_resume.pdf</div>
                  <div className="text-[11px] text-muted-foreground">128 KB · parsed in 1.4s</div>
                </div>
                <button className="inline-flex items-center gap-1.5 rounded-lg bg-secondary/70 px-2.5 py-1.5 text-xs">
                  <Upload className="h-3.5 w-3.5" /> Replace
                </button>
              </div>
              <div className="mt-5 space-y-3">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1.5">
                  <Wand2 className="h-3.5 w-3.5 text-brand" /> Generated interview questions
                </div>
                {[
                  ["Distributed cache project", "Walk me through your cache invalidation strategy and how you handled the thundering herd."],
                  ["React performance work", "How did you measure re-renders before/after, and which React APIs did you reach for?"],
                  ["Internship at Razorpay", "What was the most difficult technical tradeoff you owned, and what did you learn?"],
                  ["Open source PR", "Tell me about the design discussion on that PR — how did you handle review feedback?"],
                ].map(([tag, q]) => (
                  <div key={q} className="rounded-xl border border-border bg-card p-3.5">
                    <div className="text-[10px] uppercase tracking-wider text-brand">{tag}</div>
                    <div className="mt-1 text-sm text-foreground/90">{q}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===================== Companies =====================
const companies = [
  { name: "Google", role: "L3 / L4 SWE", focus: "Algorithms · System Design · Googliness", color: "from-blue-500/30 to-cyan-400/20" },
  { name: "Amazon", role: "SDE I / SDE II", focus: "DSA · Leadership Principles · Design", color: "from-orange-500/30 to-yellow-400/20" },
  { name: "Meta", role: "E3 / E4", focus: "Product Sense · Coding · Behavioral", color: "from-indigo-500/30 to-blue-400/20" },
  { name: "Microsoft", role: "SDE / SDE II", focus: "DS&A · Low-level Design · Culture", color: "from-emerald-500/30 to-teal-400/20" },
  { name: "Stripe", role: "Software Engineer", focus: "Integration Q · API Design · Bug Hunt", color: "from-violet-500/30 to-fuchsia-400/20" },
  { name: "TCS / Infosys", role: "Campus Placements", focus: "Aptitude · Core CS · HR Round", color: "from-rose-500/30 to-pink-400/20" },
];

function Companies() {
  return (
    <section id="companies" className="relative py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <span className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs text-muted-foreground">Company-specific prep</span>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Practice the <span className="text-gradient-brand">exact loop</span> you'll face
          </h2>
          <p className="mt-4 text-muted-foreground">
            Curated question banks, rubrics, and recruiter personas modeled on actual interview loops at top companies.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((c) => (
            <div key={c.name} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-transform hover:-translate-y-0.5">
              <div className={`absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br ${c.color} blur-2xl opacity-60`} />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-secondary/50">
                    <Building2 className="h-5 w-5 text-foreground/80" />
                  </div>
                  <span className="rounded-full bg-secondary/50 px-2 py-0.5 text-[10px] text-muted-foreground">{c.role}</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold">{c.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{c.focus}</p>
                <div className="mt-5 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">240+ questions · 6 mock rounds</span>
                  <span className="text-brand transition-transform group-hover:translate-x-1">Practice →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===================== PeerRooms =====================
function PeerRooms() {
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative">
            <div className="absolute -inset-6 -z-10 bg-gradient-brand opacity-20 blur-3xl" />
            <div className="glass rounded-2xl p-5 shadow-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[10px] text-success">
                    <Wifi className="h-3 w-3" /> Connected · 32ms
                  </span>
                  <span className="rounded-full bg-secondary/60 px-2 py-0.5 text-[10px] text-muted-foreground">Room #4F92</span>
                </div>
                <span className="text-[11px] text-muted-foreground">45:00 timer</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  { name: "You · Interviewee", color: "from-violet-500/40 to-indigo-500/30" },
                  { name: "Priya · Interviewer", color: "from-cyan-500/40 to-emerald-500/30" },
                ].map((p) => (
                  <div key={p.name} className={`relative aspect-video overflow-hidden rounded-xl border border-border bg-gradient-to-br ${p.color}`}>
                    <div className="absolute inset-0 grid place-items-center">
                      <Video className="h-7 w-7 text-foreground/70" />
                    </div>
                    <div className="absolute bottom-2 left-2 rounded bg-background/70 px-2 py-0.5 text-[10px]">{p.name}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-xl border border-border bg-background/40 p-3 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MessageSquare className="h-3.5 w-3.5" /> Shared notepad · synced
                </div>
                <pre className="mt-2 whitespace-pre-wrap font-mono text-foreground/90">{`Q: Design a rate limiter
- Token bucket vs leaky bucket
- Redis INCR + TTL for distributed
- Sliding window log for accuracy`}</pre>
              </div>
            </div>
          </div>
          <div>
            <span className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs text-muted-foreground">Live peer mock rooms</span>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Match with peers. <span className="text-gradient-brand">Interview each other.</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              WebSocket-powered rooms with HD video, shared Monaco editor, synced timer, and AI-generated question packs. Get human pressure with AI scaffolding.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              {[
                [Users, "Smart matching", "By skill, target company, and timezone"],
                [Video, "WebRTC video", "Sub-100ms peer-to-peer streaming"],
                [MessageSquare, "Shared editor", "Realtime cursors, language switcher"],
                [Wifi, "AI moderator", "Drops hints, scores both sides post-call"],
              ].map(([Icon, t, d]) => {
                const I = Icon;
                return (
                  <div key={t} className="rounded-xl border border-border bg-card p-4">
                    <I className="h-4 w-4 text-brand" />
                    <div className="mt-2 font-medium">{t}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{d}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===================== Testimonials =====================
const items = [
  { name: "Arjun M.", role: "SDE I @ Amazon", quote: "Did 28 mock rounds on LoopMock. The behavioral feedback was scarily accurate — my real Amazon loop felt like a replay." },
  { name: "Sophia K.", role: "Frontend @ Stripe", quote: "The skill radar finally told me to stop grinding DP and fix my system design. Offer in 6 weeks." },
  { name: "Ravi S.", role: "TCS Digital · Final Round", quote: "Aptitude + HR mocks were spot on. Cleared TCS NQT with the highest band." },
  { name: "Lena P.", role: "L4 @ Google", quote: "The AI follow-up questions are sharper than half the human interviewers I've had. Wild." },
  { name: "Daniel O.", role: "Backend @ Meta", quote: "Peer rooms + AI moderator is a cheat code. We ran daily mocks for 3 weeks and both of us got offers." },
  { name: "Anjali T.", role: "Placement '25", quote: "Resume analyzer generated the EXACT questions my Microsoft interviewer asked. I almost cried." },
];

function Testimonials() {
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <span className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs text-muted-foreground">Offers, not opinions</span>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Engineers who <span className="text-gradient-brand">actually got the job</span>
          </h2>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <figure key={t.name} className="rounded-2xl border border-border bg-card p-5">
              <blockquote className="text-sm text-foreground/90">"{t.quote}"</blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-brand text-xs font-semibold text-primary-foreground">
                  {t.name.split(" ").map((p) => p[0]).join("")}
                </div>
                <div>
                  <div className="text-sm font-medium">{t.name}</div>
                  <div className="text-[11px] text-muted-foreground">{t.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===================== Pricing =====================
const tiers = [
  {
    name: "Free",
    price: "$0",
    sub: "Forever",
    features: ["3 AI mock interviews / month", "Basic feedback report", "DSA problem library", "Community peer rooms"],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$19",
    sub: "/ month",
    features: [
      "Unlimited AI mock interviews",
      "Full recruiter-grade evaluation",
      "Skill radar & analytics",
      "Resume analyzer",
      "Voice mode + transcripts",
      "Company-specific question packs",
    ],
    cta: "Go Pro",
    highlight: true,
  },
  {
    name: "Campus",
    price: "Custom",
    sub: "For colleges & bootcamps",
    features: ["Cohort dashboards", "Bulk seats & SSO", "Placement readiness reports", "Dedicated success engineer"],
    cta: "Talk to us",
    highlight: false,
  },
];

function Pricing() {
  return (
    <section id="pricing" className="relative py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <span className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs text-muted-foreground">Pricing</span>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Less than <span className="text-gradient-brand">one rejected loop</span>
          </h2>
          <p className="mt-4 text-muted-foreground">Cancel anytime. Student & campus discounts available.</p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative rounded-2xl border p-6 ${
                t.highlight
                  ? "border-primary/50 bg-card shadow-glow"
                  : "border-border bg-card"
              }`}
            >
              {t.highlight && (
                <span className="absolute -top-3 left-6 rounded-full bg-gradient-brand px-2.5 py-1 text-[10px] font-medium text-primary-foreground">
                  Most popular
                </span>
              )}
              <div className="text-sm font-medium text-muted-foreground">{t.name}</div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-semibold">{t.price}</span>
                <span className="text-sm text-muted-foreground">{t.sub}</span>
              </div>
              <ul className="mt-6 space-y-2.5 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-success" /> {f}
                  </li>
                ))}
              </ul>
              <button
                className={`mt-6 w-full rounded-xl px-4 py-2.5 text-sm font-medium transition-transform hover:scale-[1.01] ${
                  t.highlight
                    ? "bg-gradient-brand text-primary-foreground shadow-glow"
                    : "border border-border bg-secondary/60 text-foreground"
                }`}
              >
                {t.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===================== FAQ =====================
const faqs = [
  ["Is LoopMock really like a real interview?", "Our recruiter personas are tuned per company using actual loop rubrics. Most users say it's harder than the real thing — which is the point."],
  ["Which languages does the code editor support?", "40+ via Judge0 CE — TypeScript, Python, Java, C++, Go, Rust, Kotlin, Swift, and more."],
  ["Do you store my voice or video?", "Voice is transcribed in real-time and discarded by default. Peer video is fully peer-to-peer via WebRTC. You can opt-in to keep recordings."],
  ["Can my college get bulk access?", "Yes — Campus tier supports cohorts up to 5,000 seats with placement-readiness dashboards."],
  ["Which AI powers the feedback?", "Llama 3.1 served via Groq for sub-second inference, with a custom evaluator on top trained on interview rubrics."],
];

function FAQ() {
  return (
    <section id="faq" className="relative py-28">
      <div className="mx-auto max-w-3xl px-4">
        <div className="text-center">
          <span className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs text-muted-foreground">FAQ</span>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Questions, <span className="text-gradient-brand">answered.</span>
          </h2>
        </div>
        <div className="mt-10 space-y-3">
          {faqs.map(([q, a]) => (
            <details key={q} className="group rounded-xl border border-border bg-card p-5 open:bg-card">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium">
                {q}
                <span className="text-muted-foreground transition-transform group-open:rotate-45">＋</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===================== CTA =====================
function CTA() {
  return (
    <section id="cta" className="relative py-28">
      <div className="mx-auto max-w-5xl px-4">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-10 text-center shadow-card sm:p-16">
          <div className="absolute inset-0 -z-10 bg-hero-radial opacity-80" />
          <div className="absolute inset-0 -z-10 grid-bg" />
          <h2 className="mx-auto max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Your next loop starts <span className="text-gradient-brand">tonight.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Spin up a mock interview in 10 seconds. No credit card. Get a recruiter-grade scorecard before bed.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="#" className="group inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-3 text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:scale-[1.02]">
              Start Mock Interview
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a href="#pricing" className="rounded-xl border border-border bg-secondary/50 px-5 py-3 text-sm font-medium backdrop-blur transition-colors hover:bg-secondary">
              View pricing
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===================== Footer =====================
function Footer() {
  const cols = [
    { title: "Product", links: ["AI Interviews", "Coding Env", "Skill Radar", "Resume Analyzer", "Peer Rooms"] },
    { title: "Companies", links: ["Google", "Amazon", "Meta", "Stripe", "TCS"] },
    { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
    { title: "Legal", links: ["Privacy", "Terms", "Security"] },
  ];
  return (
    <footer className="relative border-t border-border py-14">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-6">
          <div className="col-span-2">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-brand">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </span>
              <span className="text-sm font-semibold">LoopMock</span>
            </div>
            <p className="mt-3 max-w-xs text-xs text-muted-foreground">
              The AI-native interview prep platform for engineers shipping toward their next offer.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <div className="text-xs font-semibold">{c.title}</div>
              <ul className="mt-3 space-y-2">
                {c.links.map((l) => (
                  <li key={l}><a href="#" className="text-xs text-muted-foreground hover:text-foreground">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} LoopMock Inc. All rights reserved.</span>
          <span>Built with React · Groq · Judge0 · Socket.io</span>
        </div>
      </div>
    </footer>
  );
}
