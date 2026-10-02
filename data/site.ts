/**
 * Site-wide identity and links. Everything personal lives here so it can be
 * changed in one place.
 *
 * Contact links below were taken from the previous portfolio
 * (github.com/Vanshlikestocode/vanshdaveportfolio). Set any of them to `null`
 * to hide the button that uses it.
 */

const productionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined;

export const site = {
  name: "Vansh Apurva Dave",
  displayName: "V",
  title: "V — AI Engineer & Product Builder",
  description:
    "Vansh Apurva Dave (V) builds AI-powered products, intelligent systems, data applications and full-stack experiences — from machine-learning APIs to complete consumer apps.",
  /** Canonical URL. Set NEXT_PUBLIC_SITE_URL when deploying to a custom domain. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? productionUrl ?? "http://localhost:3000",
  roles: ["AI Engineer", "Product Builder", "Full-Stack Developer"],
  githubUsername: "Vanshlikestocode",
  links: {
    github: "https://github.com/Vanshlikestocode" as string | null,
    linkedin: "https://www.linkedin.com/in/vanshdave1" as string | null,
    email: "vansh2005d@gmail.com" as string | null,
    /** Add a hosted PDF to show a résumé button in the contact section. */
    resume: null as string | null,
  },
  education: {
    degree: "B.Tech — Artificial Intelligence",
    school: "NMIMS Mukesh Patel School of Technology Management & Engineering",
    period: "2023 — 2027 (expected)",
  },
  certification: {
    name: "CS50: Introduction to Computer Science",
    issuer: "HarvardX",
    year: "2024",
    /** Paste the certificate URL to make the badge clickable. */
    url: null as string | null,
  },
} as const;

export const navItems = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "stack", label: "Stack" },
  { id: "journey", label: "Journey" },
  { id: "contact", label: "Contact" },
] as const;
