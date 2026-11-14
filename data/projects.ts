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
  /** Animated preview. Leave out when none exists: cards and pages fall back to the accent glow. */
  preview?: PreviewKind;
}

export const projects: Project[] = [
  {
    slug: "queueless",
    name: "QueueLess",
    subtitle: "Smart college canteen pre-ordering & queue management",
    category: "Mobile · Full Stack",
    filters: ["mobile", "full-stack"],
    status: "live",
    flagship: true,
    period: "2026",
    accent: "#ff6b35",
    summary:
      "Order from the classroom, pick a pickup time, walk up when the food is ready. One Flutter + Firebase app for students, counter staff and the canteen admin.",
    description:
      "QueueLess is the pre-ordering app for the MPSTME canteen. Students order ahead for a pickup time and follow the order live; the same app becomes the kitchen screen for counter staff and the till and menu manager for the canteen admin, with a TV board by the counter showing which numbers are ready. Every role boundary is enforced by the database, not by hiding buttons.",
    problem:
      "When a break starts, everyone reaches the canteen at the same moment: one line to pay, another to collect, and the kitchen only sees demand once people are already standing at the counter.",
    solution:
      "Get the order to the kitchen before the student reaches the counter. A Flutter app on Firebase with three roles and a TV order board. The phone is never trusted: Firestore security rules re-price every order from the live menu, enforce the 60-second change window on the server clock and refuse any step out of order. A pickup pass with a rotating QR code replaces the paper token.",
    features: [
      { label: "Full canteen menu with photos, search, and no-egg and Jain filters", state: "done" },
      { label: "Pickup times that show how busy the counter will be", state: "done" },
      { label: "Wait estimate on every dish, modelled per kitchen station", state: "done" },
      { label: "Live order status with a chime when the food is ready", state: "done" },
      { label: "Pickup pass whose QR code changes every 30 seconds", state: "done" },
      { label: "60-second window to change or cancel, enforced on the server clock", state: "done" },
      { label: "Counter screens, large-type kitchen display and pass scanner", state: "done" },
      { label: "Admin as cashier: one-tap “payment received”, menu, stock, offers and hours", state: "done" },
      { label: "Sales report for today, the last 7 days or the last 30", state: "done" },
      { label: "TV order board on its own read-only login — numbers only", state: "done" },
      { label: "Together: a group chat where friends plan one order", state: "done" },
      { label: "Counter screens in English, Hindi and Marathi", state: "done" },
    ],
    technologies: [
      "Flutter",
      "Dart",
      "Firebase",
      "Firestore",
      "Firebase Auth",
      "Cloud Functions",
      "GitHub Actions",
    ],
    details: [
      "The security rules are the real boundary: 1,550 lines that re-price every order from the menu, refuse a total that does not match and let only the cashier mark an order paid.",
      "610 automated attack checks try to cheat those rules — a lowered price, a student marking an order paid, reading someone else's order, joining a chat without its code — and every one is refused.",
      "After the first security audit the fixed rules were attacked a second time. Nine attacks got through; eight are closed, each with a check that catches it if it returns, and the last, minor one is documented.",
      "The pickup QR holds a code derived from the order's secret key and the time. It changes every 30 seconds and expires a minute after its first scan, so a screenshot is useless.",
      "Daily order numbers come from a per-day counter advanced inside the same Firestore transaction that creates the order, so two students never share a pickup code.",
      "Wait times model a real kitchen: every dish belongs to a station, batches overlap, and an order takes as long as its slowest station with the queue ahead counted in.",
      "594 app tests walk full student, counter and admin journeys at four screen sizes, in light and dark mode and at a larger text size, including a busy day of 220 orders. Any layout that overflows fails the build.",
      "Built by two: I built the backend, a classmate built the front end. The first version was a Next.js web app with Supabase auth, before the Flutter rebuild.",
    ],
    metrics: [
      { value: 284, label: "dishes on the canteen menu" },
      { value: 594, label: "automated app tests" },
      { value: 610, label: "attack checks on the database rules" },
    ],
    architecture: [
      { label: "Roles", detail: "Student · counter · admin · TV board" },
      { label: "App", detail: "Flutter · Provider · repositories" },
      { label: "Auth", detail: "Firebase Auth · App Check" },
      { label: "Rules", detail: "1,550 lines · server-side checks" },
      { label: "Database", detail: "Cloud Firestore" },
    ],
    links: {
      demo: "https://queueless-1be80.web.app",
      extra: [{ label: "Showcase", href: "https://github.com/Vanshlikestocode/queueless-showcase" }],
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
    status: "built",
    flagship: true,
    period: "Jun 2026",
    accent: "#f5b83d",
    summary:
      "Upload a log, get an incident report: severity, probable root cause and next steps from a local Llama 3.",
    description:
      "AI-SRE Agent is an incident-analysis assistant for engineers on call. It reads raw logs and returns a structured incident report — severity, probable root cause and recommended actions — generated by Llama 3 running locally through Ollama.",
    problem:
      "When something breaks, the first minutes of an incident disappear into scrolling logs and guessing which error matters. The signal is there; it is just buried.",
    solution:
      "A FastAPI backend with an /analyze-log endpoint that accepts a log upload, parses it and prompts Llama 3 (LangChain + Ollama, temperature 0) to reason like a senior SRE. A rule-based analyzer came first as a baseline; the LLM path replaced it.",
    features: [
      { label: "FastAPI service", state: "done" },
      { label: "Log upload + parser", state: "done" },
      { label: "POST /analyze-log endpoint", state: "done" },
      { label: "Llama 3 via Ollama + LangChain, temperature 0", state: "done" },
      { label: "AI-generated incident reports", state: "done" },
    ],
    technologies: [
      "Python",
      "FastAPI",
      "Ollama",
      "Llama",
      "LangChain",
      "Uvicorn",
    ],
    details: [
      "The model is served locally by Ollama, so logs are analysed on the machine instead of being sent to a hosted API.",
      "Temperature 0 keeps reports repeatable: the same log produces the same analysis.",
      "Uploaded logs are written to a temporary file, parsed and deleted in a finally block.",
      "The prompt asks for three things only — severity, root cause, recommended actions — which keeps reports short enough to act on.",
    ],
    architecture: [
      { label: "Logs", detail: "Upload · .log file" },
      { label: "API", detail: "FastAPI · /analyze-log" },
      { label: "Parser", detail: "Line extraction" },
      { label: "LLM", detail: "Llama 3 · Ollama" },
      { label: "Report", detail: "Severity · cause · actions" },
    ],
    links: {},
    preview: "sre",
  },
  {
    slug: "orbit",
    name: "ORBIT",
    subtitle: "Testing & reliability lab for AI agents",
    category: "AI Agents · Evaluation",
    filters: ["ai-ml", "full-stack"],
    status: "built",
    period: "Nov 2026",
    accent: "#8b7bff",
    summary:
      "Puts an AI agent in a simulated company, records every action and scores the run with deterministic rules — before the agent touches anything real.",
    description:
      "ORBIT is a testing lab for AI agents. It runs an agent through scenarios at a fictional online retailer, records every tool call as a trace and judges the result with deterministic checks, so you can measure how far to trust an agent — including against simulated attacks — before it acts on real systems. It runs entirely on free, local tools, with real models served by Ollama.",
    problem:
      "Agents tend to be judged on a few happy-path runs and their own summaries. One pass says little about whether an agent respects constraints, recovers from a failing tool or resists an instruction hidden inside a support ticket.",
    solution:
      "A FastAPI + SQLAlchemy backend with an execution engine, simulated tools and injected faults, and a Next.js app to run suites, watch runs live, replay them and compare agents side by side. Every verdict comes from rules over the trace and the final world state, and each one cites the trace events behind it.",
    features: [
      { label: "24 scenarios across 10 categories — single, as a suite or repeated", state: "done" },
      { label: "9 simulated attacks: prompt injection, malicious documents, data disclosure, restricted tools", state: "done" },
      { label: "Scripted baseline agents and real local models through Ollama", state: "done" },
      { label: "Custom scenarios written in the app, scored by the same rules", state: "done" },
      { label: "11 metrics and a configurable, weighted reliability score", state: "done" },
      { label: "Side-by-side agent comparison under identical conditions", state: "done" },
      { label: "Live run view over Server-Sent Events, timeline and replay", state: "done" },
      { label: "Adversarial reports with evidence and suggested fixes", state: "done" },
      { label: "Downloadable Markdown reports for runs, reliability, attacks and comparisons", state: "done" },
      { label: "Production mode: read-only public view, access key, PostgreSQL, Docker", state: "done" },
    ],
    technologies: [
      "Python",
      "FastAPI",
      "SQLAlchemy",
      "Alembic",
      "PostgreSQL",
      "Ollama",
      "Next.js",
      "TypeScript",
      "Recharts",
      "Docker",
    ],
    details: [
      "Scenarios hide their answers: success conditions, failure conditions and injected faults are never shown to the agent, and tests enforce that.",
      "A run passes only when the agent finishes on its own, every success condition holds and no failure condition fires. Each verdict lists the trace events that support it.",
      "Faults are injected on purpose — timeouts, nulls inside well-formed tool replies — to measure error recovery, and a harmless canary secret in the test data catches disclosure.",
      "Against llama3.2 running locally, attacks succeeded in 81% of the 16 runs that reached the model: it pasted a restricted key into its reply and exported the customer database when a user slipped an export into a normal request.",
      "The reliability score is a weighted average over measured components only, and it always appears with its parts. Metrics with no data show a dash and the reason, never a zero.",
      "Alembic migrations and portable column types run the same schema on SQLite locally and PostgreSQL in production.",
    ],
    metrics: [
      { value: 24, label: "test scenarios" },
      { value: 9, label: "simulated attacks" },
      { value: 11, label: "reliability metrics" },
    ],
    architecture: [
      { label: "Agent", detail: "Scripted · Ollama model" },
      { label: "Scenario", detail: "Simulated retailer · faults" },
      { label: "Engine", detail: "Tool calls · trace" },
      { label: "Judge", detail: "Deterministic rules" },
      { label: "Metrics", detail: "11 metrics · reliability score" },
      { label: "App", detail: "Next.js · live view · replay" },
    ],
    links: {
      github: "https://github.com/Vanshlikestocode/orbit",
    },
  },
  {
    slug: "craft",
    name: "Craft",
    subtitle: "“Hey Craft” — a voice assistant that runs your Mac",
    category: "AI Agents · macOS",
    filters: ["ai-ml"],
    status: "built",
    period: "Oct 2026",
    accent: "#ffb4a2",
    summary:
      "Say “Hey Craft” and the Mac does it: open apps, change settings, edit spreadsheets, read the screen. Free by default on Apple's on-device model.",
    description:
      "Craft is a native Swift voice assistant for macOS. It listens on the device for “Hey Craft”, works out what you asked and carries it out with real tools — AppleScript, shell commands, screenshots and web search — then answers out loud. Its default brain is Apple's on-device model, so it needs no account, costs nothing and works offline; Claude can be switched on with your own API key for long, multi-step jobs.",
    problem:
      "Small jobs on a computer still mean hunting for the right app, menu or setting. Voice assistants that could do them either charge per request or send everything you say to a server.",
    solution:
      "A menu bar app in Swift: Apple's long-form dictation engine for the wake word and commands, the Foundation Models framework for the free local brain, an optional Claude Messages API tool loop, and a safety layer that asks “Shall I…?” before anything risky.",
    features: [
      { label: "Always-on wake word and dictation, on the device", state: "done" },
      { label: "Instant local commands: apps, volume, dark mode, time, web search", state: "done" },
      { label: "Free brain on Apple's on-device model (Foundation Models)", state: "done" },
      { label: "Optional Claude brain with your own key, stored in the Keychain", state: "done" },
      { label: "Tools: AppleScript, shell commands, screenshots and web search", state: "done" },
      { label: "Confirmation before deleting, sending, posting, spending or changing settings", state: "done" },
      { label: "Five minutes of conversation memory for follow-ups", state: "done" },
      { label: "⌥ Space command bar for typing instead of speaking", state: "done" },
      { label: "Buddy, an animated character whose mood shows what Craft is doing", state: "done" },
    ],
    technologies: ["Swift", "SwiftUI", "Foundation Models", "Speech", "AppleScript", "Claude API"],
    details: [
      "Listening and speaking always happen on the Mac. With Claude, only the request text — plus a screenshot when you ask about the screen — is sent.",
      "Claude flags risky steps itself, and a built-in list of dangerous commands (rm, sudo, delete, send…) catches anything it misses. Answer by voice or with the buttons; silence means no.",
      "Both brains drive the same tools, so switching from the local model to Claude changes the reasoning, not what Craft can do.",
      "A --selftest mode checks the wake word, instant commands, safety rules and the tool loop offline, against a scripted stand-in for Claude.",
      "With Air Control installed, a raised palm starts Craft listening without the wake word.",
    ],
    architecture: [
      { label: "Voice", detail: "Wake word · on-device dictation" },
      { label: "Router", detail: "Instant local commands" },
      { label: "Brain", detail: "Apple on-device model · Claude" },
      { label: "Tools", detail: "AppleScript · shell · screenshots" },
      { label: "Safety", detail: "“Shall I…?” confirmation" },
      { label: "Reply", detail: "Spoken answer · Buddy" },
    ],
    links: {},
  },
  {
    slug: "air-control",
    name: "Air Control",
    subtitle: "Control your Mac with hand gestures",
    category: "Computer Vision · macOS",
    filters: ["ai-ml"],
    status: "built",
    period: "Oct 2026",
    accent: "#9ae66e",
    summary:
      "Pinch, swipe or hold up a hand sign in front of the camera and the Mac responds. Apple Vision hand tracking, entirely on the device.",
    description:
      "Air Control is a native Swift menu bar app that turns the Mac's camera into a gesture controller. Apple's Vision framework tracks one hand or both; moves like pinch and swipe, ten held hand signs and two-hand gestures each map to an action, and per-app profiles change what a gesture does in the app in front. Nothing is recorded, saved or sent anywhere.",
    problem:
      "Presenting, watching a video across the room, cooking with messy hands — plenty of moments make the trackpad and keyboard the slow part.",
    solution:
      "Vision hand-pose tracking feeds a gesture recogniser with hold-to-confirm rings and a half-second settle time, so passing movements do nothing. Any gesture can run a built-in action, press a keyboard shortcut, open an app or website, or run an Apple Shortcut or AppleScript.",
    features: [
      { label: "Moves: pinch, open-hand swipes, two fingers up, pinch-and-move for volume", state: "done" },
      { label: "Ten hand signs, confirmed by holding still until a ring fills", state: "done" },
      { label: "Two-hand gestures, including pinch-and-pull to zoom", state: "done" },
      { label: "Any gesture runs a shortcut, app, website, Apple Shortcut or AppleScript", state: "done" },
      { label: "Per-app profiles with presets for browsers, YouTube, Meet, Keynote, Zoom and more", state: "done" },
      { label: "Air Mouse: move, pinch to click, drag, right-click and scroll", state: "done" },
      { label: "Grab a window with a fist and throw it to snap it into place", state: "done" },
      { label: "Raise a palm to start Craft listening", state: "done" },
    ],
    technologies: ["Swift", "SwiftUI", "Apple Vision", "AVFoundation", "AppleScript"],
    details: [
      "Hand tracking runs entirely on the Mac with Apple's Vision framework; no frame is stored or sent.",
      "The camera looks 5 times a second until a hand appears, then 30, with an optional auto-off on battery.",
      "A gesture only counts after a hand has been up for half a second, so passing movements trigger nothing.",
      "Profiles fall back to an “Everywhere” set for any gesture they leave out; website profiles read the front browser tab's address.",
      "A --selftest mode checks the gesture and profile logic without a camera.",
    ],
    metrics: [
      { value: 10, label: "held hand signs" },
      { value: 30, label: "frames a second with a hand up" },
      { value: 0.5, decimals: 1, suffix: "s", label: "settle time before a gesture counts" },
    ],
    architecture: [
      { label: "Camera", detail: "AVFoundation · 5 → 30 fps" },
      { label: "Tracking", detail: "Apple Vision hand pose" },
      { label: "Gestures", detail: "Moves · signs · two hands" },
      { label: "Profile", detail: "Front app · Everywhere fallback" },
      { label: "Action", detail: "Shortcut · app · script · air mouse" },
    ],
    links: {},
  },
  {
    slug: "algoguard",
    name: "AlgoGuard",
    subtitle: "NSE trading engine with an enforceable risk layer",
    category: "Quant · Risk",
    filters: ["data", "ai-ml"],
    status: "built",
    period: "Oct 2026",
    accent: "#56c2e6",
    summary:
      "Three rule-based strategies on NSE equities, six guardrails in the execution path, and backtests across 14 years of daily data.",
    description:
      "AlgoGuard asks one research question: does a pre-committed, automatically enforced risk layer reduce tail risk for common retail strategies, and what does it cost in returns? When an algorithm places the orders, the risk engine sits in the execution path, so the rules are actually enforced. Three textbook strategies run through an event-driven backtester with and without the guardrails, and a Streamlit dashboard lets you toggle every rule.",
    problem:
      "Retail traders set risk rules and then break them in the moment. No app can stop a manual trade in a broker's app — but a risk engine can stop an algorithm's.",
    solution:
      "A Python engine: NSE, NIFTY 50 and India VIX data via yfinance; EMA crossover, Donchian breakout and RSI-2 strategies; a guardrail engine with ATR stops, a daily loss limit, a losing-streak cooldown, a drawdown circuit breaker, a VIX filter and volatility-scaled sizing; and an execution layer built around SEBI's retail algo framework.",
    features: [
      { label: "Three long-only strategies: EMA crossover, Donchian breakout, RSI-2", state: "done" },
      { label: "Six guardrails, every intervention logged with its reason", state: "done" },
      { label: "Event-driven backtester: signals at close, fills at next open, 0.15% cost per side", state: "done" },
      { label: "Commitment lock: tightening a rule applies at once, loosening waits up to 7 days", state: "done" },
      { label: "Ablation, parameter grid, cost sensitivity and a yearly walk-forward", state: "done" },
      { label: "Broker layer: 10 orders/s limiter, protected limit orders, Kite Connect mapping", state: "done" },
      { label: "Streamlit dashboard with risk profiles, explain-a-day and a volatility scanner", state: "done" },
      { label: "Volatility-aware NIFTY 50 stock selection with GARCH regimes", state: "done" },
    ],
    technologies: ["Python", "Pandas", "NumPy", "scikit-learn", "Streamlit", "yfinance", "pytest"],
    details: [
      "No look-ahead: decisions for day t use data up to the close of t-1, and a test perturbs future prices to prove it.",
      "Parameters were fixed at textbook values before testing, with 2022 onward held out, so the results are not curve-fitted.",
      "Ablation showed which rule does the work: single rules moved max drawdown by a point or two, while all six together deepened it by 5–6 points on EMA and RSI-2 — the rules interact, and the breaker whipsawed on EMA in 2019.",
      "Strategy-aware v2 settings, chosen on pre-2022 data only, beat the original rule set on all three strategies out of sample.",
      "A 60-session paper-trading replay sent 11 orders through the broker layer; all 11 filled.",
      "In a 2016–2026 walk-forward, the volatility regime switch returned 18.0% CAGR against 10.4% for NIFTY buy-and-hold and fell 7.2% in the COVID crash against 18.6%; an equal-weight NIFTY 50 did better still at 20.3%.",
    ],
    metrics: [
      { value: 6, label: "guardrails in the execution path" },
      { value: 3649, label: "NSE sessions backtested" },
      { value: 26, label: "automated tests" },
    ],
    disclaimer:
      "Backtests on daily bars from unofficial Yahoo data, long-only, on today's large caps — so survivorship bias flatters every strategy equally. These are research results, not investment advice.",
    architecture: [
      { label: "Data", detail: "NSE · NIFTY 50 · India VIX" },
      { label: "Strategy", detail: "EMA · Donchian · RSI-2" },
      { label: "Risk layer", detail: "Six guardrails · commitment lock" },
      { label: "Broker", detail: "Rate limit · protected orders" },
      { label: "Backtest", detail: "Costs · walk-forward" },
      { label: "Dashboard", detail: "Streamlit" },
    ],
    links: {
      github: "https://github.com/Vanshlikestocode/algoguard",
    },
  },
  {
    slug: "finguard",
    name: "FinGuard",
    subtitle: "Banking complaint & fraud-risk analyzer, measured for energy",
    category: "AI / NLP · Green AI",
    filters: ["ai-ml", "data"],
    status: "built",
    period: "Oct 2026",
    accent: "#f0a0d8",
    summary:
      "Reads a bank complaint and predicts its type, fraud risk, sentiment and urgency — then weighs six model families on accuracy and on energy.",
    description:
      "FinGuard is a team NLP project, built with a classmate on the US CFPB Consumer Complaint Database. For each complaint it predicts one of seven complaint types, whether it is fraud-related, how negative the customer is and how urgent it is. Every model is measured for accuracy and for energy, so the model choice rests on both.",
    problem:
      "Banks receive complaints as free text, and fraud cases are buried among routine ones. The reflex answer — the biggest transformer available — is also the most expensive to run on every single complaint.",
    solution:
      "A pipeline that compares TF-IDF + logistic regression, an MLP, a 1D-CNN and a BiLSTM trained from scratch in PyTorch, fine-tuned BERT-base, and DistilBERT distilled from BERT and then quantized to INT8. CodeCarbon measures training and inference energy for every model; VADER and a keyword rule add sentiment and urgency.",
    features: [
      { label: "Seven-class complaint type and a fraud flag, from the text alone", state: "done" },
      { label: "Six model families on the same 70 / 15 / 15 split", state: "done" },
      { label: "Knowledge distillation from BERT-base into DistilBERT", state: "done" },
      { label: "INT8 dynamic quantization of the distilled model", state: "done" },
      { label: "Energy and CO₂ per model with CodeCarbon, plus latency, size and parameters", state: "done" },
      { label: "Fraud threshold set on validation for at least 85% recall", state: "done" },
      { label: "VADER sentiment and an urgency score that ranks complaints by priority", state: "done" },
    ],
    technologies: ["Python", "PyTorch", "Hugging Face", "scikit-learn", "CodeCarbon", "VADER"],
    details: [
      "The TF-IDF + logistic-regression baseline reached 0.82 macro-F1 on complaint type — ahead of fine-tuned BERT-base at 0.73 — with about 57× faster inference.",
      "Complaint type hinges on keywords like “mortgage” or “collector”, which is why a sparse baseline held its own against pre-trained transformers.",
      "INT8 quantization cut the distilled DistilBERT from 266 MB to 138 MB, and its fraud F1 rose slightly, from 0.47 to 0.49.",
      "BERT-base is the teacher: its soft labels are computed once and reused every epoch, and that energy is charged to the student's training cost.",
      "Fraud labels come from the issue categories customers chose, and urgency is a hand-weighted mix of fraud probability, negative sentiment and urgent keywords.",
    ],
    metrics: [
      { value: 0.82, decimals: 2, label: "macro-F1, TF-IDF baseline" },
      { value: 57, prefix: "~", suffix: "×", label: "faster inference than BERT-base" },
      { value: 6, label: "model families compared" },
    ],
    disclaimer:
      "Scores are on a held-out test split of a CFPB sample. Energy figures are CodeCarbon estimates on Google Colab; every model was measured the same way, so the comparison holds.",
    architecture: [
      { label: "Complaint", detail: "CFPB free text" },
      { label: "Preprocess", detail: "Lemmatise · WordPiece" },
      { label: "Models", detail: "TF-IDF · CNN · BiLSTM · BERT" },
      { label: "Compress", detail: "Distillation · INT8" },
      { label: "Measure", detail: "CodeCarbon energy" },
      { label: "Triage", detail: "Type · fraud · urgency" },
    ],
    links: {},
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
