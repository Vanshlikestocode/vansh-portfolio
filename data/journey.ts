/**
 * The timeline. Dates come from the previous portfolio and commit history;
 * leave `date` empty rather than guessing.
 */

export interface JourneyStep {
  date: string;
  title: string;
  body: string;
  tags: string[];
  /** Links the step to a project panel. */
  project?: string;
  future?: boolean;
}

export const journey: JourneyStep[] = [
  {
    date: "2023",
    title: "B.Tech, Artificial Intelligence",
    body: "Started at NMIMS Mukesh Patel School of Technology Management & Engineering — data structures, DBMS, statistics and the maths behind machine learning.",
    tags: ["NMIMS MPSTME", "Foundations"],
  },
  {
    date: "2024",
    title: "CS50, then the first real projects",
    body: "Finished HarvardX CS50 and started building: an NLP resume analyzer, a sales analytics dashboard, then student-performance analysis and churn prediction.",
    tags: ["CS50", "NLP", "Data analysis", "ML"],
    project: "ai-resume-analyzer",
  },
  {
    date: "Dec 2025",
    title: "Shipping in public",
    body: "Published ML and data repositories on GitHub — fraud detection, credit scoring, transaction EDA — and contributed an agent to an open-source collection.",
    tags: ["GitHub", "scikit-learn", "Open source"],
  },
  {
    date: "2026",
    title: "Full-stack development",
    body: "Moved from notebooks to products: Next.js with Supabase and Prisma, native Android apps in Java, and APIs that serve models to real interfaces.",
    tags: ["Next.js", "Supabase", "Android", "APIs"],
  },
  {
    date: "Jun 2026",
    title: "SMG Fraud Detection",
    body: "First end-to-end ML product: a trained classifier behind a FastAPI endpoint with auth, deployed alongside its own interface.",
    tags: ["FastAPI", "ML serving", "Vercel"],
    project: "smg",
  },
  {
    date: "Jun 2026",
    title: "AI-SRE Agent",
    body: "Started building for engineers: local LLM reasoning over production logs, heading towards an agent that watches metrics and opens issues.",
    tags: ["Llama 3", "Ollama", "LangChain"],
    project: "ai-sre-agent",
  },
  {
    date: "2026",
    title: "QueueLess",
    body: "The biggest build so far: a Flutter + Firebase product with server-enforced rules, staff tooling, tests across screen sizes and a live web release.",
    tags: ["Flutter", "Firebase", "Product"],
    project: "queueless",
  },
  {
    date: "Next",
    title: "Future products",
    body: "Agents that act safely, ML that ships behind real interfaces, and products that remove a queue somewhere. Graduating 2027.",
    tags: ["Agents", "Products", "2027"],
    future: true,
  },
];
