import { experiments } from "./lab";
import { projects } from "./projects";

export type StackGroup = "Languages" | "AI / ML" | "Backend & Data" | "Frontend" | "Mobile" | "Infra & Tools";

export interface Tech {
  name: string;
  group: StackGroup;
  /** What working with it actually looks like — shown on hover. */
  reveals: string[];
  /** Extra names this tech appears under in project data. */
  aliases?: string[];
}

export const stackGroups: StackGroup[] = [
  "Languages",
  "AI / ML",
  "Backend & Data",
  "Frontend",
  "Mobile",
  "Infra & Tools",
];

export const stack: Tech[] = [
  { name: "Python", group: "Languages", reveals: ["ML pipelines", "APIs", "Data analysis", "Scripting"] },
  { name: "JavaScript", group: "Languages", reveals: ["Web interfaces", "Node tooling", "Cloud Functions"] },
  { name: "TypeScript", group: "Languages", reveals: ["Typed React", "Next.js apps", "Safer refactors"] },
  { name: "SQL", group: "Languages", reveals: ["Queries", "Schema design", "Analytics"], aliases: ["SQLite", "PostgreSQL"] },
  { name: "Dart", group: "Languages", reveals: ["Flutter apps", "Async streams", "State management"] },

  { name: "scikit-learn", group: "AI / ML", reveals: ["Machine learning", "Classification", "Prediction", "Evaluation"] },
  { name: "Pandas", group: "AI / ML", reveals: ["Data cleaning", "EDA", "Feature engineering"] },
  { name: "NumPy", group: "AI / ML", reveals: ["Numerical computing", "Arrays", "Vectorisation"] },
  { name: "Ollama", group: "AI / ML", reveals: ["Local LLM serving", "Private inference"] },
  { name: "Llama", group: "AI / ML", reveals: ["Open-weight LLMs", "Incident reasoning", "Llama 3"] },
  { name: "OpenAI APIs", group: "AI / ML", reveals: ["LLM apps", "Structured output", "Prompt design"] },

  { name: "FastAPI", group: "Backend & Data", reveals: ["Backend APIs", "REST", "Python", "ML serving"] },
  { name: "Firebase", group: "Backend & Data", reveals: ["Auth", "Hosting", "Cloud Functions", "Messaging"], aliases: ["Firebase Auth", "Cloud Functions", "FCM"] },
  { name: "Firestore", group: "Backend & Data", reveals: ["Realtime data", "Security rules", "Transactions"] },
  { name: "Supabase", group: "Backend & Data", reveals: ["Postgres", "Auth", "Server-side sessions"] },
  { name: "MySQL", group: "Backend & Data", reveals: ["Relational databases", "SQL", "Joins"] },
  { name: "Stripe", group: "Backend & Data", reveals: ["Payments", "Checkout"] },

  { name: "Next.js", group: "Frontend", reveals: ["App Router", "Static + server rendering", "Full-stack React"] },
  { name: "React", group: "Frontend", reveals: ["Component systems", "Hooks", "Interactive UI"], aliases: ["Next.js"] },

  { name: "Flutter", group: "Mobile", reveals: ["Mobile apps", "Dart", "Cross-platform", "Web (WASM)"] },
  { name: "Android Studio", group: "Mobile", reveals: ["Native Android", "Java", "SQLite"] },

  { name: "Git", group: "Infra & Tools", reveals: ["Version control", "Branching", "History"] },
  { name: "GitHub", group: "Infra & Tools", reveals: ["Repositories", "Collaboration", "Open source"], aliases: ["GitHub Pages"] },
  { name: "Docker", group: "Infra & Tools", reveals: ["Containers", "Reproducible environments"] },
  { name: "Render", group: "Infra & Tools", reveals: ["Python API hosting", "Blueprint deploys"] },
  { name: "Vercel", group: "Infra & Tools", reveals: ["Next.js hosting", "Preview deploys"] },
];

export interface TechUsage {
  slug: string;
  name: string;
  kind: "project" | "experiment";
}

/** Where each technology shows up across projects and experiments. */
export function usageFor(tech: Tech): TechUsage[] {
  const names = new Set([tech.name, ...(tech.aliases ?? [])]);
  const fromProjects = projects
    .filter((p) => p.technologies.some((t) => names.has(t)))
    .map((p) => ({ slug: p.slug, name: p.name, kind: "project" as const }));
  const fromExperiments = experiments
    .filter((e) => e.tech.some((t) => names.has(t)))
    .map((e) => ({ slug: e.slug, name: e.name, kind: "experiment" as const }));
  return [...fromProjects, ...fromExperiments];
}

/** Technologies that share at least one project with `tech`. */
export function relatedTech(tech: Tech): string[] {
  const mine = new Set(usageFor(tech).map((u) => u.slug));
  return stack
    .filter((t) => t.name !== tech.name && usageFor(t).some((u) => mine.has(u.slug)))
    .map((t) => t.name);
}
