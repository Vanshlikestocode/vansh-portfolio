"use client";

import { ArrowUpRight } from "lucide-react";
import { useInView } from "motion/react";
import { useEffect, useRef } from "react";
import { Counter } from "@/components/ui/Counter";
import { Magnetic } from "@/components/ui/Magnetic";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/data/site";
import type { ContributionDay, GitHubData } from "@/lib/github";
import { cn } from "@/lib/utils";

const LEVEL_BG = [
  "rgb(236 235 230 / 0.05)",
  "color-mix(in oklab, var(--color-signal) 32%, transparent)",
  "color-mix(in oklab, var(--color-signal) 55%, transparent)",
  "color-mix(in oklab, var(--color-signal) 78%, transparent)",
  "var(--color-signal)",
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const monthYear = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { month: "short", year: "numeric", timeZone: "UTC" });

export function GitHubPanel({ data }: { data: GitHubData }) {
  const { calendar, repos } = data;
  const grid = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const inView = useInView(grid, { once: true, amount: 0.3 });

  // On narrow screens, start the calendar at the most recent weeks.
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, []);

  const weeks = calendar?.weeks ?? placeholderWeeks();
  const monthMarks = weeks.map((w, i) => {
    const first = w[0];
    if (!first || !calendar) return null;
    const d = new Date(`${first.date}T00:00:00Z`);
    const prev = weeks[i - 1]?.[0];
    const changed = !prev || new Date(`${prev.date}T00:00:00Z`).getUTCMonth() !== d.getUTCMonth();
    return changed && i < weeks.length - 2 ? MONTHS[d.getUTCMonth()] : null;
  });

  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-ink-2">
      <div className="flex flex-col gap-6 border-b border-line p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="flex items-center gap-4">
          <span className="display grid size-14 place-items-center rounded-2xl border border-line-2 bg-ink text-3xl text-paper">
            V<span className="text-signal">.</span>
          </span>
          <div>
            <p className="text-lg font-medium text-paper">{site.name}</p>
            <p className="font-mono text-sm text-mute">@{site.githubUsername}</p>
          </div>
        </div>
        {site.links.github && (
          <Magnetic href={site.links.github} external variant="outline">
            View GitHub <ArrowUpRight className="size-4" />
          </Magnetic>
        )}
      </div>

      <div className="grid gap-px bg-line lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 bg-ink-2 p-6 sm:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <p className="label text-mute">Contributions · last 12 months</p>
            {calendar ? (
              <p className="text-sm text-paper-dim">
                <Counter value={calendar.total} className="font-medium text-paper" /> contributions in the last year
              </p>
            ) : (
              <p className="text-sm text-mute">Live data unavailable right now</p>
            )}
          </div>

          <div ref={scroller} className="no-scrollbar mt-6 overflow-x-auto">
            <div
              ref={grid}
              role="img"
              aria-label={
                calendar
                  ? `GitHub contribution calendar: ${calendar.total} contributions in the last year.`
                  : "GitHub contribution calendar placeholder: live data could not be loaded."
              }
              className="min-w-[640px]"
              style={{ ["--weeks" as string]: weeks.length }}
            >
              <div
                className="mb-2 grid h-3 gap-[3px] font-mono text-[9px] text-faint"
                style={{ gridTemplateColumns: "repeat(var(--weeks), minmax(0, 1fr))" }}
                aria-hidden="true"
              >
                {monthMarks.map((m, i) => (
                  <span key={i} className="relative">
                    {m && <span className="absolute left-0 top-0 whitespace-nowrap">{m}</span>}
                  </span>
                ))}
              </div>
              <div
                className="grid grid-flow-col grid-rows-7 gap-[3px]"
                style={{ gridTemplateColumns: "repeat(var(--weeks), minmax(0, 1fr))" }}
                aria-hidden="true"
              >
                {weeks.flatMap((week, wi) => {
                  // The first week starts mid-week: pad it so weekdays line up.
                  const pad = wi === 0 ? 7 - week.length : 0;
                  return [
                    ...Array.from({ length: pad }, (_, k) => <span key={`pad-${k}`} />),
                    ...week.map((day) => (
                      <span
                        key={day.date}
                        title={calendar ? `${day.count} contribution${day.count === 1 ? "" : "s"} · ${day.date}` : undefined}
                        className={cn(
                          "block aspect-square rounded-[3px] transition-[opacity,transform] duration-500",
                          !calendar && "opacity-40",
                        )}
                        style={{
                          backgroundColor: LEVEL_BG[day.level],
                          opacity: inView ? undefined : 0,
                          transform: inView ? undefined : "scale(0.4)",
                          transitionDelay: inView ? `${wi * 14}ms` : "0ms",
                        }}
                      />
                    )),
                  ];
                })}
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <p className="max-w-lg text-sm text-mute">
              QueueLess and AI-SRE Agent are developed outside public GitHub, so their history doesn&apos;t appear in
              this graph.
            </p>
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-faint" aria-hidden="true">
              Less
              {LEVEL_BG.map((bg) => (
                <span key={bg} className="size-[10px] rounded-[2px]" style={{ backgroundColor: bg }} />
              ))}
              More
            </div>
          </div>

          {calendar && <CalendarStats weeks={calendar.weeks} />}
        </div>

        <div className="min-w-0 bg-ink-2 p-6 sm:p-8">
          {repos ? (
            <>
              <div className="flex items-baseline justify-between">
                <p className="label text-mute">Public repositories</p>
                <p className="display text-3xl text-paper">
                  <Counter value={repos.publicRepos} />
                </p>
              </div>
              <Languages languages={repos.languages} />
              <p className="label mt-8 text-mute">Recently pushed</p>
              <ul className="mt-3 divide-y divide-line">
                {repos.recent.map((r, i) => (
                  <Reveal as="li" key={r.name} delay={i * 0.05}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="link"
                      className="group flex items-center justify-between gap-3 py-3"
                    >
                      <span className="min-w-0">
                        <span className="block truncate font-mono text-sm text-paper transition-colors group-hover:text-signal">
                          {r.name}
                        </span>
                        <span className="text-xs text-faint">
                          {[r.language, monthYear(r.pushedAt)].filter(Boolean).join(" · ")}
                        </span>
                      </span>
                      <ArrowUpRight className="size-4 shrink-0 text-faint transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-paper" />
                    </a>
                  </Reveal>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-sm text-mute">Repository data couldn&apos;t be loaded at build time. The profile link above always works.</p>
          )}
        </div>
      </div>
    </div>
  );
}

/** Facts derived from the same calendar data — nothing added by hand. */
function CalendarStats({ weeks }: { weeks: ContributionDay[][] }) {
  const days = weeks.flat();
  const active = days.filter((d) => d.count > 0);
  const byMonth = new Map<string, number>();
  for (const d of active) byMonth.set(d.date.slice(0, 7), (byMonth.get(d.date.slice(0, 7)) ?? 0) + d.count);
  const busiestMonth = [...byMonth.entries()].sort((a, b) => b[1] - a[1])[0];
  const busiestDay = [...active].sort((a, b) => b.count - a.count)[0];
  const fmtMonth = (ym: string) =>
    new Date(`${ym}-01T00:00:00Z`).toLocaleDateString("en-GB", { month: "short", year: "numeric", timeZone: "UTC" });
  const fmtDay = (iso: string) =>
    new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

  const stats = [
    { label: "Active days", value: String(active.length) },
    { label: "Busiest month", value: busiestMonth ? fmtMonth(busiestMonth[0]) : "—" },
    { label: "Busiest day", value: busiestDay ? `${fmtDay(busiestDay.date)} (${busiestDay.count})` : "—" },
  ];
  return (
    <dl className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
      {stats.map((s) => (
        <div key={s.label} className="bg-ink p-4">
          <dt className="label text-faint">{s.label}</dt>
          <dd className="mt-2 font-mono text-sm text-paper">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Languages({ languages }: { languages: { name: string; count: number }[] }) {
  const total = languages.reduce((s, l) => s + l.count, 0) || 1;
  const shades = ["var(--color-signal)", "var(--color-paper)", "var(--color-mute)", "var(--color-faint)", "var(--color-line-2)"];
  return (
    <div className="mt-6">
      <div className="flex h-1.5 overflow-hidden rounded-full bg-line">
        {languages.map((l, i) => (
          <span key={l.name} style={{ width: `${(l.count / total) * 100}%`, backgroundColor: shades[i % shades.length] }} />
        ))}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-mute">
        {languages.map((l, i) => (
          <li key={l.name} className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full" style={{ backgroundColor: shades[i % shades.length] }} />
            {l.name} <span className="text-faint">{l.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Empty 53-week grid used only when live data is unavailable (all cells level 0). */
function placeholderWeeks() {
  return Array.from({ length: 53 }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => ({ date: `placeholder-${w}-${d}`, level: 0 as const, count: 0 })),
  );
}
