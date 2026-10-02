/**
 * Every project on the site is described here. Add a project by appending an
 * object to `projects`; the work index, filters, stack graph, sitemap and
 * project pages all read from this list.
 *
 * Rules this file follows: no invented metrics, users or links. Numbers in
 * `metrics` are either facts about the product (e.g. menu size) or results
 * reported by the project itself, with a `disclaimer` where context matters.
 */

export type ProjectStatus = "live" | "built" | "in-progress" | "experiment";

export type FilterKey = "all" | "ai-ml" | "full-stack" | "data" | "mobile" | "experiments";

export type PreviewKind =
  | "queueless"
  | "smg"
  | "sre"
  | "resume"
  | "trip"
  | "churn"
  | "student"
  | "sales"
  | "portfolio";

export type FeatureState = "done" | "building" | "planned";

export interface Feature {
  label: string;
  state: FeatureState;
}

export interface Metric {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

export interface ArchNode {
  label: string;
  detail: string;
  planned?: boolean;
}

export interface Project {
  slug: string;
  name: string;
  subtitle: string;
  /** Short display category, e.g. "AI / NLP". */
  category: string;
  filters: Exclude<FilterKey, "all">[];
  status: ProjectStatus;
  /** Flagship projects get a full showcase panel above the index. */
  flagship?: boolean;
  period?: string;
  /** Project identity colour, used for glows and previews. */
  accent: string;
  summary: string;
  description: string;
  problem: string;
  solution: string;
  features: Feature[];
  technologies: string[];
  details: string[];
  metrics?: Metric[];
  disclaimer?: string;
  architecture?: ArchNode[];
  links: {
    github?: string;
    demo?: string;
    extra?: { label: string; href: string }[];
  };
  preview: PreviewKind;
}

export const projects: Project[] = [
  {
    slug: "queueless",
    name: "QueueLess",
    subtitle: "Smart college canteen pre-ordering & queue management",
    category: "Mobile · Full Stack",
    filters: ["mobile", "full-stack"],
    status: "in-progress",
    flagship: true,
    period: "2026 — ongoing",
    accent: "#ff6b35",
    summary:
      "Order ahead, skip the line. A Flutter + Firebase app that turns the canteen queue into a pickup code.",
    description:
      "QueueLess is a smart college canteen app built to remove the physical queue. Students browse the full menu, order for a pickup slot and follow the order live; canteen staff run the whole pipeline — accept, prepare, hand over — from a dashboard.",
    problem:
      "At peak hours a college canteen becomes one long line: wait to order, wait to pay, wait again to collect. The canteen sees demand only when people are already standing at the counter.",
    solution:
      "A cross-platform Flutter app on Firebase. Students order ahead and get a short daily order number that doubles as the pickup code. Staff move orders through the pipeline from a dashboard and a pickup counter. The rules that matter — like the 60-second change window — are enforced by the server, not just the UI.",
    features: [
      { label: "Student sign-up, login & profile", state: "done" },
      { label: "Menu with categories, search & live availability", state: "done" },
      { label: "Cart with quantities and sold-out protection", state: "done" },
      { label: "Live order tracking — placed → preparing → ready → collected", state: "done" },
      { label: "60-second window to modify or cancel, enforced by security rules", state: "done" },
      { label: "Daily order numbers that double as pickup codes", state: "done" },
      { label: "Staff dashboard and one-tap pickup counter", state: "done" },
      { label: "Dish ratings and reviews", state: "done" },
      { label: "Food-card, text-reveal and add-to-cart animations", state: "done" },
      { label: "Dark mode and phone / tablet / desktop layouts", state: "done" },
      { label: "Firestore security rules, App Check and error states", state: "done" },
      { label: "Razorpay online payments and automatic refunds", state: "building" },
      { label: "Order-ready push notifications (FCM)", state: "building" },
    ],
    technologies: [
      "Flutter",
      "Dart",
      "Firebase",
      "Firestore",
      "Cloud Functions",
      "Firebase Auth",
      "FCM",
      "Razorpay",
      "Supabase",
    ],
    details: [
      "Firestore security rules check the 60-second modify/cancel window against the server clock and limit staff to toggling dish availability.",
      "Order numbers come from a per-day counter updated inside a Firestore transaction, so two students can never receive the same pickup code.",
      "Payments, refunds, server-side price checks and push notifications are written as Cloud Functions (Razorpay + FCM) and staged for deployment.",
      "A repository layer with a complete in-memory demo backend lets the whole app run — and be tested — without Firebase.",
      "Widget walkthrough tests drive student and staff flows at phone, tablet and desktop sizes, in light and dark mode.",
      "The web build compiles to WebAssembly and is served from Firebase Hosting.",
      "An earlier web prototype explored the idea with Next.js and Supabase auth before the Flutter rebuild.",
    ],
    metrics: [
      { value: 249, label: "dishes on the live menu" },
      { value: 17, label: "menu categories" },
      { value: 60, suffix: "s", label: "server-enforced change window" },
    ],
    architecture: [
      { label: "Student", detail: "Flutter app · web, Android, iOS" },
      { label: "App state", detail: "Provider · repositories" },
      { label: "Auth", detail: "Firebase Auth · App Check" },
      { label: "Database", detail: "Firestore + security rules" },
      { label: "Functions", detail: "Razorpay · FCM", planned: true },
      { label: "Pickup", detail: "Staff dashboard · order code" },
    ],
    links: {
      demo: "https://queueless-1be80.web.app",
    },
    preview: "queueless",
  },
  {
    slug: "smg",
    name: "SMG",
    subtitle: "Fraud detection & risk analysis platform",
    category: "AI / ML · FinTech",
    filters: ["ai-ml", "full-stack"],
    status: "live",
    flagship: true,
    period: "Jun 2026",
    accent: "#3ddc97",
    summary:
      "A fraud classifier served through a FastAPI /predict endpoint, with a Next.js interface deployed on Vercel.",
    description:
      "SMG is a machine-learning platform for flagging potentially fraudulent card transactions. A logistic-regression model trained with scikit-learn is saved as model.pkl and served by a FastAPI service that returns a prediction and a fraud probability for every transaction.",
    problem:
      "Fraud is rare — a tiny fraction of all transactions — but every miss is expensive. A useful system has to score each transaction quickly, say how confident it is, and be callable from any front end.",
    solution:
      "An end-to-end pipeline: exploration and training in Python, a persisted model, a typed FastAPI inference API with API-key auth and a CORS allow-list, Render deployment config, and a separate Next.js interface on Vercel.",
    features: [
      { label: "Logistic-regression classifier (scikit-learn)", state: "done" },
      { label: "POST /predict returns prediction + fraud probability", state: "done" },
      { label: "Pydantic schema for 30 transaction features", state: "done" },
      { label: "API-key header auth and CORS allow-list", state: "done" },
      { label: "Render deployment blueprint (render.yaml)", state: "done" },
      { label: "Next.js + Framer Motion interface on Vercel", state: "done" },
    ],
    technologies: [
      "Python",
      "scikit-learn",
      "Pandas",
      "FastAPI",
      "Uvicorn",
      "Pydantic",
      "Render",
      "Next.js",
      "TypeScript",
      "Vercel",
    ],
    details: [
      "The model is exposed through a FastAPI POST /predict endpoint that returns the class, a human-readable label and the fraud probability rounded to four decimals.",
      "Each request is validated against a Pydantic model of 30 numeric features: Time, the anonymised components V1–V28 and Amount.",
      "Requests must carry an x-api-key header that matches a server-side secret; CORS is restricted to an allow-list of origins.",
      "The trained model is serialised with joblib and loaded once at startup, so each prediction is a single in-memory call.",
      "Deployed as a Uvicorn web service through a render.yaml blueprint; the interface lives in its own repository on Vercel.",
    ],
    metrics: [
      { value: 99.9, decimals: 2, suffix: "%", label: "reported test accuracy" },
      { value: 30, label: "features per transaction" },
      { value: 20, suffix: "%", label: "held-out test split" },
    ],
    disclaimer:
      "99.90% is the accuracy reported on a held-out 20% split of a public, heavily imbalanced credit-card dataset. Because fraud is a tiny share of that data, accuracy alone overstates real-world performance — precision and recall on the fraud class are what matter, and the model has not been validated on live transactions.",
    architecture: [
      { label: "Transaction", detail: "JSON · 30 features" },
      { label: "API", detail: "FastAPI · POST /predict" },
      { label: "Auth", detail: "x-api-key · CORS allow-list" },
      { label: "Model", detail: "Logistic regression · model.pkl" },
      { label: "Result", detail: "Fraud probability · label" },
    ],
    links: {
      github: "https://github.com/Vanshlikestocode/SMG-Fraud-Detection",
      demo: "https://smg-fraud-ui.vercel.app",
      extra: [{ label: "Interface repo", href: "https://github.com/Vanshlikestocode/SMG-Fraud-UI" }],
    },
    preview: "smg",
  },
  {
    slug: "ai-sre-agent",
    name: "AI-SRE Agent",
    subtitle: "AI-powered incident analysis & root-cause assistant",
    category: "AI Agents · Infrastructure",
    filters: ["ai-ml", "full-stack"],
    status: "in-progress",
    flagship: true,
    period: "Jun 2026 — ongoing",
    accent: "#f5b83d",
    summary:
      "Upload a log, get an incident report: severity, probable root cause and next steps from a local Llama 3.",
    description:
      "AI-SRE Agent is an incident-analysis assistant for engineers on call. It reads raw logs and returns a structured incident report — severity, probable root cause and recommended actions — generated by Llama 3 running locally through Ollama.",
    problem:
      "When something breaks, the first minutes of an incident disappear into scrolling logs and guessing which error matters. The signal is there; it is just buried.",
    solution:
      "A FastAPI backend with an /analyze-log endpoint that accepts a log upload, parses it and prompts Llama 3 (LangChain + Ollama, temperature 0) to reason like a senior SRE. A rule-based analyzer came first as a baseline; the LLM path replaced it. The next stage turns it into an agent that watches metrics and opens issues.",
    features: [
      { label: "FastAPI service", state: "done" },
      { label: "Log upload + parser", state: "done" },
      { label: "POST /analyze-log endpoint", state: "done" },
      { label: "Llama 3 via Ollama + LangChain, temperature 0", state: "done" },
      { label: "AI-generated incident reports", state: "done" },
      { label: "Prometheus metrics + incident detection", state: "planned" },
      { label: "Grafana dashboards", state: "planned" },
      { label: "LangGraph multi-step root-cause agent", state: "planned" },
      { label: "PostgreSQL incident history", state: "planned" },
      { label: "Docker packaging", state: "planned" },
      { label: "Automated GitHub issue creation", state: "planned" },
      { label: "Safe, approval-gated remediation workflows", state: "planned" },
    ],
    technologies: [
      "Python",
      "FastAPI",
      "Ollama",
      "Llama",
      "LangChain",
      "Uvicorn",
      "LangGraph",
      "Prometheus",
      "Grafana",
      "Docker",
      "PostgreSQL",
    ],
    details: [
      "The model is served locally by Ollama, so logs are analysed on the machine instead of being sent to a hosted API.",
      "Temperature 0 keeps reports repeatable: the same log produces the same analysis.",
      "Uploaded logs are written to a temporary file, parsed and deleted in a finally block.",
      "The prompt asks for three things only — severity, root cause, recommended actions — which keeps reports short enough to act on.",
      "LangGraph, Prometheus, Grafana, PostgreSQL and Docker are the planned next stage, not part of the current build.",
    ],
    architecture: [
      { label: "Logs", detail: "Upload · .log file" },
      { label: "API", detail: "FastAPI · /analyze-log" },
      { label: "Parser", detail: "Line extraction" },
      { label: "LLM", detail: "Llama 3 · Ollama" },
      { label: "Report", detail: "Severity · cause · actions" },
      { label: "Action", detail: "GitHub issue · remediation", planned: true },
    ],
    links: {},
    preview: "sre",
  },
  {
    slug: "ai-resume-analyzer",
    name: "AI Resume Analyzer",
    subtitle: "ATS-oriented resume analysis & feedback",
    category: "AI / NLP",
    filters: ["ai-ml"],
    status: "built",
    period: "Aug — Oct 2024",
    accent: "#7fd1ff",
    summary:
      "Reads a resume the way an applicant-tracking system would, scores it against a job description and suggests fixes.",
    description:
      "An NLP tool that analyses resumes like an ATS: it extracts skills, scores the match against a job description with TF-IDF and cosine similarity, and turns the gaps into concrete improvement suggestions.",
    problem:
      "Most resumes are filtered by software before a person reads them, and candidates rarely learn why theirs did not make it through.",
    solution:
      "A Python pipeline: text extraction and cleaning (tokenisation, stop-word removal), TF-IDF vectorisation, cosine similarity against the job description, skill extraction, and ranked feedback with improvement suggestions.",
    features: [
      { label: "Resume parsing and text cleaning", state: "done" },
      { label: "Skill extraction", state: "done" },
      { label: "ATS-style match score against a job description", state: "done" },
      { label: "Ranking multiple resumes for one role", state: "done" },
      { label: "Improvement recommendations", state: "done" },
    ],
    technologies: ["Python", "NLP", "TF-IDF"],
    details: [
      "Resumes and job descriptions are tokenised, stripped of stop words and vectorised with TF-IDF.",
      "Cosine similarity between the vectors gives the match score used for ranking.",
      "Missing high-weight terms from the job description become specific suggestions rather than a generic score.",
    ],
    architecture: [
      { label: "Resume", detail: "Raw document" },
      { label: "Parse", detail: "Tokenise · clean" },
      { label: "Vectorise", detail: "TF-IDF" },
      { label: "Match", detail: "Cosine similarity vs JD" },
      { label: "Feedback", detail: "Score · gaps · fixes" },
    ],
    links: {},
    preview: "resume",
  },
  {
    slug: "ai-trip-planner",
    name: "AI Trip Planner",
    subtitle: "Travel requirements in, structured itinerary out",
    category: "AI / Product",
    filters: ["ai-ml", "full-stack"],
    status: "in-progress",
    period: "May 2026 — ongoing",
    accent: "#4fd1c5",
    summary:
      "A Next.js app that turns a destination, dates and preferences into a day-by-day itinerary with an LLM.",
    description:
      "An AI-powered travel planner that takes a destination, trip length and preferences and turns them into a structured, day-by-day itinerary.",
    problem:
      "Planning a trip means juggling dozens of tabs — places, timings, budgets — and stitching them into a plan by hand.",
    solution:
      "A Next.js + TypeScript app with a validated input form (React Hook Form + Zod), the OpenAI API for itinerary generation and Prisma on PostgreSQL for saved trips. The foundation is in place; the planning flow is being built now.",
    features: [
      { label: "Next.js app foundation and UI components", state: "done" },
      { label: "Prisma + PostgreSQL data layer", state: "done" },
      { label: "Typed trip-requirements form (Zod)", state: "building" },
      { label: "LLM itinerary generation", state: "building" },
      { label: "Saved trips", state: "planned" },
    ],
    technologies: ["Next.js", "TypeScript", "OpenAI APIs", "Prisma", "PostgreSQL", "Zod", "Tailwind CSS"],
    details: [
      "Requirements are validated with Zod before they reach the model, so the prompt always receives a complete, typed request.",
      "The model is asked for structured output — days, time blocks, places — that the UI can render as an itinerary rather than a wall of text.",
      "Trips are modelled in Prisma on PostgreSQL so plans can be saved and revisited.",
    ],
    architecture: [
      { label: "Destination", detail: "Where · when · how long" },
      { label: "Preferences", detail: "Pace · budget · interests" },
      { label: "AI planning", detail: "OpenAI API · structured output" },
      { label: "Itinerary", detail: "Day-by-day plan" },
      { label: "Trip", detail: "Saved · Prisma / Postgres", planned: true },
    ],
    links: {},
    preview: "trip",
  },
  {
    slug: "customer-churn-prediction",
    name: "Customer Churn Prediction",
    subtitle: "Predicting which customers are likely to leave",
    category: "Machine Learning",
    filters: ["ai-ml", "data"],
    status: "built",
    period: "May — Jun 2025",
    accent: "#ff8fa3",
    summary:
      "Classification models that estimate churn risk from customer data, with the drivers behind each prediction.",
    description:
      "A machine-learning project that predicts whether customers are likely to churn based on customer-related data, using logistic regression and decision trees.",
    problem:
      "Keeping a customer is cheaper than winning a new one — but only if you know who is about to leave, and why.",
    solution:
      "Feature engineering and statistical analysis on customer records, then logistic-regression and decision-tree classifiers that output a churn probability, with visual reports on the main churn drivers.",
    features: [
      { label: "Feature engineering on customer records", state: "done" },
      { label: "Logistic regression and decision-tree models", state: "done" },
      { label: "Churn probability per customer", state: "done" },
      { label: "Visual reports on churn drivers", state: "done" },
    ],
    technologies: ["Python", "scikit-learn"],
    details: [
      "Two model families were compared: an interpretable logistic regression and a decision tree that captures non-linear splits.",
      "Statistical analysis of the features was used to explain which factors move churn risk the most.",
    ],
    metrics: [{ value: 72, prefix: "~", suffix: "%", label: "reported accuracy" }],
    disclaimer:
      "~72% is the accuracy reported for this dataset and train/test split. It is not a general-purpose figure and would need re-validation on any other customer base.",
    architecture: [
      { label: "Customer data", detail: "Records · usage · contract" },
      { label: "Features", detail: "Engineering · scaling" },
      { label: "Model", detail: "Logistic regression · tree" },
      { label: "Probability", detail: "Churn risk 0–1" },
    ],
    links: {},
    preview: "churn",
  },
  {
    slug: "student-performance-analysis",
    name: "Student Performance Data Analysis",
    subtitle: "Finding what actually moves student outcomes",
    category: "Data Analytics",
    filters: ["data"],
    status: "built",
    period: "Jan — Mar 2025",
    accent: "#e8d35b",
    summary:
      "Cleaning, exploring and visualising student data to surface the relationships behind performance.",
    description:
      "A data analysis project focused on discovering patterns and relationships in student performance data — from raw records to clear, visual insights.",
    problem:
      "Raw student records are noisy — missing values, outliers, inconsistent fields — which hides the patterns educators actually care about.",
    solution:
      "A Pandas and NumPy pipeline for cleaning and outlier treatment, followed by exploratory analysis and visualisation — heatmaps, distributions and trend charts — to surface relationships such as study time versus scores.",
    features: [
      { label: "Data cleaning and outlier treatment", state: "done" },
      { label: "Exploratory data analysis", state: "done" },
      { label: "Correlation analysis", state: "done" },
      { label: "Heatmaps, distributions and trend charts", state: "done" },
      { label: "Written insight summary", state: "done" },
    ],
    technologies: ["Python", "Pandas", "NumPy", "Matplotlib", "Seaborn"],
    details: [
      "Missing values and outliers are handled before any analysis so the correlations reflect the data, not its errors.",
      "Correlation heatmaps guide which relationships deserve a closer look with distribution and trend plots.",
    ],
    architecture: [
      { label: "Raw data", detail: "Student records" },
      { label: "Clean", detail: "Missing values · outliers" },
      { label: "Explore", detail: "EDA · correlations" },
      { label: "Insight", detail: "Charts · findings" },
    ],
    links: {},
    preview: "student",
  },
  {
    slug: "sales-data-dashboard",
    name: "Sales Data Dashboard",
    subtitle: "Turning raw sales data into business decisions",
    category: "Data Analytics",
    filters: ["data"],
    status: "built",
    period: "Oct — Dec 2024",
    accent: "#6cb8ff",
    summary:
      "Revenue, orders, growth, top products and regional performance — analysed in Python and presented as a dashboard.",
    description:
      "An analytics dashboard for understanding sales performance and extracting business insights from sales data.",
    problem:
      "Sales data usually lives in spreadsheets that answer “what happened” slowly and “why” not at all.",
    solution:
      "Python analysis across monthly, category and regional dimensions — including time-series trend and seasonality analysis — presented as a dashboard of revenue, orders, growth, top products and regional performance.",
    features: [
      { label: "Revenue and order KPIs", state: "done" },
      { label: "Month-over-month growth", state: "done" },
      { label: "Top products", state: "done" },
      { label: "Regional performance", state: "done" },
      { label: "Trend and seasonality analysis", state: "done" },
    ],
    technologies: ["Python", "Pandas", "Excel"],
    details: [
      "Transactions are aggregated by month, category and region so the same data answers three different questions.",
      "Time-series decomposition separates trend from seasonality, so a good December is not mistaken for growth.",
    ],
    architecture: [
      { label: "Sales data", detail: "Transactions" },
      { label: "Aggregate", detail: "Month · category · region" },
      { label: "Analyse", detail: "Trend · seasonality" },
      { label: "Dashboard", detail: "KPIs · charts" },
    ],
    links: {},
    preview: "sales",
  },
  {
    slug: "portfolio-v1",
    name: "Portfolio v1",
    subtitle: "The previous version of this site",
    category: "Web",
    filters: ["experiments"],
    status: "live",
    period: "May 2026",
    accent: "#00e5f0",
    summary:
      "A single-file HTML, CSS and JavaScript site with a Three.js background. This site replaces it.",
    description:
      "The first version of my portfolio: one hand-written HTML file with a Three.js particle background, scroll reveals and a light/dark theme, deployed on GitHub Pages. The site you are on now is its successor.",
    problem: "I needed a place to show my work — and a reason to learn how the web actually renders.",
    solution:
      "A dependency-light static site: vanilla JavaScript for reveals and navigation, a Three.js canvas for depth, deployed straight from the repository to GitHub Pages.",
    features: [
      { label: "Three.js particle background", state: "done" },
      { label: "Scroll-triggered reveals", state: "done" },
      { label: "Light / dark theme", state: "done" },
      { label: "Replaced by v2 (this site)", state: "done" },
    ],
    technologies: ["JavaScript", "Three.js", "GitHub Pages"],
    details: [
      "v2 rebuilds everything in Next.js, TypeScript, Tailwind CSS and Motion, with project data kept in structured files.",
    ],
    links: {
      github: "https://github.com/Vanshlikestocode/vanshdaveportfolio",
      demo: "https://vanshlikestocode.github.io/vanshdaveportfolio/",
    },
    preview: "portfolio",
  },
];

export const flagshipProjects = projects.filter((p) => p.flagship);

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
