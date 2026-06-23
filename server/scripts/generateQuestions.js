require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const Groq = require("groq-sdk");
const Question = require("../models/Question.model");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const PLAN = [
  { type: "dsa", difficulty: "easy", topic: "arrays", count: 8 },
  { type: "dsa", difficulty: "easy", topic: "strings", count: 6 },
  { type: "dsa", difficulty: "easy", topic: "linked lists", count: 5 },
  { type: "dsa", difficulty: "easy", topic: "stacks and queues", count: 5 },
  {
    type: "dsa",
    difficulty: "medium",
    topic: "arrays and two pointers",
    count: 8,
  },
  {
    type: "dsa",
    difficulty: "medium",
    topic: "trees and binary search",
    count: 7,
  },
  { type: "dsa", difficulty: "medium", topic: "graphs BFS DFS", count: 6 },
  { type: "dsa", difficulty: "medium", topic: "dynamic programming", count: 7 },
  { type: "dsa", difficulty: "hard", topic: "dynamic programming", count: 6 },
  { type: "dsa", difficulty: "hard", topic: "graphs advanced", count: 5 },
  {
    type: "system-design",
    difficulty: "medium",
    topic: "scalable web systems",
    count: 5,
  },
  {
    type: "system-design",
    difficulty: "hard",
    topic: "distributed systems",
    count: 5,
  },
  {
    type: "behavioral",
    difficulty: "easy",
    topic: "teamwork communication",
    count: 6,
  },
  {
    type: "behavioral",
    difficulty: "medium",
    topic: "leadership ownership",
    count: 6,
  },
  {
    type: "behavioral",
    difficulty: "medium",
    topic: "conflict prioritization",
    count: 5,
  },
  { type: "frontend", difficulty: "easy", topic: "HTML CSS", count: 5 },
  {
    type: "frontend",
    difficulty: "medium",
    topic: "JavaScript advanced",
    count: 6,
  },
  {
    type: "frontend",
    difficulty: "medium",
    topic: "React hooks state",
    count: 6,
  },
  { type: "backend", difficulty: "easy", topic: "REST APIs HTTP", count: 5 },
  {
    type: "backend",
    difficulty: "medium",
    topic: "databases SQL NoSQL",
    count: 6,
  },
  {
    type: "backend",
    difficulty: "medium",
    topic: "authentication security",
    count: 5,
  },
  {
    type: "backend",
    difficulty: "hard",
    topic: "system architecture Nodejs",
    count: 4,
  },
];

const COMPANIES = {
  dsa: [
    "google",
    "amazon",
    "facebook",
    "microsoft",
    "tcs",
    "infosys",
    "flipkart",
  ],
  "system-design": ["google", "amazon", "uber", "netflix", "flipkart"],
  behavioral: ["amazon", "google", "microsoft", "facebook", "infosys"],
  frontend: ["facebook", "google", "airbnb", "netflix", "shopify"],
  backend: ["amazon", "stripe", "netflix", "uber", "razorpay"],
};

const generateBatch = async ({ type, difficulty, topic, count }) => {
  const prompt = `Generate ${count} unique ${difficulty} ${type} interview questions about "${topic}".
Return ONLY a JSON array. No markdown, no explanation.
Each item: { "title": "...", "body": "...", "hints": ["..."], "evaluationCriteria": ["..."], "tags": ["..."] }
Make questions realistic from actual interviews at top tech companies.`;

  const res = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 3000,
    temperature: 0.8,
  });

  const raw = res.choices[0].message.content;
  const cleaned = raw
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();
  const parsed = JSON.parse(cleaned);
  return Array.isArray(parsed) ? parsed : [];
};

const saveBatch = async (questions, { type, difficulty, topic }) => {
  const cos = (COMPANIES[type] || []).slice(
    0,
    3 + Math.floor(Math.random() * 2),
  );
  const docs = questions.map((q) => ({
    title: q.title,
    body: q.body,
    type,
    difficulty,
    topic: topic.split(" ")[0],
    company: cos,
    hints: q.hints || [],
    evaluationCriteria: q.evaluationCriteria || [],
    tags: q.tags || [],
    isActive: true,
    usageCount: 0,
  }));
  const inserted = await Question.insertMany(docs, { ordered: false });
  return inserted.length;
};

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { dbName: "ai-interview" });
    console.log(" MongoDB connected\n");

    const args = process.argv.slice(2);
    const typeArg = args.find((a) => a.startsWith("--type="))?.split("=")[1];
    const clear = args.includes("--clear");

    if (clear) {
      await Question.deleteMany({});
      console.log("🗑️  Cleared\n");
    }

    const plan = typeArg ? PLAN.filter((p) => p.type === typeArg) : PLAN;
    let generated = 0,
      failed = 0;

    for (const batch of plan) {
      process.stdout.write(
        `  ${batch.type.padEnd(15)} ${batch.difficulty.padEnd(8)} ${batch.topic.padEnd(30)} `,
      );
      try {
        const qs = await generateBatch(batch);
        const saved = await saveBatch(qs, batch);
        generated += saved;
        console.log(` ${saved}`);
      } catch (err) {
        failed++;
        console.log(` ${err.message.slice(0, 50)}`);
      }
      await new Promise((r) => setTimeout(r, 1500));
    }

    const total = await Question.countDocuments();
    console.log(
      `\n Generated: ${generated} | Failed: ${failed} | Total in DB: ${total}`,
    );
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
};

run();
