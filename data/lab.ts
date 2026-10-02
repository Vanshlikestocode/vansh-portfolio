/**
 * Smaller builds: coursework apps, early ML repos, prototypes and tooling.
 * Each one exists in a repository or project folder — nothing here is a
 * placeholder. Dates come from commit history or project files.
 */

export type LabDomain = "AI" | "ML" | "APIs" | "UI" | "Mobile" | "Automation" | "Data";

export interface Experiment {
  slug: string;
  name: string;
  domains: LabDomain[];
  summary: string;
  tech: string[];
  date: string;
  link?: string;
}

export const experiments: Experiment[] = [
  {
    slug: "safewalk",
    name: "SafeWalk",
    domains: ["Mobile"],
    summary:
      "Personal-safety Android app: onboarding, permissions, a trusted circle, a live walk timer, a fake incoming call and a manual SOS flow.",
    tech: ["Java", "Android Studio"],
    date: "Sep 2026",
  },
  {
    slug: "expense-tracker",
    name: "Expense Tracker",
    domains: ["Mobile"],
    summary: "Android app to add and review expenses, persisted locally in SQLite.",
    tech: ["Java", "SQLite", "Android Studio"],
    date: "Sep 2026",
  },
  {
    slug: "blood-donation",
    name: "Blood Donation Registry",
    domains: ["Mobile"],
    summary: "Donor records stored in SQLite and rendered through a custom list adapter.",
    tech: ["Java", "SQLite", "Android Studio"],
    date: "Sep 2026",
  },
  {
    slug: "booking-flows",
    name: "Booking Flows ×3",
    domains: ["Mobile", "UI"],
    summary:
      "Three Android booking apps — movies, hotels and food orders — each with a selection flow and a confirmation summary.",
    tech: ["Java", "Android Studio"],
    date: "Aug 2026",
  },
  {
    slug: "webview-shell",
    name: "WebView Shell",
    domains: ["Mobile", "UI"],
    summary: "Android app that switches between a remote website and bundled static HTML inside WebViews.",
    tech: ["Java", "Android Studio"],
    date: "Aug 2026",
  },
  {
    slug: "expression-calculator",
    name: "Expression Calculator",
    domains: ["Mobile"],
    summary: "Android calculator that evaluates whole expressions with the exp4j parser instead of one operation at a time.",
    tech: ["Java", "exp4j", "Android Studio"],
    date: "Jul 2026",
  },
  {
    slug: "queueless-promo",
    name: "Programmatic Promo Film",
    domains: ["Automation", "UI"],
    summary:
      "QueueLess launch film written as an HTML motion piece, rendered frame by frame in headless Chrome at 60 fps, with a voice-over from the system speech engine.",
    tech: ["JavaScript", "Puppeteer", "Swift", "Python"],
    date: "Oct 2026",
  },
  {
    slug: "queueless-tooling",
    name: "QueueLess Ops Tooling",
    domains: ["Automation"],
    summary:
      "Idempotent Node seeders for the Firestore menu and admin roles, a Dart catalogue exporter and a Python brand-asset generator.",
    tech: ["Node.js", "Dart", "Python", "Firebase"],
    date: "Oct 2026",
  },
  {
    slug: "queueless-web-prototype",
    name: "QueueLess Web Prototype",
    domains: ["UI", "APIs"],
    summary:
      "The first take on QueueLess: Next.js with Supabase auth, server-side sessions and middleware-protected dashboard routes.",
    tech: ["Next.js", "Supabase", "TypeScript"],
    date: "Jan 2026",
  },
  {
    slug: "telemetry-unifier",
    name: "Telemetry JSON Unifier",
    domains: ["Automation", "Data"],
    summary:
      "Python script with unit tests that normalises two IoT telemetry JSON formats into one schema — parsing location paths into structured fields.",
    tech: ["Python", "unittest"],
    date: "Jun 2026",
    link: "https://github.com/Vanshlikestocode/deloitte-task1",
  },
  {
    slug: "ai-health-assistant",
    name: "AI Health Assistant",
    domains: ["AI"],
    summary:
      "Rule-based symptom-triage agent prototype, added to my fork of the 500-AI-Agents-Projects collection.",
    tech: ["Python"],
    date: "Dec 2025",
    link: "https://github.com/Vanshlikestocode/500-AI-Agents-Projects/tree/main/projects/ai-health-assistant",
  },
  {
    slug: "fraud-detection-v0",
    name: "Fraud Detection v0",
    domains: ["ML"],
    summary:
      "The first fraud classifier — logistic regression on amount, transaction type and balance. SMG grew out of it.",
    tech: ["Python", "scikit-learn", "Pandas"],
    date: "Dec 2025",
    link: "https://github.com/Vanshlikestocode/fraud-detection-ml",
  },
  {
    slug: "credit-scoring",
    name: "Credit Scoring Model",
    domains: ["ML"],
    summary:
      "Loan-approval classifier on age, income, credit score and loan amount, with an interactive prediction prompt.",
    tech: ["Python", "scikit-learn", "Pandas"],
    date: "Dec 2025",
    link: "https://github.com/Vanshlikestocode/credit-scoring-ml",
  },
  {
    slug: "student-score-predictor",
    name: "Student Score Predictor",
    domains: ["ML"],
    summary: "Linear regression that predicts a score from study hours and attendance, with a fitted scatter plot.",
    tech: ["Python", "scikit-learn", "NumPy", "Matplotlib"],
    date: "Dec 2025",
    link: "https://github.com/Vanshlikestocode/student-performance-prediction",
  },
  {
    slug: "fintech-eda",
    name: "FinTech Transaction EDA",
    domains: ["Data"],
    summary:
      "Exploratory analysis of transactions by type and account balance, with simple high-value risk flags.",
    tech: ["Python", "Pandas", "Matplotlib", "Seaborn"],
    date: "Dec 2025",
    link: "https://github.com/Vanshlikestocode/fintech-transaction-eda",
  },
];

export const labDomains: { id: LabDomain; blurb: string; projects: string[] }[] = [
  { id: "AI", blurb: "Agents, LLMs and reasoning over messy input.", projects: ["ai-sre-agent", "ai-trip-planner", "ai-resume-analyzer"] },
  { id: "ML", blurb: "Classifiers, regressions and honest evaluation.", projects: ["smg", "customer-churn-prediction"] },
  { id: "APIs", blurb: "Typed endpoints that serve models and data.", projects: ["smg", "ai-sre-agent"] },
  { id: "UI", blurb: "Interfaces, motion and the details people touch.", projects: ["queueless", "portfolio-v1"] },
  { id: "Mobile", blurb: "Android in Java, cross-platform in Flutter.", projects: ["queueless"] },
  { id: "Automation", blurb: "Scripts that do the boring parts reliably.", projects: [] },
  { id: "Data", blurb: "Cleaning, exploring and explaining datasets.", projects: ["student-performance-analysis", "sales-data-dashboard"] },
];

/** A dated changelog assembled from commit history and project files. */
export const buildLog: { date: string; project: string; entry: string }[] = [
  { date: "2026-10-02", project: "QueueLess", entry: "Web build compiled to WebAssembly and deployed to Firebase Hosting" },
  { date: "2026-10-02", project: "QueueLess", entry: "Dark mode with a circular theme reveal; phone, tablet and desktop layouts" },
  { date: "2026-10-02", project: "QueueLess", entry: "Production menu seeded — 249 dishes across 17 categories" },
  { date: "2026-10-01", project: "QueueLess", entry: "Security rules: server-clock 60 s window, daily order numbers, reviews" },
  { date: "2026-09-25", project: "SafeWalk", entry: "Trusted circle, fake call and manual SOS flows" },
  { date: "2026-06-18", project: "SMG", entry: "Interface shipped to Vercel; API CORS locked to an allow-list" },
  { date: "2026-06-17", project: "SMG", entry: "Model trained and served behind FastAPI POST /predict" },
  { date: "2026-06-16", project: "AI-SRE Agent", entry: "File-upload /analyze-log endpoint returns AI incident reports" },
  { date: "2026-06-02", project: "AI-SRE Agent", entry: "Llama 3 analyzer through Ollama and LangChain" },
  { date: "2026-06-01", project: "AI-SRE Agent", entry: "FastAPI service, log parser and rule-based baseline" },
  { date: "2026-05-26", project: "AI Trip Planner", entry: "Next.js + Prisma + OpenAI foundation" },
  { date: "2026-01-22", project: "QueueLess", entry: "Web prototype with Next.js and Supabase auth" },
  { date: "2025-12-20", project: "Open source", entry: "AI Health Assistant added to my 500-AI-Agents-Projects fork" },
  { date: "2025-12-19", project: "ML", entry: "Fraud-detection and credit-scoring models published" },
  { date: "2025-12-18", project: "Data", entry: "FinTech EDA and student score predictor published" },
];
