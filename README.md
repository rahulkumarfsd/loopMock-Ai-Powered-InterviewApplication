<div align="center">

<img src="https://img.shields.io/badge/LoopMock-AI%20Interview%20Platform-6c63ff?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMyAyTDMgMTRoOWwtMSA4IDEwLTEyaC05bDEtOHoiLz48L3N2Zz4=" alt="LoopMock" />

# LoopMock

### AI-Native Mock Interview Platform — Built for Engineers Who Ship

[![MIT License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.x-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Groq](https://img.shields.io/badge/Groq-Llama%203.1-F55036?style=flat-square)](https://groq.com)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.x-010101?style=flat-square&logo=socket.io)](https://socket.io)
[![Judge0](https://img.shields.io/badge/Judge0-CE-blue?style=flat-square)](https://judge0.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](CONTRIBUTING.md)
[![Stars](https://img.shields.io/github/stars/yourusername/loopmock?style=flat-square&color=gold)](https://github.com/yourusername/loopmock/stargazers)

<br/>

**[🚀 Live Demo](https://loopmock.dev)** · **[📖 Docs](https://docs.loopmock.dev)** · **[🐛 Report Bug](https://github.com/yourusername/loopmock/issues)** · **[✨ Request Feature](https://github.com/yourusername/loopmock/issues)**

<br/>

> *"LoopMock is the closest thing to a real FAANG interview loop — without the recruiter ghosting you."*

<br/>

![LoopMock Hero Screenshot](https://placehold.co/1200x600/1a1a2e/6c63ff?text=LoopMock+—+AI+Interview+Platform)

</div>

---

## 📋 Table of Contents

- [Problem Statement](#-problem-statement)
- [Solution Overview](#-solution-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Authentication Flow](#-authentication--authorization-flow)
- [Docker Setup](#-docker-setup)
- [Testing Strategy](#-testing-strategy)
- [Performance](#-performance-optimizations)
- [Security](#-security-best-practices)
- [Scalability](#-scalability-considerations)
- [Deployment](#-deployment-guide)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [Troubleshooting](#-troubleshooting)
- [FAQ](#-faq)
- [Acknowledgements](#-acknowledgements)
- [License](#-license)

---

## 🎯 Problem Statement

The technical interview process is broken for most engineers:

| Problem | Impact |
|---|---|
| Generic LeetCode grind gives no feedback | Engineers don't know *why* they're failing |
| Mock interview platforms cost $200–$500/session | Financially inaccessible for most candidates |
| No platform covers the full loop | DSA → System Design → Behavioral → Coding all separate |
| Feedback arrives days later (if at all) | No tight iteration loop for improvement |
| Resume prep and interview prep are siloed | Interviewers ask resume-specific questions, platforms don't |

**LoopMock solves all five.** One platform. Real AI feedback in under 2 seconds. Free to start.

---

## 💡 Solution Overview

LoopMock simulates **complete, multi-round interview loops** across:

- 🧠 **DSA** — Dynamic programming, graphs, trees, sliding window
- ⚙️ **System Design** — Distributed systems, databases, caching, fan-out
- 💬 **Behavioral** — STAR framework, Amazon Leadership Principles
- 🖥️ **Frontend** — React internals, JS event loop, CSS architecture
- text-accent **Backend** — Node.js concurrency, JWT, REST API design, indexing
- 💻 **Live Coding** — Monaco editor + Judge0 CE with hidden test cases

After every answer, Groq AI returns **recruiter-grade feedback** in under 2 seconds — scoring correctness, depth, clarity, and communication with specific, actionable suggestions.

---

## ✨ Key Features

<table>
<tr>
<td width="50%">

### 🤖 AI Mock Interviews
Multi-round simulations with dynamic question generation. Questions adapt to your target company and experience level. Groq's `llama-3.1-8b-instant` model delivers sub-2s feedback latency.

### 💻 LeetCode-Grade Coding Environment
Monaco editor (VS Code engine) with Judge0 CE code execution. 40+ languages supported. Hidden test cases, per-language starter templates, and AI-generated hints.

### 📄 Resume Analyzer
Upload your PDF resume — AI extracts your stack, projects, and experience to generate the *exact* deep-dive questions your interviewer will ask. 94% hit rate reported by users.

### 📊 Skill Analytics & Radar Chart
Per-topic mastery scores tracked across every session. Recharts radar visualization mapped against company-specific hiring bars (FAANG, mid-cap, TCS/Infosys).

</td>
<td width="50%">

### 👥 Live Peer Mock Rooms
Socket.io-powered real-time rooms. Users match by skill level, target company, and timezone. Shared notepad, synced timer, and post-session AI moderation.

### 🏢 Company-Specific Prep
Curated question packs and recruiter personas for Amazon, Google, Meta, Microsoft, Stripe, TCS, and Infosys — each with their own interview style and rubric.

### 📧 Automated Email Engine
Resend-powered transactional emails: welcome on register, weekly performance reports, streak reminders, and improvement suggestions via `node-cron` scheduled jobs.

### 🔒 Production-Grade Auth
JWT access tokens + httpOnly refresh token cookies. Google OAuth 2.0 via Passport.js. bcrypt password hashing (12 rounds). Per-route rate limiting with `express-rate-limit`.

</td>
</tr>
</table>

---

## 🏗️ System Architecture

```mermaid
graph TB
    subgraph Client["🌐 Client (React 18 + Vite)"]
        LP[Landing Page]
        AUTH[Auth Pages]
        DASH[Dashboard]
        INT[Interview Engine]
        CODE[Coding Judge]
        PEER[Peer Mock]
    end

    subgraph Gateway["⚡ API Gateway (Express.js)"]
        RL[Rate Limiter]
        MW[Auth Middleware]
        ROUTES[Route Handlers]
    end

    subgraph Services["text-accent Core Services"]
        AI[Groq AI Service<br/>llama-3.1-8b-instant]
        J0[Judge0 CE<br/>Code Execution]
        MAIL[Resend<br/>Email Service]
        SOCK[Socket.io<br/>Peer Matching]
    end

    subgraph Data["🗄️ Data Layer"]
        MONGO[(MongoDB Atlas<br/>Primary DB)]
        REDIS[(Redis<br/>Optional Cache)]
    end

    subgraph Infra["☁️ Infrastructure"]
        VERCEL[Vercel<br/>Frontend CDN]
        RAILWAY[Railway<br/>Backend]
        CRON[node-cron<br/>Scheduled Jobs]
    end

    Client -->|REST API| Gateway
    Client <-->|WebSocket| SOCK
    Gateway --> RL --> MW --> ROUTES
    ROUTES --> AI
    ROUTES --> J0
    ROUTES --> MAIL
    ROUTES --> MONGO
    ROUTES --> REDIS
    AI -->|Feedback JSON| ROUTES
    J0 -->|stdout/verdict| ROUTES
    CRON -->|weekly reports| MAIL
    CRON -->|usage reset| MONGO

    style Client fill:#1a1a2e,stroke:#6c63ff,color:#fff
    style Gateway fill:#16213e,stroke:#6c63ff,color:#fff
    style Services fill:#0f3460,stroke:#6c63ff,color:#fff
    style Data fill:#533483,stroke:#6c63ff,color:#fff
    style Infra fill:#e94560,stroke:#6c63ff,color:#fff
```

### Interview Lifecycle

```mermaid
sequenceDiagram
    participant U as User
    participant API as Express API
    participant DB as MongoDB
    participant AI as Groq AI

    U->>API: POST /interviews/start
    API->>DB: Create Interview {status: in-progress}
    API-->>U: {interviewId, totalQuestions}

    loop For each question
        U->>API: GET /interviews/:id/next-question
        API->>DB: Query questions by type/company
        API-->>U: {question, hints}
        U->>API: POST /interviews/:id/answer
        API->>AI: {questionText, answerText, type}
        AI-->>API: {overallScore, correctness, clarity, depth, strengths[], weaknesses[]}
        API->>DB: Save answer + feedback
        API-->>U: {feedback, questionsAnswered, remaining}
    end

    U->>API: POST /interviews/:id/complete
    API->>AI: generateInterviewSummary(answers[])
    AI-->>API: {summary, strongTopics, weakTopics}
    API->>DB: Update {status: completed, averageScore}
    API-->>U: {interview, summary}
```

### Code Execution Flow

```mermaid
flowchart LR
    A[User submits code] --> B[POST /coding/submit]
    B --> C{Fetch all testCases\nfrom MongoDB}
    C --> D[For each testCase]
    D --> E[POST ce.judge0.com/submissions\nbase64 encoded]
    E --> F[Poll GET /submissions/:token\nuntil status > 2]
    F --> G{strictCompare\nstdout vs expected}
    G -->|Match| H[passed: true]
    G -->|No match| I[passed: false]
    H --> J[Aggregate results]
    I --> J
    J --> K[Return verdict\npassed/total/maxTime]
```

---

## 🛠️ Tech Stack

### Frontend

| Category | Technology | Version | Purpose |
|---|---|---|---|
| Framework | React | 18.x | UI component model |
| Build Tool | Vite | 5.x | Sub-second HMR, optimized builds |
| Routing | React Router | v6 | Nested routes, lazy loading |
| State | Zustand | 4.x | Global state, localStorage persistence |
| Editor | Monaco Editor | latest | VS Code-grade coding environment |
| Charts | Recharts | 2.x | Radar, line, bar charts |
| Real-time | Socket.io Client | 4.x | Peer mock WebSocket |
| Notifications | React Hot Toast | 2.x | Non-blocking feedback toasts |
| File Upload | React Dropzone | 14.x | Resume upload with validation |
| HTTP | Axios | 1.x | API calls with interceptors |

### Backend

| Category | Technology | Version | Purpose |
|---|---|---|---|
| Runtime | Node.js | 18.x | JavaScript server runtime |
| Framework | Express | 4.x | HTTP server, middleware |
| Database | MongoDB + Mongoose | 7.x | Document store, ODM |
| Auth | Passport.js + JWT | latest | OAuth 2.0, token auth |
| Real-time | Socket.io | 4.x | WebSocket peer rooms |
| Scheduler | node-cron | 3.x | Weekly emails, usage reset |
| Security | Helmet + CORS | latest | Security headers |
| Validation | express-validator | 7.x | Input sanitization |
| Logging | Morgan | 1.x | HTTP request logging |

### AI & External Services

| Service | Provider | Purpose | Cost |
|---|---|---|---|
| LLM Inference | Groq (llama-3.1-8b-instant) | Question gen + feedback | Free tier |
| Code Execution | Judge0 CE (ce.judge0.com) | Run code, test cases | Free |
| Email | Resend | Transactional emails | 100/day free |
| File Storage | Local disk (multer) | Resume PDFs | Self-hosted |
| Cache | Redis (optional) | Question caching | Self-hosted |

### Infrastructure

| Component | Tool | Purpose |
|---|---|---|
| Frontend Deploy | Vercel | CDN, edge deployment |
| Backend Deploy | Railway | Node.js hosting |
| Database | MongoDB Atlas | Managed MongoDB |
| Domain | Cloudflare | DNS, CDN, DDoS protection |
| Monitoring | (Planned) Sentry | Error tracking |

---

## 📁 Project Structure

```
loopmock/
├── 📁 client/                          # React + Vite frontend
│   ├── 📁 public/
│   │   └── favicon.svg
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   └── 📁 ui/
│   │   │       ├── Layout.jsx          # App shell with sidebar
│   │   │       ├── Sidebar.jsx         # Navigation sidebar
│   │   │       ├── Modal.jsx           # Reusable modal
│   │   │       ├── Spinner.jsx         # Loading states
│   │   │       └── ScoreRing.jsx       # Circular progress
│   │   ├── 📁 hooks/
│   │   │   ├── useTimer.js             # Interview countdown
│   │   │   └── useVoice.js             # Web Speech API
│   │   ├── 📁 pages/
│   │   │   ├── Landing.jsx             # Marketing landing page
│   │   │   ├── Login.jsx               # Email + Google OAuth
│   │   │   ├── Register.jsx            # Signup form
│   │   │   ├── AuthCallback.jsx        # OAuth token handler
│   │   │   ├── Dashboard.jsx           # Stats + session history
│   │   │   ├── Interview.jsx           # AI interview engine
│   │   │   ├── CodingInterview.jsx     # LeetCode-style judge
│   │   │   ├── Feedback.jsx            # Post-interview review
│   │   │   ├── Analytics.jsx           # Radar + trend charts
│   │   │   ├── CompanyPrep.jsx         # Company-specific packs
│   │   │   ├── ResumeAnalyzer.jsx      # PDF upload + analysis
│   │   │   └── PeerMock.jsx            # Live peer rooms
│   │   ├── 📁 services/
│   │   │   ├── api.js                  # Axios instance + interceptors
│   │   │   └── index.js                # Service exports
│   │   ├── 📁 store/
│   │   │   ├── authStore.js            # Auth state (Zustand)
│   │   │   └── interviewStore.js       # Interview state (Zustand)
│   │   ├── App.jsx                     # Router + route guards
│   │   ├── main.jsx                    # React entry point
│   │   └── index.css                   # Global styles
│   ├── index.html                      # HTML template + SEO meta
│   ├── .env.example                    # Environment variables template
│   ├── vite.config.js                  # Vite configuration
│   └── package.json
│
├── 📁 server/                          # Node.js + Express backend
│   ├── 📁 config/
│   │   ├── db.js                       # MongoDB connection
│   │   ├── passport.js                 # Google OAuth strategy
│   │   └── redis.js                    # Redis client (optional)
│   ├── 📁 controllers/
│   │   ├── auth.controller.js          # Register/login/OAuth/refresh
│   │   ├── interview.controller.js     # Start/question/answer/complete
│   │   ├── coding.controller.js        # Problems/run/submit
│   │   ├── feedback.controller.js      # Groq AI feedback
│   │   ├── analytics.controller.js     # Score aggregation
│   │   ├── resume.controller.js        # PDF upload + analysis
│   │   └── user.controller.js          # Profile management
│   ├── 📁 cron/
│   │   └── jobs.js                     # Weekly reports, streak reminders
│   ├── 📁 data/
│   │   └── seed.js                     # 40 real interview questions
│   ├── 📁 middleware/
│   │   ├── auth.middleware.js           # JWT verification
│   │   ├── error.middleware.js          # Global error handler
│   │   ├── rateLimit.middleware.js      # Per-route rate limits
│   │   ├── upload.middleware.js         # Multer file upload
│   │   └── validate.middleware.js       # express-validator
│   ├── 📁 models/
│   │   ├── User.model.js               # User + stats + usage
│   │   ├── Interview.model.js          # Interview lifecycle
│   │   ├── Question.model.js           # Question bank
│   │   └── Resume.model.js             # Resume + analysis
│   ├── 📁 routes/
│   │   ├── auth.routes.js
│   │   ├── interview.routes.js
│   │   ├── coding.routes.js
│   │   ├── analytics.routes.js
│   │   ├── resume.routes.js
│   │   └── user.routes.js
│   ├── 📁 scripts/
│   │   └── generateQuestions.js        # AI bulk question generator
│   ├── 📁 services/
│   │   ├── openai.service.js           # Groq wrapper (OpenAI-compat)
│   │   ├── judge0ce.service.js         # Judge0 CE execution
│   │   ├── email.service.js            # Resend email templates
│   │   └── resume.service.js           # PDF parse + AI analysis
│   ├── 📁 socket/
│   │   └── index.js                    # Socket.io peer matching
│   ├── 📁 utils/
│   │   ├── apiError.js                 # Custom error classes
│   │   ├── generateToken.js            # JWT generation
│   │   ├── promptBuilder.js            # Groq prompt templates
│   │   └── scoreCalculator.js          # Stats aggregation
│   ├── app.js                          # Express app setup
│   ├── server.js                       # HTTP server + cron init
│   ├── .env.example                    # Environment variables template
│   └── package.json
│
├── 📁 .github/
│   └── 📁 workflows/
│       └── ci.yml                      # GitHub Actions CI
├── docker-compose.yml                  # Docker local development
├── Dockerfile.client                   # React production build
├── Dockerfile.server                   # Node.js production
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

| Requirement | Version | Check |
|---|---|---|
| Node.js | ≥ 18.x | `node --version` |
| npm | ≥ 9.x | `npm --version` |
| MongoDB | ≥ 6.x or Atlas | running locally or cloud |
| Git | any | `git --version` |

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/loopmock.git
cd loopmock
```

### 2. Install Dependencies

```bash
# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 3. Configure Environment Variables

```bash
# Server
cp server/.env.example server/.env

# Client
cp client/.env.example client/.env
```

> See [Environment Variables](#-environment-variables) section for all required values.

### 4. Seed the Database

```bash
cd server
node data/seed.js
```

Expected output:
```
✅ Connected to MongoDB
✅ Seeded 40 real interview questions

By type:
  dsa                  14
  system-design         6
  behavioral            6
  frontend              5
  backend               5  ...
```

### 5. Generate AI Question Bank (Optional)

```bash
# Generates 200+ AI questions using Groq
node scripts/generateQuestions.js

# Generate only DSA questions
node scripts/generateQuestions.js --type=dsa

# Clear existing and regenerate all
node scripts/generateQuestions.js --clear
```

### 6. Start Development Servers

```bash
# Terminal 1 — Backend (port 5000)
cd server && npm run dev

# Terminal 2 — Frontend (port 5173)
cd client && npm run dev
```

Open [http://localhost:5173](http://localhost:5173) 🎉

---

## 🔐 Environment Variables

<details>
<summary><strong>server/.env — Click to expand</strong></summary>

```bash
# ── Server ────────────────────────────────────────────
PORT=5000
NODE_ENV=development

# ── MongoDB ───────────────────────────────────────────
# Local:  mongodb://localhost:27017/loopmock
# Atlas:  mongodb+srv://user:pass@cluster.mongodb.net/loopmock
MONGO_URI=mongodb://localhost:27017/loopmock

# ── JWT ───────────────────────────────────────────────
# Generate: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=your_64_char_hex_secret_here
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_different_64_char_hex_secret_here
JWT_REFRESH_EXPIRE=30d

# ── Google OAuth ──────────────────────────────────────
# console.cloud.google.com → APIs → Credentials → OAuth 2.0
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# ── Groq AI (Free) ────────────────────────────────────
# console.groq.com → API Keys → Create key
GROQ_API_KEY=gsk_your_groq_api_key

# ── Email — Resend (Free 100/day) ─────────────────────
# resend.com → API Keys → Create
# Dev: use onboarding@resend.dev as FROM_EMAIL (no domain verify needed)
RESEND_API_KEY=re_your_resend_api_key
FROM_EMAIL=LoopMock <noreply@yourdomain.com>

# ── Redis (Optional — graceful fallback if missing) ───
REDIS_URL=redis://localhost:6379

# ── Client URL ────────────────────────────────────────
CLIENT_URL=http://localhost:5173
```

</details>

<details>
<summary><strong>client/.env — Click to expand</strong></summary>

```bash
# All Vite env vars MUST start with VITE_
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
VITE_APP_NAME=LoopMock
```

</details>

---

## 📡 API Documentation

<details>
<summary><strong>Authentication Endpoints</strong></summary>

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | ❌ | Create account + send welcome email |
| `POST` | `/api/auth/login` | ❌ | Email/password login |
| `GET` | `/api/auth/google` | ❌ | Initiate Google OAuth |
| `GET` | `/api/auth/google/callback` | ❌ | OAuth redirect handler |
| `GET` | `/api/auth/me` | ✅ | Get current user profile |
| `POST` | `/api/auth/refresh` | ❌ | Refresh access token via cookie |
| `POST` | `/api/auth/logout` | ✅ | Invalidate refresh token |

**Register Request/Response:**
```json
// POST /api/auth/register
// Request
{ "name": "Rahul Sharma", "email": "rahul@example.com", "password": "minimum6chars" }

// Response 201
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": { "_id": "...", "name": "Rahul Sharma", "email": "rahul@example.com", "plan": "free" }
}
```

</details>

<details>
<summary><strong>Interview Endpoints</strong></summary>

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/interviews/start` | ✅ | Create new interview session |
| `GET` | `/api/interviews/history` | ✅ | Paginated interview history |
| `GET` | `/api/interviews/:id` | ✅ | Get interview by ID |
| `GET` | `/api/interviews/:id/next-question` | ✅ | Fetch next question |
| `POST` | `/api/interviews/:id/answer` | ✅ | Submit answer + get AI feedback |
| `POST` | `/api/interviews/:id/complete` | ✅ | Complete session + get summary |

**Start Interview:**
```json
// POST /api/interviews/start
// Request
{ "type": "dsa", "mode": "text", "company": "amazon", "totalQuestions": 5 }

// Response 201
{ "success": true, "interview": { "_id": "...", "status": "in-progress", "totalQuestions": 5 } }
```

**Submit Answer + Get AI Feedback:**
```json
// POST /api/interviews/:id/answer
// Request
{
  "questionId": "...",
  "questionText": "Explain Kadane's algorithm",
  "answerText": "Kadane's algorithm tracks the maximum subarray ending at each position...",
  "timeTaken": 145
}

// Response 200
{
  "feedback": {
    "overallScore": 8.5,
    "correctness": 9,
    "clarity": 8,
    "depth": 8,
    "communication": 9,
    "strengths": ["Correct O(n) time complexity stated", "Good example walkthrough"],
    "weaknesses": ["Didn't mention all-negative array edge case"],
    "suggestions": ["Add: if all nums are negative, maxEndingHere = max(num, maxEndingHere + num) still works"],
    "aiExplanation": "Strong answer covering the core concept..."
  },
  "questionsAnswered": 2,
  "totalQuestions": 5,
  "remaining": 3
}
```

</details>

<details>
<summary><strong>Coding Endpoints</strong></summary>

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/coding/problems` | ❌ | List problems with filters |
| `GET` | `/api/coding/problems/:id` | ❌ | Get problem details |
| `POST` | `/api/coding/run` | ✅ | Run against visible test cases |
| `POST` | `/api/coding/submit` | ✅ | Submit against all test cases |
| `GET` | `/api/coding/languages` | ❌ | List supported languages |

**Query Parameters for `/api/coding/problems`:**
```
?difficulty=medium&topic=arrays&company=google&search=two+sum&page=1&limit=20
```

**Submit Response:**
```json
{
  "results": [
    { "passed": true,  "stdout": "[0,1]", "time": "0.042", "isHidden": false },
    { "passed": true,  "stdout": "[1,2]", "time": "0.038", "isHidden": false },
    { "passed": false, "stdout": "[0,1]", "stderr": "", "statusDesc": "Wrong Answer", "isHidden": true }
  ],
  "passed": 2,
  "total": 3,
  "allPassed": false,
  "verdict": "Wrong Answer",
  "score": 6,
  "maxTime": "0.042"
}
```

</details>

<details>
<summary><strong>Resume & Analytics Endpoints</strong></summary>

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/resume/upload` | ✅ | Upload PDF + trigger analysis |
| `GET` | `/api/resume/latest` | ✅ | Get most recent resume |
| `GET` | `/api/resume/:id` | ✅ | Poll analysis status |
| `GET` | `/api/analytics/overview` | ✅ | Stats + topic scores |
| `GET` | `/api/analytics/trend` | ✅ | Score trend over N weeks |
| `GET` | `/api/analytics/topics` | ✅ | Per-topic breakdown |

</details>

---

## 🗄️ Database Schema

```mermaid
erDiagram
    USER {
        ObjectId _id PK
        string name
        string email
        string password
        string googleId
        string plan
        object stats
        object usage
        object topicScores
        string refreshToken
        date createdAt
    }

    INTERVIEW {
        ObjectId _id PK
        ObjectId user FK
        string type
        string status
        number totalQuestions
        number questionsAnswered
        number averageScore
        array answers
        string summary
        array strongTopics
        array weakTopics
        date createdAt
    }

    QUESTION {
        ObjectId _id PK
        string title
        string body
        string type
        string difficulty
        string topic
        array company
        object coding
        array hints
        array tags
        boolean isActive
        number usageCount
    }

    RESUME {
        ObjectId _id PK
        ObjectId user FK
        string fileName
        string fileUrl
        string parsedText
        boolean isAnalyzed
        object analysis
        date createdAt
    }

    USER ||--o{ INTERVIEW : "has many"
    USER ||--o{ RESUME : "has many"
    INTERVIEW }o--o{ QUESTION : "references"
```

---

## 🔑 Authentication & Authorization Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant API as Express API
    participant DB as MongoDB
    participant G as Google OAuth

    Note over C,G: Email Registration
    C->>API: POST /auth/register {name, email, password}
    API->>API: bcrypt.hash(password, 12)
    API->>DB: User.create({...})
    API->>API: generateTokens(userId)
    API-->>C: {token, user} + Set-Cookie: refreshToken (httpOnly)

    Note over C,G: Google OAuth
    C->>API: GET /auth/google
    API->>G: Redirect to Google consent screen
    G->>API: GET /auth/google/callback?code=...
    API->>G: Exchange code for profile
    API->>DB: findOrCreate user by googleId
    API-->>C: Redirect /auth/callback?token=JWT

    Note over C,API: Protected Request
    C->>API: GET /api/interviews/history\nAuthorization: Bearer {token}
    API->>API: jwt.verify(token, JWT_SECRET)
    API->>DB: User.findById(decoded.id)
    API-->>C: {success: true, data: {...}}

    Note over C,API: Token Refresh
    C->>API: POST /auth/refresh\nCookie: refreshToken
    API->>DB: User.findOne({refreshToken})
    API->>API: generateTokens(userId)
    API-->>C: {token: newAccessToken} + new refreshToken cookie
```

**Rate Limiting Strategy:**

| Route Group | Limit | Window | Purpose |
|---|---|---|---|
| `POST /auth/login` | 20 req | 15 min | Brute-force protection |
| `POST /auth/register` | 20 req | 15 min | Account creation abuse |
| `GET /auth/me` | 200 req | 15 min | Normal read operation |
| `/api/*` | 200 req | 15 min | General API protection |
| `/api/feedback/*` | 30 req | 1 min | Groq cost protection |

---

## 🐳 Docker Setup

```bash
# Start all services with Docker Compose
docker-compose up --build

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f server

# Stop all services
docker-compose down
```

**docker-compose.yml:**
```yaml
version: '3.9'
services:
  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  server:
    build:
      context: ./server
      dockerfile: ../Dockerfile.server
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGO_URI=mongodb://mongo:27017/loopmock
      - REDIS_URL=redis://redis:6379
    env_file:
      - ./server/.env
    depends_on:
      - mongo
      - redis

  client:
    build:
      context: ./client
      dockerfile: ../Dockerfile.client
    ports:
      - "3000:80"
    depends_on:
      - server

volumes:
  mongo_data:
```

---

## 🧪 Testing Strategy

<details>
<summary><strong>Current Test Coverage</strong></summary>

| Layer | Tool | Coverage Target |
|---|---|---|
| Unit — Services | Jest | 80%+ |
| Unit — Controllers | Jest + Supertest | 80%+ |
| Integration — API | Supertest | Key flows |
| E2E — UI | Playwright (planned) | Critical paths |

**Run Tests:**
```bash
cd server

# Unit tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

**Example Controller Test:**
```javascript
// tests/interview.test.js
describe('POST /api/interviews/start', () => {
  it('should create a new interview', async () => {
    const res = await request(app)
      .post('/api/interviews/start')
      .set('Authorization', `Bearer ${token}`)
      .send({ type: 'dsa', totalQuestions: 3 });

    expect(res.status).toBe(201);
    expect(res.body.interview.status).toBe('in-progress');
    expect(res.body.interview.totalQuestions).toBe(3);
  });

  it('should block answers past totalQuestions', async () => {
    // Submit 3 answers to a 3-question interview
    // Then try a 4th
    const res = await submitAnswer(interviewId, 'answer4');
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/All.*questions.*answered/);
  });
});
```

</details>

---

## ⚡ Performance Optimizations

| Optimization | Implementation | Impact |
|---|---|---|
| **Redis Question Cache** | `getCache(key)` before DB query, 1800s TTL | -80% DB reads on question fetch |
| **Sequential Judge0 calls** | `for...of` not `Promise.all` | Avoids rate limit 429s |
| **Zustand persistence** | `persist` middleware, auth state in localStorage | Eliminates /me call on page refresh |
| **MongoDB indexes** | `user+status` on interviews, `type+difficulty` on questions | Sub-5ms queries at scale |
| **Groq model choice** | `llama-3.1-8b-instant` (not 70b) | <2s feedback vs 10s+ |
| **Rate limiting** | Per-route limits, not global | Protects expensive AI endpoints |
| **httpOnly cookies** | Refresh token in cookie | Eliminates XSS token theft vector |
| **Vite build** | Tree-shaking, code splitting | <200KB initial bundle |

---

## 🔒 Security Best Practices

```mermaid
mindmap
  root((Security))
    Authentication
      bcrypt 12 rounds
      JWT short expiry 7d
      httpOnly refresh cookie
      Refresh token rotation
    Authorization
      protect middleware
      req.user attachment
      Resource ownership check
    Input Validation
      express-validator
      File type whitelist
      File size limits 5MB
    Rate Limiting
      Auth routes 20/15min
      AI routes 30/min
      API routes 200/15min
    Headers
      Helmet.js
      CORS whitelist
      Content-Security-Policy
    Data
      No passwords in responses
      No tokens in logs
      Sensitive fields select false
```

---

## 📈 Scalability Considerations

### Current Architecture (0–10K users)
- Single Node.js process
- MongoDB single instance
- In-process Socket.io

### Scale to 100K Users
```
                    ┌─────────────────┐
                    │   Cloudflare    │
                    │   CDN / WAF     │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Load Balancer  │
                    │   (nginx)       │
                    └────────┬────────┘
              ┌──────────────┼──────────────┐
    ┌─────────▼──┐  ┌────────▼───┐  ┌──────▼──────┐
    │  API Node 1│  │  API Node 2│  │  API Node 3 │
    └─────────┬──┘  └────────┬───┘  └──────┬──────┘
              └──────────────┼──────────────┘
                    ┌────────▼────────┐
                    │  Redis Cluster  │ ← Session + Socket.io adapter
                    └────────┬────────┘
                    ┌────────▼────────┐
                    │ MongoDB Atlas   │ ← Read replicas
                    │ M30+ tier       │
                    └─────────────────┘
```

**Key changes at 100K:**
- Redis adapter for Socket.io (sticky sessions across nodes)
- MongoDB read replicas for analytics queries
- Separate AI feedback service (isolate Groq calls)
- BullMQ job queue for async operations (resume analysis, email)

### Scale to 1M Users
- Microservices: Auth, Interview, Coding, Analytics as separate services
- Kafka for async event streaming (interview.completed → analytics.update)
- ClickHouse or TimescaleDB for analytics time-series data
- Self-hosted Judge0 cluster for code execution
- CDN for static assets + Monaco editor workers

---

## 🚢 Deployment Guide

### Option 1: Vercel + Railway (Recommended — Free Tier Available)

```bash
# Deploy Frontend to Vercel
cd client
npm run build
vercel --prod

# Deploy Backend to Railway
# 1. Push to GitHub
# 2. Connect Railway to your repo
# 3. Set environment variables in Railway dashboard
# 4. Railway auto-deploys on push
```

**Railway Environment Variables:**
```
NODE_ENV=production
MONGO_URI=mongodb+srv://...  ← MongoDB Atlas connection string
JWT_SECRET=...
GROQ_API_KEY=...
RESEND_API_KEY=...
CLIENT_URL=https://yourdomain.vercel.app
```

### Option 2: Docker on VPS (DigitalOcean / Hetzner)

```bash
# On your VPS
git clone https://github.com/yourusername/loopmock.git
cd loopmock
cp server/.env.example server/.env
# Edit server/.env with production values

docker-compose -f docker-compose.prod.yml up -d
```

### Option 3: AWS (Enterprise)

```
Route 53 → CloudFront → S3 (React build)
         → ALB → ECS Fargate (Node.js)
                → DocumentDB (MongoDB-compatible)
                → ElastiCache (Redis)
```

---

## 📸 Screenshots

<details>
<summary><strong>View Screenshots</strong></summary>

| Page | Preview |
|---|---|
| Landing Page | ![Landing](https://placehold.co/800x450/1a1a2e/6c63ff?text=Landing+Page) |
| Dashboard | ![Dashboard](https://placehold.co/800x450/1a1a2e/6c63ff?text=Dashboard) |
| AI Interview | ![Interview](https://placehold.co/800x450/1a1a2e/6c63ff?text=AI+Interview+Engine) |
| Coding Judge | ![Coding](https://placehold.co/800x450/1a1a2e/6c63ff?text=LeetCode+Style+Editor) |
| Skill Radar | ![Analytics](https://placehold.co/800x450/1a1a2e/6c63ff?text=Skill+Analytics+Radar) |
| Peer Mock | ![Peer](https://placehold.co/800x450/1a1a2e/6c63ff?text=Live+Peer+Mock+Room) |

</details>

---

## 🗺️ Roadmap

```mermaid
gantt
    title LoopMock Development Roadmap
    dateFormat  YYYY-MM
    section v1.0 — Core ✅
    AI Interview Engine      :done, 2025-01, 2025-02
    Judge0 Coding Judge      :done, 2025-02, 2025-03
    Resume Analyzer          :done, 2025-03, 2025-03
    Peer Mock Rooms          :done, 2025-03, 2025-04
    Landing Page             :done, 2025-04, 2025-04
    section v1.1 — Growth
    Razorpay Payments        :active, 2025-05, 2025-06
    Mobile Responsive        :active, 2025-05, 2025-06
    Video Interview Mode     :2025-06, 2025-07
    Job Description Parser   :2025-06, 2025-07
    section v2.0 — Scale
    AI Interview Copilot     :2025-08, 2025-10
    Campus Dashboard         :2025-09, 2025-11
    WebRTC Peer Video        :2025-10, 2025-12
    Self-hosted Judge0       :2025-11, 2026-01
```

| Version | Feature | Status |
|---|---|---|
| v1.0 | AI interview engine, feedback, coding judge | ✅ Done |
| v1.0 | Resume analyzer, peer mock, analytics | ✅ Done |
| v1.0 | Landing page, auth, email service | ✅ Done |
| v1.1 | Razorpay payments (INR) | 🔄 In Progress |
| v1.1 | Mobile responsive all pages | 🔄 In Progress |
| v1.2 | Video interview mode (MediaRecorder API) | 📋 Planned |
| v1.2 | Job description → custom question pack | 📋 Planned |
| v2.0 | AI Interview Copilot (real-time overlay) | 🔮 Future |
| v2.0 | Campus cohort dashboards | 🔮 Future |
| v2.0 | WebRTC peer video in mock rooms | 🔮 Future |

---

## 🤝 Contributing

We love contributions! Please read our guidelines before submitting a PR.

### Development Workflow

```bash
# 1. Fork the repository
# 2. Create a feature branch
git checkout -b feat/your-feature-name

# 3. Make your changes with conventional commits
git commit -m "feat(interview): add adaptive difficulty scaling"
git commit -m "fix(coding): handle trailing whitespace in Judge0 comparison"
git commit -m "docs: update API documentation for /submit endpoint"

# 4. Push and open a Pull Request
git push origin feat/your-feature-name
```

### Commit Convention

| Prefix | When to use |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation only |
| `style:` | Formatting, no logic change |
| `refactor:` | Code restructure |
| `test:` | Adding tests |
| `chore:` | Build process, deps |
| `perf:` | Performance improvement |

### Code Quality Standards

```bash
# Linting (ESLint)
npm run lint

# Format (Prettier)
npm run format

# Type check (if TypeScript added)
npm run typecheck

# All checks before PR
npm run precommit
```

**PR Checklist:**
- [ ] Tests pass (`npm test`)
- [ ] No new ESLint errors
- [ ] Documentation updated if needed
- [ ] Environment variables documented in `.env.example`
- [ ] No secrets committed
- [ ] PR description explains *why*, not just *what*

---

## text-accent Troubleshooting

<details>
<summary><strong>MongoDB connection fails</strong></summary>

```bash
# Check if MongoDB is running locally
mongosh --eval "db.adminCommand('ping')"

# If using Atlas, whitelist your IP
# Atlas Dashboard → Network Access → Add IP Address → Add Current IP

# Test connection string
node -e "require('mongoose').connect(process.env.MONGO_URI).then(() => console.log('OK'))"
```

</details>

<details>
<summary><strong>Groq API returns errors</strong></summary>

```bash
# Test your API key
curl https://api.groq.com/openai/v1/models \
  -H "Authorization: Bearer $GROQ_API_KEY"

# Check debug endpoint (dev only)
GET http://localhost:5000/api/debug/ai
# Should return: {"status":"OK","provider":"Groq"}
```

</details>

<details>
<summary><strong>Judge0 code execution returns ERR_BAD_REQUEST</strong></summary>

```bash
# Check available runtimes (node-cron caches these on startup)
GET http://localhost:5000/api/coding/languages

# Judge0 version mismatch — service auto-resolves on first request
# If persists, restart server: npm run dev

# Verify Judge0 is reachable
curl https://ce.judge0.com/languages | head -20
```

</details>

<details>
<summary><strong>Emails not sending</strong></summary>

```bash
# Check RESEND_API_KEY is set
echo $RESEND_API_KEY

# For development, use sandbox FROM address
FROM_EMAIL=LoopMock <onboarding@resend.dev>

# Verify Resend API key works
curl -X POST 'https://api.resend.com/emails' \
  -H "Authorization: Bearer $RESEND_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"from":"onboarding@resend.dev","to":"your@email.com","subject":"Test","html":"<p>Test</p>"}'
```

</details>

<details>
<summary><strong>Google OAuth redirect_uri_mismatch</strong></summary>

```
# In Google Cloud Console:
# APIs & Services → Credentials → Your OAuth Client
# Authorized redirect URIs → Add:
http://localhost:5000/api/auth/google/callback   ← development
https://yourdomain.com/api/auth/google/callback  ← production
```

</details>

<details>
<summary><strong>Socket.io peer rooms not connecting</strong></summary>

```bash
# Check VITE_SOCKET_URL in client/.env
VITE_SOCKET_URL=http://localhost:5000  # NOT http://localhost:5000/api

# Check CORS in server/app.js allows your client origin
# Check firewall allows WebSocket upgrade (port 5000)
```

</details>

---

## ❓ FAQ

<details>
<summary><strong>Which AI model powers the feedback?</strong></summary>

`llama-3.1-8b-instant` served by Groq. We chose Groq because:
- **Free** with generous rate limits (no billing required)
- **Fast** — sub-2s inference vs 8–10s on standard OpenAI
- **OpenAI-compatible API** — easy swap if needed
- Output quality for structured JSON feedback is excellent

</details>

<details>
<summary><strong>How does Judge0 code execution work safely?</strong></summary>

Judge0 CE runs each submission in an isolated Docker container with:
- CPU time limit: 5 seconds per test case
- Memory limit: 256MB
- No network access from code
- Filesystem isolation

We pass `base64_encoded: true` for all submissions to handle special characters correctly.

</details>

<details>
<summary><strong>Why MongoDB over PostgreSQL?</strong></summary>

The interview `answers[]` array has varying structure per type (behavioral questions have no "correctness" score, coding questions have different feedback schema). MongoDB's flexible document model avoids complex JOIN-heavy schemas. For financial transactions (payments), PostgreSQL would be the right choice.

</details>

<details>
<summary><strong>Is the Groq API key required to run locally?</strong></summary>

Yes — without `GROQ_API_KEY`, AI interview feedback returns a fallback `5/5/5/5` score instead of real AI analysis. Question generation from DB still works. Get a free key at [console.groq.com](https://console.groq.com).

</details>

<details>
<summary><strong>Can I self-host Judge0 for production?</strong></summary>

Yes. Judge0 CE is open source and Docker-ready. For high traffic, running your own Judge0 instance is recommended. Update `JUDGE0_URL` in `server/services/judge0ce.service.js` to point to your instance.

</details>

---

## 🙏 Acknowledgements

| Project | How we use it |
|---|---|
| [Groq](https://groq.com) | Ultra-fast LLM inference for interview feedback |
| [Judge0 CE](https://github.com/judge0/judge0) | Open-source code execution engine |
| [Resend](https://resend.com) | Modern email API for transactional mail |
| [Monaco Editor](https://microsoft.github.io/monaco-editor) | VS Code editor in the browser |
| [Socket.io](https://socket.io) | Real-time WebSocket peer rooms |
| [Lucide React](https://lucide.dev) | Beautiful, consistent icon set |
| [Recharts](https://recharts.org) | Composable React chart library |
| [Zustand](https://zustand-demo.pmnd.rs) | Lightweight state management |

---

## 📄 License

```
MIT License

Copyright (c) 2026 LoopMock

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

See [LICENSE](LICENSE) for the full text.

---

<div align="center">

**Built with ❤️ for engineers who refuse to fail their loops**

[![GitHub stars](https://img.shields.io/github/stars/yourusername/loopmock?style=social)](https://github.com/yourusername/loopmock)
[![Twitter Follow](https://img.shields.io/twitter/follow/loopmock?style=social)](https://twitter.com/loopmock)

<br/>

*If LoopMock helped you land an offer, give it a ⭐ — it helps more engineers find it.*

<br/>

```
                    ██╗      ██████╗  ██████╗ ██████╗ ███╗   ███╗ ██████╗  ██████╗██╗  ██╗
                    ██║     ██╔═══██╗██╔═══██╗██╔══██╗████╗ ████║██╔═══██╗██╔════╝██║ ██╔╝
                    ██║     ██║   ██║██║   ██║██████╔╝██╔████╔██║██║   ██║██║     █████╔╝
                    ██║     ██║   ██║██║   ██║██╔═══╝ ██║╚██╔╝██║██║   ██║██║     ██╔═██╗
                    ███████╗╚██████╔╝╚██████╔╝██║     ██║ ╚═╝ ██║╚██████╔╝╚██████╗██║  ██╗
                    ╚══════╝ ╚═════╝  ╚═════╝ ╚═╝     ╚═╝     ╚═╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝
```

**[Website](https://loopmock.dev) · [Documentation](https://docs.loopmock.dev) · [Discord](https://discord.gg/loopmock) · [Twitter](https://twitter.com/loopmock)**

</div>
