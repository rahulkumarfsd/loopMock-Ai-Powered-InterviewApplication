import { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  Brain,
  Building2,
  Check,
  CheckCircle2,
  Code2,
  FileText,
  MessageSquare,
  Mic,
  Menu,
  X,
  Play,
  Radar,
  Sparkles,
  Terminal,
  Upload,
  Users,
  Video,
  Wand2,
  Wifi,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import AuthCallback from "./AuthCallback";

export default function Landing() {
  return (
    <main
      className="dark min-h-screen bg-background text-foreground overflow-x-hidden"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `:root {
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
`,
        }}
      />
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

function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const links = [
    { label: "Features", href: "#features" },
    { label: "Coding", href: "#coding" },
    { label: "Companies", href: "#companies" },
    { label: "Pricing", href: "#pricing" },
    { label: "Docs", href: "#faq" },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50">
  <div className="mx-auto max-w-7xl px-4 pt-4">
    <div className="rounded-2xl border border-white/10 bg-background/70 backdrop-blur-xl shadow-2xl">
      <div className="flex h-16 items-center justify-between px-6">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand shadow-glow">
            <Sparkles className="h-5 w-5 text-white" />
          </div>

          <div className="flex flex-col">
            <span className="bg-gradient-brand bg-clip-text text-transparent text-lg font-bold tracking-tight">
              LoopMock
            </span>

            <span className="hidden sm:block text-[11px] text-muted-foreground">
              AI Interview Platform
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="group relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}

              <span className="absolute -bottom-1 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-4">

          <div className="hidden lg:flex items-center gap-2 rounded-full border border-border/50 px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-muted-foreground">
              AI Engine Online
            </span>
          </div>

          <Link
            to="/register"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Sign In
          </Link>

          <Link
            to="/register"
            className="rounded-xl bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-all duration-300 hover:scale-[1.03] hover:shadow-xl"
          >
            Start Free Interview
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden rounded-lg p-2 text-muted-foreground hover:bg-secondary"
        >
          {isOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="border-t border-border/40 md:hidden">
          <div className="flex flex-col gap-4 p-6">

            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                {link.label}
              </a>
            ))}

            <div className="my-2 h-px bg-border/40" />

            <Link
              to="/register"
              onClick={() => setIsOpen(false)}
              className="text-sm text-muted-foreground"
            >
              Sign In
            </Link>

            <Link
              to="/register"
              onClick={() => setIsOpen(false)}
              className="rounded-xl bg-gradient-brand px-4 py-3 text-center text-sm font-semibold text-white"
            >
              Start Free Interview
            </Link>
          </div>
        </div>
      )}
    </div>
  </div>
</header>
  );
}

// ===================== Hero =====================
function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 sm:pt-36 pb-16 sm:pb-24">
      <div className="absolute inset-0 bg-hero-radial" />
      <div className="absolute inset-0 grid-bg" />
      <div className="relative mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-3 py-1 text-[11px] sm:text-xs text-muted-foreground backdrop-blur max-w-full overflow-hidden text-ellipsis">
            <span className="h-1.5 w-1.5 flex-shrink-0 animate-pulse rounded-full bg-green-500" />{" "}
            <span className="truncate">
              Powered by Groq · Llama 3.1 · Real-time inference
            </span>
          </div>
          <h1 className="mt-6 max-w-5xl mx-auto text-center text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl leading-[1.05]">
            {" "}
            Stop guessing.
            <br />
            Start interviewing with{" "}
            <span className="text-gradient-brand">AI-powered feedback.</span>
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
            Experience realistic mock interviews and receive recruiter-style
            evaluations, scores, and actionable insights after every response.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 px-4 sm:px-0">
            <a
              href="#cta"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-brand px-5 py-3 text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:scale-[1.02]"
            >
              Start Mock Interview
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#preview"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary/50 px-5 py-3 text-sm font-medium text-foreground backdrop-blur transition-colors hover:bg-secondary"
            >
              <Play className="h-4 w-4" /> Watch 60s demo
            </a>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-y-3 sm:gap-x-6 text-xs text-muted-foreground border-t border-border/20 pt-6 sm:border-0 sm:pt-0">
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-brand" /> AI feedback in
              &lt;2s
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Mic className="h-3.5 w-3.5 text-brand-2" /> Voice & text modes
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5 text-success" /> Judge0 code
              execution
            </span>
          </div>
        </div>

        <div id="preview" className="relative mx-auto mt-12 sm:mt-16 max-w-5xl">
          <div className="absolute -inset-4 sm:-inset-8 -z-10 bg-gradient-brand opacity-20 blur-3xl" />
          <div className="glass-strong rounded-2xl p-2 sm:p-3 shadow-card">
            <div className="flex flex-wrap items-center gap-2 px-3 py-2 border-b border-border/40 sm:border-0 mb-2 sm:mb-0">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-destructive/70 animate-pulse" />
                <span className="h-2.5 w-2.5 rounded-full bg-warning/70 animate-pulse" />
                <span className="h-2.5 w-2.5 rounded-full bg-success/70 animate-pulse" />
              </div>
              <div className="ml-0 sm:ml-3 rounded-md bg-secondary/60 px-2 py-0.5 text-[10px] sm:text-[11px] text-muted-foreground truncate max-w-xs sm:max-w-none">
                LoopMock.app / interview / amazon-sde2 / round-2
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 rounded-xl bg-background/60 p-2 sm:p-3 lg:grid-cols-12">
              <div className="lg:col-span-5 rounded-xl border border-border bg-card p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-brand text-xs font-semibold text-primary-foreground">
                      AI
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        Senior Recruiter · Amazon
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        Round 2 · System Design · 45 min
                      </div>
                    </div>
                    <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[10px] text-success">
                      <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-success" />{" "}
                      Live
                    </span>
                  </div>
                  <div className="mt-4 space-y-3 text-sm">
                    <div className="rounded-lg bg-secondary/60 p-3 text-muted-foreground">
                      Design a URL shortener that handles 10K writes/sec. Walk
                      me through your data model, hashing strategy, and how
                      you'd scale reads.
                    </div>
                    <div className="rounded-lg bg-gradient-brand/10 p-3">
                      <div className="text-[11px] uppercase tracking-wider text-brand">
                        Your answer · transcribing
                      </div>
                      <p className="mt-1 text-foreground/90 text-xs sm:text-sm">
                        I'd use base62 encoding over an auto-incrementing ID,
                        shard by hash prefix, and front the read path with a
                        Redis LRU cache...
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-4 lg:border-0 lg:pt-0">
                  <button className="inline-flex items-center gap-2 rounded-lg bg-gradient-brand px-3 py-2 text-xs font-medium text-primary-foreground">
                    <Mic className="h-3.5 w-3.5" /> Recording
                  </button>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    02:14 / 45:00
                  </span>
                </div>
              </div>

              <div className="lg:col-span-7 rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">
                    Real-time AI evaluation
                  </div>
                  <span className="rounded-full bg-secondary/60 px-2 py-0.5 text-[10px] text-muted-foreground">
                    Updates every 3s
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {[
                    { k: "Correctness", v: 88 },
                    { k: "Depth", v: 74 },
                    { k: "Clarity", v: 92 },
                    { k: "Communication", v: 81 },
                  ].map((m) => (
                    <div
                      key={m.k}
                      className="rounded-lg border border-border bg-background/50 p-2.5 sm:p-3"
                    >
                      <div className="text-[10px] sm:text-[11px] text-muted-foreground truncate">
                        {m.k}
                      </div>
                      <div className="mt-0.5 text-xl sm:text-2xl font-semibold tabular-nums">
                        {m.v}
                      </div>
                      <div className="mt-2 h-1 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full bg-gradient-brand"
                          style={{ width: `${m.v}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-start gap-2 rounded-lg bg-success/10 p-2.5 text-success">
                    <span className="font-bold">✓</span>{" "}
                    <p>Strong tradeoff reasoning on cache eviction.</p>
                  </div>
                  <div className="flex items-start gap-2 rounded-lg bg-warning/10 p-2.5 text-warning">
                    <span className="font-bold">!</span>{" "}
                    <p>
                      Missed: discuss collision handling for hash truncation.
                    </p>
                  </div>
                  <div className="flex items-start gap-2 rounded-lg bg-secondary/50 p-2.5 text-muted-foreground">
                    <span className="font-bold">›</span>{" "}
                    <p>
                      Suggest adding back-of-envelope: 10K writes/sec (~10
                      TB/year).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 sm:mt-20">
          <p className="text-center text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground">
            Trained on interview patterns from
          </p>
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 items-center justify-center opacity-60">
            {["Google", "Amazon", "Meta", "Stripe", "Microsoft", "TCS"].map(
              (n) => (
                <div
                  key={n}
                  className="text-center text-sm font-semibold tracking-tight text-muted-foreground py-2 border border-border/20 rounded-xl bg-secondary/10 sm:border-0 sm:bg-transparent"
                >
                  {n}
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { n: "150K+", l: "Mock interviews completed" },
    { n: "92%", l: "Report higher confidence" },
    { n: "3.4×", l: "More offers vs. self-prep" },
    { n: "<2s", l: "Median AI feedback latency" },
  ];
  return (
    <section className="relative py-12 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="glass-strong grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden rounded-2xl border border-border">
          {stats.map((s) => (
            <div key={s.l} className="bg-card/60 p-6 text-center">
              <div className="text-3xl font-semibold text-gradient-brand sm:text-4xl">
                {s.n}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const features = [
  {
    icon: Bot,
    title: "AI mock interviews",
    desc: "Multi-round simulations across DSA, system design, frontend, backend, and behavioral.",
  },
  {
    icon: Zap,
    title: "Instant feedback",
    desc: "Recruiter-style scoring on correctness, depth, clarity, and communication after every answer.",
  },
  {
    icon: Code2,
    title: "LeetCode-grade coding",
    desc: "Monaco editor with Judge0 execution across 40+ languages and test cases.",
  },
  {
    icon: Radar,
    title: "Skill analytics",
    desc: "Performance radar, weakness mapping, and improvement trajectories over time.",
  },
  {
    icon: FileText,
    title: "Resume analyzer",
    desc: "Upload your resume — get tailored interview questions for every project & skill.",
  },
  {
    icon: Users,
    title: "Peer mock rooms",
    desc: "Live peer-to-peer interview rooms with WebSocket sync, video & shared editor.",
  },
  {
    icon: Mic,
    title: "Voice or text",
    desc: "Realistic voice interviews with live transcription or low-bandwidth text mode.",
  },
  {
    icon: Brain,
    title: "Adaptive difficulty",
    desc: "AI tracks your level and ramps questions to match your target company bar.",
  },
];

function Features() {
  return (
    <section id="features" className="relative py-16 sm:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <span className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs text-muted-foreground">
            Why LoopMock
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Every tool you need to{" "}
            <span className="text-gradient-brand">crack the loop</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground">
            One workspace replacing LeetCode, Pramp, Interviewing.io and your
            hiring manager's brain.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
            >
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

function Feedback() {
  return (
    <section className="relative py-16 sm:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs text-muted-foreground">
              Live AI feedback
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              Feedback that reads like a{" "}
              <span className="text-gradient-brand">
                senior recruiter wrote it
              </span>
            </h2>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground">
              Our evaluator model breaks down every answer across five axes —
              and gives you the exact phrasing, tradeoff, or data structure you
              missed.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Granular scoring: correctness, depth, clarity, communication, problem solving",
                "Line-by-line code review with complexity analysis",
                "Behavioral STAR framework auto-detection",
                "Follow-up questions the interviewer would have asked",
              ].map((t) => (
                <li
                  key={t}
                  className="flex items-start gap-2 text-foreground/90"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />{" "}
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative overflow-hidden w-full max-w-full">
            <div className="absolute -inset-6 -z-10 bg-gradient-brand opacity-20 blur-3xl" />
            <div className="glass rounded-2xl p-4 sm:p-5 shadow-card overflow-x-auto">
              <div className="flex items-center justify-between min-w-[280px]">
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <Sparkles className="h-4 w-4 text-brand" /> Evaluation · Two
                  Sum
                </div>
                <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] text-success">
                  Score 92
                </span>
              </div>
              <pre className="mt-4 overflow-x-auto rounded-lg bg-background/70 p-3 text-[11px] sm:text-[12px] leading-relaxed text-foreground/90 font-mono">
                <code>{`function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (seen.has(diff)) return [seen.get(diff), i];
    seen.set(nums[i], i);
  }
}`}</code>
              </pre>
              <div className="mt-4 space-y-2 text-xs min-w-[280px]">
                <div className="flex items-start gap-2 rounded-lg bg-success/10 p-2.5 text-success">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />{" "}
                  <span>Optimal O(n) single-pass. Clear naming.</span>
                </div>
                <div className="flex items-start gap-2 rounded-lg bg-warning/10 p-2.5 text-warning">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />{" "}
                  <span>Add explicit fallback return case.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CodingEnv() {
  return (
    <section id="coding" className="relative py-16 sm:py-28">
      <div className="absolute inset-0 -z-10 bg-hero-radial opacity-50" />
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <span className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs text-muted-foreground">
            Coding environment
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            A real IDE.{" "}
            <span className="text-gradient-brand">Real execution.</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground">
            Monaco editor + Judge0 CE backend. 40+ languages, hidden test cases,
            complexity hints, and AI-assisted support.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          <div className="flex items-center justify-between border-b border-border bg-background/60 px-4 py-2.5 gap-2">
            <div className="flex items-center gap-1 sm:gap-2 text-xs overflow-x-auto scrollbar-none whitespace-nowrap py-1">
              <span className="rounded-md bg-secondary/60 px-2 py-1 text-foreground">
                two-sum.ts
              </span>
              <span className="rounded-md px-2 py-1 text-muted-foreground opacity-60 sm:opacity-100">
                binary-tree.ts
              </span>
              <span className="rounded-md px-2 py-1 text-muted-foreground hidden sm:inline">
                lru-cache.ts
              </span>
            </div>
            <button className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-brand px-3 py-1.5 text-xs font-medium text-primary-foreground flex-shrink-0">
              <Play className="h-3.5 w-3.5" /> Run
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <aside className="border-b lg:border-b-0 lg:border-r border-border bg-background/40 p-4 text-xs lg:col-span-3">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Problem
              </div>
              <div className="mt-1.5 text-sm font-medium">Two Sum · Medium</div>
              <p className="mt-2.5 text-muted-foreground leading-relaxed">
                Given an array of integers{" "}
                <code className="rounded bg-secondary/60 px-1 font-mono">
                  nums
                </code>{" "}
                and target value, return index pairs.
              </p>
              <div className="mt-4 hidden sm:block rounded-md bg-secondary/40 p-2 font-mono">
                <div className="text-[10px] uppercase text-muted-foreground">
                  Example
                </div>
                <code className="text-foreground text-[11px]">
                  nums = [2,7,11], target = 9 -&gt; [0,1]
                </code>
              </div>
            </aside>
            <div className="bg-[oklch(0.14_0.015_265)] p-4 font-mono text-[12px] sm:text-[13px] leading-relaxed lg:col-span-6 overflow-x-auto">
              <pre className="text-foreground/90">
                <code>{`// TypeScript · O(n) time, O(n) space
function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (map.has(need)) return [map.get(need)!, i];
    map.set(nums[i], i);
  }
  return [];
}`}</code>
              </pre>
            </div>
            <aside className="border-t lg:border-t-0 lg:border-l border-border bg-background/40 p-4 text-xs lg:col-span-3 space-y-4">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
                  Test cases
                </div>
                <ul className="space-y-1.5 font-mono text-[11px]">
                  <li className="flex items-center justify-between rounded-md bg-secondary/40 px-2 py-1.5">
                    <span className="truncate text-muted-foreground">
                      [2,7,11,15], 9
                    </span>
                    <CheckCircle2 className="h-3.5 w-3.5 text-success flex-shrink-0 ml-1" />
                  </li>
                  <li className="flex items-center justify-between rounded-md bg-secondary/40 px-2 py-1.5">
                    <span className="truncate text-muted-foreground">
                      [3,2,4], 6
                    </span>
                    <CheckCircle2 className="h-3.5 w-3.5 text-success flex-shrink-0 ml-1" />
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}

function SkillRadar() {
  const axes = [
    "DSA",
    "System Design",
    "Frontend",
    "Backend",
    "Behavioral",
    "Communication",
  ];
  const cx = 160,
    cy = 160,
    r = 120;
  const angle = (i) => (Math.PI * 2 * i) / axes.length - Math.PI / 2;
  const point = (i, v) => {
    const rr = r * v;
    return [cx + Math.cos(angle(i)) * rr, cy + Math.sin(angle(i)) * rr];
  };
  const values = [0.86, 0.62, 0.78, 0.7, 0.55, 0.82];
  const target = [0.9, 0.85, 0.8, 0.85, 0.75, 0.9];

  const poly = (vals) => vals.map((v, i) => point(i, v).join(",")).join(" ");

  return (
    <section className="relative py-16 sm:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative order-2 lg:order-1 w-full overflow-hidden">
            <div className="absolute -inset-6 -z-10 bg-gradient-brand opacity-20 blur-3xl" />
            <div className="glass rounded-2xl p-4 sm:p-6 shadow-card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-sm font-medium">
                    Skill performance · last 30 days
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    vs. Google L4 target bar
                  </div>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-brand" /> You
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-accent" /> Target
                  </span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-center overflow-x-auto py-2">
                <svg
                  viewBox="0 0 320 320"
                  className="h-[280px] w-[280px] sm:h-[320px] sm:w-[320px] flex-shrink-0"
                >
                  {[0.25, 0.5, 0.75, 1].map((s, i) => (
                    <polygon
                      key={i}
                      points={axes
                        .map((_, j) => point(j, s).join(","))
                        .join(" ")}
                      fill="none"
                      stroke="oklch(1 0 0 / 0.06)"
                    />
                  ))}
                  {axes.map((_, i) => {
                    const [x, y] = point(i, 1);
                    return (
                      <line
                        key={i}
                        x1={cx}
                        y1={cy}
                        x2={x}
                        y2={y}
                        stroke="oklch(1 0 0 / 0.06)"
                      />
                    );
                  })}
                  <polygon
                    points={poly(target)}
                    fill="oklch(0.78 0.15 210 / 0.15)"
                    stroke="oklch(0.78 0.15 210)"
                    strokeWidth="1.5"
                  />
                  <polygon
                    points={poly(values)}
                    fill="oklch(0.72 0.18 280 / 0.25)"
                    stroke="oklch(0.72 0.18 280)"
                    strokeWidth="2"
                  />
                  {axes.map((label, i) => {
                    const [x, y] = point(i, 1.2);
                    return (
                      <text
                        key={label}
                        x={x}
                        y={y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-muted-foreground font-medium"
                        style={{ fontSize: 10 }}
                      >
                        {label}
                      </text>
                    );
                  })}
                </svg>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-lg border border-border bg-background/40 p-2 sm:p-3">
                  <div className="text-[10px] sm:text-xs text-muted-foreground">
                    Sessions
                  </div>
                  <div className="text-base sm:text-xl font-semibold">42</div>
                </div>
                <div className="rounded-lg border border-border bg-background/40 p-2 sm:p-3">
                  <div className="text-[10px] sm:text-xs text-muted-foreground">
                    Streak
                  </div>
                  <div className="text-base sm:text-xl font-semibold">
                    17d 🔥
                  </div>
                </div>
                <div className="rounded-lg border border-border bg-background/40 p-2 sm:p-3">
                  <div className="text-[10px] sm:text-xs text-muted-foreground">
                    Progress
                  </div>
                  <div className="text-base sm:text-xl font-semibold text-success">
                    +18%
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <span className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs text-muted-foreground">
              Skill analytics
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              Know exactly{" "}
              <span className="text-gradient-brand">where you stand</span> on
              the hiring bar
            </h2>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground">
              The performance radar maps your strengths against standard
              corporate role configurations — tracking weak points directly.
            </p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {[
                ["Topic-level mastery", "Per-subtopic depth tracking."],
                ["Trajectory tracking", "30/60/90 day improvement curves."],
                ["Bar comparison", "Preset bar criteria."],
                ["Daily streak", "Intelligent structural habits."],
              ].map(([t, d]) => (
                <div
                  key={t}
                  className="rounded-xl border border-border bg-card p-4"
                >
                  <div className="font-medium text-sm sm:text-base">{t}</div>
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

function Resume() {
  return (
    <section className="relative py-16 sm:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs text-muted-foreground">
              Resume analyzer
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              Drop your resume.{" "}
              <span className="text-gradient-brand">Get grilled.</span>
            </h2>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground">
              We parse every project and key phrase — then generate targeted
              system questions to avoid live-interview surprises.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-2 text-center text-sm">
              {[
                { n: "12", l: "Projects parsed" },
                { n: "48", l: "Questions ready" },
                { n: "94%", l: "Hit rate match" },
              ].map((s) => (
                <div
                  key={s.l}
                  className="rounded-xl border border-border bg-card p-2 sm:p-4"
                >
                  <div className="text-xl sm:text-2xl font-semibold">{s.n}</div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground truncate">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 -z-10 bg-gradient-brand opacity-20 blur-3xl" />
            <div className="glass rounded-2xl p-4 sm:p-5 shadow-card">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-xl border border-dashed border-border bg-background/40 p-4 w-full">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-secondary/60 flex-shrink-0">
                  <FileText className="h-5 w-5 text-brand" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    arjun_resume.pdf
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    128 KB · parsed in 1.4s
                  </div>
                </div>
                <button className="inline-flex items-center gap-1.5 rounded-lg bg-secondary/70 px-2.5 py-1.5 text-xs w-full sm:w-auto justify-center">
                  <Upload className="h-3.5 w-3.5" /> Replace
                </button>
              </div>
              <div className="mt-5 space-y-3">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1.5">
                  <Wand2 className="h-3.5 w-3.5 text-brand" /> Generated deep
                  dives
                </div>
                {[
                  [
                    "Distributed cache project",
                    "Walk me through your system architecture and error state controls.",
                  ],
                  [
                    "React performance work",
                    "How did you scale interface calculations safely?",
                  ],
                ].map(([tag, q]) => (
                  <div
                    key={q}
                    className="rounded-xl border border-border bg-card p-3.5"
                  >
                    <div className="text-[10px] uppercase tracking-wider text-brand font-mono">
                      {tag}
                    </div>
                    <div className="mt-1 text-xs sm:text-sm text-foreground/90 leading-relaxed">
                      {q}
                    </div>
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

const companies = [
  {
    name: "Google",
    role: "L3 / L4 SWE",
    focus: "Algorithms · System Design · Googliness",
    color: "from-blue-500/30 to-cyan-400/20",
  },
  {
    name: "Amazon",
    role: "SDE I / SDE II",
    focus: "DSA · Leadership Principles · Design",
    color: "from-orange-500/30 to-yellow-400/20",
  },
  {
    name: "Meta",
    role: "E3 / E4",
    focus: "Product Sense · Coding · Behavioral",
    color: "from-indigo-500/30 to-blue-400/20",
  },
  {
    name: "Microsoft",
    role: "SDE / SDE II",
    focus: "DS&A · Low-level Design · Culture",
    color: "from-emerald-500/30 to-teal-400/20",
  },
  {
    name: "Stripe",
    role: "Software Engineer",
    focus: "Integration Q · API Design · Bug Hunt",
    color: "from-violet-500/30 to-fuchsia-400/20",
  },
  {
    name: "TCS / Infosys",
    role: "Campus Placements",
    focus: "Aptitude · Core CS · HR Round",
    color: "from-rose-500/30 to-pink-400/20",
  },
];

function Companies() {
  return (
    <section id="companies" className="relative py-16 sm:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <span className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs text-muted-foreground">
            Company-specific prep
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Practice the <span className="text-gradient-brand">exact loop</span>{" "}
            you'll face
          </h2>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground">
            Curated target pipelines built off structured historic rubric
            matrices.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((c) => (
            <div
              key={c.name}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-transform hover:-translate-y-0.5"
            >
              <div
                className={`absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br ${c.color} blur-2xl opacity-60`}
              />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-secondary/50">
                    <Building2 className="h-5 w-5 text-foreground/80" />
                  </div>
                  <span className="rounded-full bg-secondary/50 px-2 py-0.5 text-[10px] text-muted-foreground">
                    {c.role}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold">{c.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{c.focus}</p>
                <div className="mt-5 flex items-center justify-between text-xs border-t border-border/20 pt-4">
                  <span className="text-muted-foreground text-[11px]">
                    240+ problems available
                  </span>
                  <span className="text-brand font-medium group-hover:translate-x-1 transition-transform">
                    Practice &rarr;
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PeerRooms() {
  return (
    <section className="relative py-16 sm:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="relative w-full overflow-hidden">
            <div className="absolute -inset-6 -z-10 bg-gradient-brand opacity-20 blur-3xl" />
            <div className="glass rounded-2xl p-4 sm:p-5 shadow-card">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-3 mb-3">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[10px] text-success font-medium">
                    <Wifi className="h-3 w-3" /> Connected
                  </span>
                  <span className="rounded-full bg-secondary/60 px-2 py-0.5 text-[10px] text-muted-foreground">
                    Room #4F92
                  </span>
                </div>
                <span className="text-[11px] text-muted-foreground font-mono">
                  45:00 left
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    name: "You · Interviewee",
                    color: "from-violet-500/40 to-indigo-500/30",
                  },
                  {
                    name: "Priya · Interviewer",
                    color: "from-cyan-500/40 to-emerald-500/30",
                  },
                ].map((p) => (
                  <div
                    key={p.name}
                    className="relative aspect-video overflow-hidden rounded-xl border border-border bg-gradient-to-br bg-secondary/20"
                  >
                    <div className="absolute inset-0 grid place-items-center">
                      <Video className="h-7 w-7 text-foreground/40" />
                    </div>
                    <div className="absolute bottom-2 left-2 rounded bg-background/80 px-2 py-0.5 text-[10px] font-medium">
                      {p.name}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-xl border border-border bg-background/40 p-3 text-xs overflow-x-auto font-mono">
                <div className="flex items-center gap-2 text-muted-foreground font-sans mb-1.5">
                  <MessageSquare className="h-3.5 w-3.5" /> Shared pad synced
                </div>
                <pre className="text-foreground/90 text-[11px] leading-relaxed">{`Q: Design rate limiter
- Redis token bucket strategy
- Real-time sliding configuration`}</pre>
              </div>
            </div>
          </div>
          <div>
            <span className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs text-muted-foreground">
              Live peer mock rooms
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              Match with peers.{" "}
              <span className="text-gradient-brand">Interview each other.</span>
            </h2>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground">
              WebSocket rooms containing shared Monaco dynamic state, direct
              synchronization rules, and immediate template support.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              {[
                [Users, "Smart match", "By timezone & skill"],
                [Video, "WebRTC video", "Sub-100ms lag feed"],
                [MessageSquare, "Shared text", "Live dynamic sync cursor"],
                [Wifi, "AI mod safety", "Generates reports instantly"],
              ].map(([Icon, t, d]) => {
                const I = Icon;
                return (
                  <div
                    key={t}
                    className="rounded-xl border border-border bg-card p-3 sm:p-4"
                  >
                    <I className="h-4 w-4 text-brand" />
                    <div className="mt-2 font-medium text-xs sm:text-sm">
                      {t}
                    </div>
                    <div className="mt-0.5 text-[11px] sm:text-xs text-muted-foreground leading-tight">
                      {d}
                    </div>
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

const items = [
  {
    name: "Arjun M.",
    role: "SDE I @ Amazon",
    quote:
      "Did 28 mock rounds on LoopMock. The behavioral feedback was scarily accurate.",
  },
  {
    name: "Sophia K.",
    role: "Frontend @ Stripe",
    quote:
      "The skill radar finally told me to stop grinding DP and fix my system design. Offer in 6 weeks.",
  },
  {
    name: "Ravi S.",
    role: "TCS Digital",
    quote:
      "Aptitude + HR mocks were spot on. Cleared TCS NQT with the highest band.",
  },
];

function Testimonials() {
  return (
    <section className="relative py-16 sm:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <span className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs text-muted-foreground">
            Offers, not opinions
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Engineers who{" "}
            <span className="text-gradient-brand">got the job</span>
          </h2>
        </div>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((t) => (
            <figure
              key={t.name}
              className="rounded-2xl border border-border bg-card p-5 flex flex-col justify-between"
            >
              <blockquote className="text-sm text-foreground/90 italic">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-3 border-t border-border/20 pt-4">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-brand text-xs font-semibold text-primary-foreground flex-shrink-0">
                  {t.name
                    .split(" ")
                    .map((p) => p[0])
                    .join("")}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{t.name}</div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {t.role}
                  </div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

const tiers = [
  {
    name: "Free",
    price: "$0",
    sub: "Forever",
    features: [
      "3 AI mock interviews / month",
      "Basic feedback report",
      "DSA problem library",
    ],
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
    ],
    cta: "Go Pro",
    highlight: true,
  },
  {
    name: "Campus",
    price: "Custom",
    sub: "For colleges & bootcamps",
    features: ["Cohort dashboards", "Bulk seats & SSO", "Placement reports"],
    cta: "Talk to us",
    highlight: false,
  },
];

function Pricing() {
  return (
    <section id="pricing" className="relative py-16 sm:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <span className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs text-muted-foreground">
            Pricing
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Less than{" "}
            <span className="text-gradient-brand">one rejected loop</span>
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">
            Cancel anytime. Student discounts available.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative rounded-2xl border p-6 flex flex-col justify-between min-h-[380px] ${
                t.highlight
                  ? "border-primary/50 bg-card shadow-glow lg:scale-105 z-10"
                  : "border-border bg-card"
              }`}
            >
              {t.highlight && (
                <span className="absolute -top-3 left-6 rounded-full bg-gradient-brand px-2.5 py-1 text-[10px] font-medium text-primary-foreground uppercase tracking-wide">
                  Most popular
                </span>
              )}
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  {t.name}
                </div>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold tracking-tight">
                    {t.price}
                  </span>
                  <span className="text-sm text-muted-foreground">{t.sub}</span>
                </div>
                <ul className="mt-6 space-y-3 text-sm border-t border-border/20 pt-4">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-success flex-shrink-0" />{" "}
                      <span className="text-foreground/90">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                className={`mt-8 w-full rounded-xl px-4 py-3 text-sm font-medium transition-transform hover:scale-[1.01] ${
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

const faqs = [
  [
    "Is LoopMock really like a real interview?",
    "Our recruiter personas are tuned per company using actual loop rubrics. Most users say it's harder than the real thing — which is the point.",
  ],
  [
    "Which languages does the code editor support?",
    "40+ via Judge0 CE — TypeScript, Python, Java, C++, Go, Rust, Kotlin, Swift, and more.",
  ],
  [
    "Do you store my voice or video?",
    "Voice is transcribed in real-time and discarded by default. Peer video is fully peer-to-peer via WebRTC.",
  ],
];

function FAQ() {
  return (
    <section id="faq" className="relative py-16 sm:py-28">
      <div className="mx-auto max-w-3xl px-4">
        <div className="text-center">
          <span className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs text-muted-foreground">
            FAQ
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Questions, <span className="text-gradient-brand">answered.</span>
          </h2>
        </div>
        <div className="mt-10 space-y-3">
          {faqs.map(([q, a]) => (
            <details
              key={q}
              className="group rounded-xl border border-border bg-card p-4 sm:p-5 open:bg-card transition-all"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm sm:text-base font-medium select-none">
                <span className="pr-2">{q}</span>
                <span className="text-muted-foreground transition-transform duration-200 group-open:rotate-45 flex-shrink-0">
                  ＋
                </span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed border-t border-border/20 pt-3">
                {a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section id="cta" className="relative py-12 sm:py-28">
      <div className="mx-auto max-w-5xl px-2 sm:px-4">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border bg-card p-8 text-center shadow-card sm:p-16">
          <div className="absolute inset-0 -z-10 bg-hero-radial opacity-80" />
          <div className="absolute inset-0 -z-10 grid-bg" />
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight sm:text-5xl">
            Your next loop starts{" "}
            <span className="text-gradient-brand">tonight.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base text-muted-foreground">
            Spin up a mock interview in 10 seconds. No credit card. Get a
            recruiter-grade scorecard before bed.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md mx-auto sm:max-w-none">
            <Link
              to="/register"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-brand px-5 py-3 text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:scale-[1.02]"
            >
              Start Mock Interview
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#pricing"
              className="w-full sm:w-auto text-center rounded-xl border border-border bg-secondary/50 px-5 py-3 text-sm font-medium backdrop-blur transition-colors hover:bg-secondary"
            >
              View pricing
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const cols = [
    {
      title: "Product",
      links: ["AI Interviews", "Coding Env", "Skill Radar", "Resume Analyzer"],
    },
    { title: "Companies", links: ["Google", "Amazon", "Meta", "Stripe"] },
    { title: "Company", links: ["About", "Blog", "Careers"] },
    { title: "Legal", links: ["Privacy", "Terms"] },
  ];
  return (
    <footer className="relative border-t border-border py-12 sm:py-14">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-6">
          <div className="col-span-2">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-brand">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </span>
              <span className="text-sm font-semibold">LoopMock</span>
            </div>
            <p className="mt-3 max-w-xs text-xs text-muted-foreground leading-relaxed">
              The AI-native interview prep platform for engineers shipping
              toward their next offer.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.title} className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
                {c.title}
              </div>
              <ul className="space-y-2">
                {c.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-y-3 border-t border-border pt-6 text-[11px] sm:text-xs text-muted-foreground text-center sm:text-left">
          <span>
            &copy; {new Date().getFullYear()} LoopMock Inc. All rights reserved.
          </span>
          <span className="opacity-80">
            Built with React · Groq · Judge0 · Socket.io
          </span>
        </div>
      </div>
    </footer>
  );
}
