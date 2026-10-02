"use client";

import { ArrowRight, ArrowUpRight, Check, Circle, CircleDashed, Info } from "lucide-react";
import Link from "next/link";
import { Preview } from "@/components/previews/Preview";
import { Counter } from "@/components/ui/Counter";
import { Reveal } from "@/components/ui/Reveal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { projects, type FeatureState, type Project } from "@/data/projects";
import { stack } from "@/data/stack";
import { openProject } from "@/lib/store";
import { Architecture } from "./Architecture";

const stateIcon: Record<FeatureState, React.ReactNode> = {
  done: <Check className="size-3.5 text-live" />,
  building: <Circle className="size-3.5 text-warn" />,
  planned: <CircleDashed className="size-3.5 text-faint" />,
};
const stateLabel: Record<FeatureState, string> = { done: "Built", building: "In progress", planned: "Planned" };

/** The case study body, shared by the modal and the /work/[slug] page. */
export function ProjectDetail({ project, variant }: { project: Project; variant: "modal" | "page" }) {
  const i = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(i + 1) % projects.length];
  const HeadingTag = variant === "page" ? "h1" : "h2";

  return (
    <article className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px]"
        style={{ background: `radial-gradient(60% 100% at 50% 0%, color-mix(in oklab, ${project.accent} 14%, transparent), transparent 70%)` }}
      />

      <header className="relative px-5 pt-20 sm:px-10 lg:px-16">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <StatusBadge status={project.status} />
          <span className="label" style={{ color: project.accent }}>
            {project.category}
          </span>
          {project.period && <span className="label text-faint">{project.period}</span>}
        </div>
        <HeadingTag id="project-title" className="display mt-6 text-[clamp(3.25rem,9vw,8rem)] text-paper">
          {project.name}
        </HeadingTag>
        <p className="mt-4 max-w-2xl text-xl text-paper-dim">{project.subtitle}</p>
        <Links project={project} className="mt-8" />
      </header>

      <div className="relative mt-12 px-3 sm:px-10 lg:px-16">
        <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden rounded-3xl border border-line bg-ink p-4 py-10 sm:p-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ background: `radial-gradient(50% 70% at 50% 100%, color-mix(in oklab, ${project.accent} 16%, transparent), transparent)` }}
          />
          <div className="relative w-full max-w-4xl">
            <Preview kind={project.preview} active />
          </div>
        </div>
      </div>

      <div className="relative space-y-20 px-5 py-20 sm:px-10 lg:px-16">
        <Block label="Overview">
          <p className="text-xl leading-relaxed text-paper-dim sm:text-2xl">{project.description}</p>
        </Block>

        <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2">
          <Reveal className="bg-ink-2 p-6 sm:p-8">
            <p className="label text-signal">Problem</p>
            <p className="mt-4 leading-relaxed text-paper-dim">{project.problem}</p>
          </Reveal>
          <Reveal delay={0.08} className="bg-ink-2 p-6 sm:p-8">
            <p className="label text-live">What I built</p>
            <p className="mt-4 leading-relaxed text-paper-dim">{project.solution}</p>
          </Reveal>
        </div>

        {project.metrics && (
          <Block label="Numbers">
            <dl className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
              {project.metrics.map((m) => (
                <div key={m.label} className="flex flex-col-reverse bg-ink-2 p-6">
                  <dt className="label mt-3 text-mute">{m.label}</dt>
                  <dd className="display text-5xl text-paper">
                    <Counter value={m.value} decimals={m.decimals} prefix={m.prefix} suffix={m.suffix} />
                  </dd>
                </div>
              ))}
            </dl>
            {project.disclaimer && (
              <p className="mt-4 flex gap-3 rounded-2xl border border-warn/25 bg-warn/[0.05] p-4 text-sm leading-relaxed text-paper-dim">
                <Info className="mt-0.5 size-4 shrink-0 text-warn" />
                {project.disclaimer}
              </p>
            )}
          </Block>
        )}

        {project.architecture && (
          <Block label="Architecture">
            <Architecture nodes={project.architecture} accent={project.accent} />
          </Block>
        )}

        <Block label="Key features">
          <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {project.features.map((f, k) => (
              <Reveal as="li" key={f.label} delay={(k % 6) * 0.04} className="flex items-start gap-3 border-b border-line pb-3">
                <span className="mt-1" title={stateLabel[f.state]}>
                  {stateIcon[f.state]}
                  <span className="sr-only">{stateLabel[f.state]}: </span>
                </span>
                <span className={f.state === "done" ? "text-paper-dim" : "text-mute"}>{f.label}</span>
              </Reveal>
            ))}
          </ul>
          <p className="label mt-5 flex flex-wrap gap-5 text-faint">
            {(Object.keys(stateIcon) as FeatureState[]).map((s) => (
              <span key={s} className="flex items-center gap-2">
                {stateIcon[s]} {stateLabel[s]}
              </span>
            ))}
          </p>
        </Block>

        <Block label="Technology">
          <ul className="flex flex-wrap gap-2">
            {project.technologies.map((t) => {
              const known = stack.find((s) => s.name === t || s.aliases?.includes(t));
              return (
                <li
                  key={t}
                  className="group relative rounded-full border border-line px-4 py-2 font-mono text-xs text-paper-dim transition-colors hover:border-paper/30 hover:text-paper"
                >
                  {t}
                  {known && (
                    <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-max max-w-56 -translate-x-1/2 translate-y-1 rounded-lg border border-line bg-ink-3 px-3 py-2 text-[11px] text-mute opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      {known.reveals.join(" · ")}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </Block>

        <Block label="Technical details">
          <ol className="space-y-5">
            {project.details.map((d, k) => (
              <Reveal as="li" key={k} delay={k * 0.05} className="flex gap-5">
                <span className="label pt-1.5 text-signal">{String(k + 1).padStart(2, "0")}</span>
                <p className="leading-relaxed text-paper-dim">{d}</p>
              </Reveal>
            ))}
          </ol>
        </Block>

        <footer className="flex flex-col gap-8 border-t border-line pt-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="label text-mute">Links</p>
            <Links project={project} className="mt-4" emptyText="Source isn’t public yet." />
          </div>
          {variant === "modal" ? (
            <button
              type="button"
              onClick={() => openProject(next.slug)}
              className="group text-left"
              data-cursor="link"
            >
              <span className="label text-mute">Next project</span>
              <span className="mt-2 flex items-center gap-3 text-3xl font-medium tracking-tight text-paper">
                {next.name}
                <ArrowRight className="size-6 transition-transform duration-500 group-hover:translate-x-1.5" />
              </span>
            </button>
          ) : (
            <Link href={`/work/${next.slug}`} className="group text-left">
              <span className="label text-mute">Next project</span>
              <span className="mt-2 flex items-center gap-3 text-3xl font-medium tracking-tight text-paper">
                {next.name}
                <ArrowRight className="size-6 transition-transform duration-500 group-hover:translate-x-1.5" />
              </span>
            </Link>
          )}
        </footer>
      </div>
    </article>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-6 lg:grid-cols-[180px_1fr] lg:gap-12">
      <Reveal y={8}>
        <h3 className="label text-mute lg:sticky lg:top-20">{label}</h3>
      </Reveal>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

function Links({ project, className, emptyText }: { project: Project; className?: string; emptyText?: string }) {
  const items = [
    project.links.demo && { label: project.preview === "queueless" ? "Live web app" : "Live demo", href: project.links.demo, primary: true },
    project.links.github && { label: "GitHub", href: project.links.github, primary: false },
    ...(project.links.extra ?? []).map((e) => ({ ...e, primary: false })),
  ].filter(Boolean) as { label: string; href: string; primary: boolean }[];

  if (!items.length) {
    return emptyText ? <p className={`${className} max-w-sm text-sm text-mute`}>{emptyText}</p> : null;
  }
  return (
    <div className={`flex flex-wrap gap-2 ${className ?? ""}`}>
      {items.map((l) => (
        <a
          key={l.href}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="link"
          className={
            l.primary
              ? "inline-flex h-11 items-center gap-2 rounded-full bg-paper px-5 text-sm font-medium text-ink transition-colors hover:bg-white"
              : "inline-flex h-11 items-center gap-2 rounded-full border border-line-2 px-5 text-sm text-paper transition-colors hover:border-paper/40"
          }
        >
          {l.label}
          <ArrowUpRight className="size-4" />
        </a>
      ))}
    </div>
  );
}
