import "server-only";

import { site } from "@/data/site";

/**
 * Public GitHub data, fetched at build time and refreshed daily.
 *
 * The contribution calendar comes from the public profile calendar (no token
 * needed). If GITHUB_TOKEN is set, repository requests are authenticated to
 * avoid the anonymous rate limit. Every failure resolves to `null`, and the
 * UI then shows an explicit "unavailable" state instead of invented numbers.
 */

export interface ContributionDay {
  date: string;
  level: 0 | 1 | 2 | 3 | 4;
  count: number;
}

export interface RepoSummary {
  name: string;
  description: string | null;
  language: string | null;
  url: string;
  pushedAt: string;
  homepage: string | null;
}

export interface GitHubData {
  calendar: { weeks: ContributionDay[][]; total: number } | null;
  repos: {
    publicRepos: number;
    languages: { name: string; count: number }[];
    recent: RepoSummary[];
  } | null;
  fetchedAt: string;
}

const REVALIDATE = 60 * 60 * 24;

const headers = (): HeadersInit => ({
  Accept: "application/vnd.github+json",
  "User-Agent": "vansh-portfolio",
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
});

async function fetchCalendar(user: string) {
  const res = await fetch(`https://github.com/users/${user}/contributions`, {
    next: { revalidate: REVALIDATE },
    headers: { "User-Agent": "vansh-portfolio" },
  });
  if (!res.ok) return null;
  const html = await res.text();

  const counts = new Map<string, number>();
  for (const m of html.matchAll(/<tool-tip[^>]*for="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
    const n = m[2].match(/^(\d+) contributions?/);
    counts.set(m[1], n ? Number(n[1]) : 0);
  }

  const days: ContributionDay[] = [];
  for (const m of html.matchAll(/<td[^>]*class="ContributionCalendar-day"[^>]*>/g)) {
    const tag = m[0];
    const date = tag.match(/data-date="([^"]+)"/)?.[1];
    const level = Number(tag.match(/data-level="(\d)"/)?.[1] ?? 0) as ContributionDay["level"];
    const id = tag.match(/id="([^"]+)"/)?.[1];
    if (date) days.push({ date, level, count: (id && counts.get(id)) || 0 });
  }
  if (days.length < 300) return null;

  days.sort((a, b) => a.date.localeCompare(b.date));
  // Group into Sunday-first weeks, like GitHub.
  const weeks: ContributionDay[][] = [];
  let week: ContributionDay[] = [];
  for (const day of days) {
    if (new Date(`${day.date}T00:00:00Z`).getUTCDay() === 0 && week.length) {
      weeks.push(week);
      week = [];
    }
    week.push(day);
  }
  if (week.length) weeks.push(week);

  const heading = html.match(/([\d,]+)\s+contributions?\s+in the last year/);
  const total = heading ? Number(heading[1].replace(/,/g, "")) : days.reduce((s, d) => s + d.count, 0);
  return { weeks, total };
}

interface ApiRepo {
  name: string;
  description: string | null;
  language: string | null;
  html_url: string;
  pushed_at: string;
  homepage: string | null;
  fork: boolean;
}

async function fetchRepos(user: string) {
  const res = await fetch(`https://api.github.com/users/${user}/repos?per_page=100&sort=pushed`, {
    next: { revalidate: REVALIDATE },
    headers: headers(),
  });
  if (!res.ok) return null;
  const repos = (await res.json()) as ApiRepo[];
  const own = repos.filter((r) => !r.fork);

  const tally = new Map<string, number>();
  for (const r of own) if (r.language) tally.set(r.language, (tally.get(r.language) ?? 0) + 1);

  return {
    publicRepos: repos.length,
    languages: [...tally.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
    recent: own.slice(0, 5).map((r) => ({
      name: r.name,
      description: r.description || null,
      language: r.language,
      url: r.html_url,
      pushedAt: r.pushed_at,
      homepage: r.homepage || null,
    })),
  };
}

const safe = <T,>(p: Promise<T>) => p.catch(() => null);

export async function getGitHubData(): Promise<GitHubData> {
  const [calendar, repos] = await Promise.all([
    safe(fetchCalendar(site.githubUsername)),
    safe(fetchRepos(site.githubUsername)),
  ]);
  return { calendar, repos, fetchedAt: new Date().toISOString() };
}
