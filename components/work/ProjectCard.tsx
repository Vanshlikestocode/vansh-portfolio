"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Experiment } from "@/data/lab";
import type { Project } from "@/data/projects";
import { bumpInteraction, openProject } from "@/lib/store";
import { EASE_OUT } from "@/lib/utils";
import { ProjectGlyph } from "./ProjectGlyph";

const cardMotion = {
  layout: true,
  initial: { opacity: 0, scale: 0.94, filter: "blur(6px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, scale: 0.94, filter: "blur(6px)", transition: { duration: 0.25 } },
  transition: { duration: 0.6, ease: EASE_OUT },
} as const;

/** Tracks the pointer in CSS variables for the card spotlight. */
const spotlight = (e: React.PointerEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.article {...cardMotion} className="h-full">
      <a
        href={`/work/${project.slug}`}
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey) return;
          e.preventDefault();
          bumpInteraction();
          openProject(project.slug);
        }}
        onPointerMove={spotlight}
        data-cursor="project"
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-ink-2 p-4 transition-colors duration-500 hover:border-line-2 sm:p-5"
        style={{ ["--accent" as string]: project.accent }}
      >
        <motion.span layoutId={`shell-${project.slug}`} className="absolute inset-0 -z-10 rounded-2xl bg-ink-2" />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(380px circle at var(--x, 50%) var(--y, 0%), color-mix(in oklab, var(--accent) 16%, transparent), transparent 65%)`,
          }}
        />
        <div className="relative flex items-center justify-between">
          <StatusBadge status={project.status} />
          {project.period && <span className="label text-faint">{project.period}</span>}
        </div>

        <div className="relative mt-4 aspect-[16/8] overflow-hidden rounded-xl border border-line bg-ink">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-50 transition-opacity duration-700 group-hover:opacity-90"
            style={{ background: `radial-gradient(60% 80% at 50% 100%, color-mix(in oklab, ${project.accent} 22%, transparent), transparent)` }}
          />
          <div className="relative h-full w-full p-3 transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-1 group-hover:scale-[1.04]">
            {project.preview && <ProjectGlyph kind={project.preview} accent={project.accent} />}
          </div>
        </div>

        <p className="label relative mt-5" style={{ color: project.accent }}>
          {project.category}
        </p>
        <h3 className="relative mt-2 text-2xl font-medium tracking-tight text-paper">{project.name}</h3>
        <p className="relative mt-2 text-[0.95rem] leading-relaxed text-mute">{project.summary}</p>

        <ul className="relative mt-5 flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 4).map((t, i) => (
            <li
              key={t}
              className="rounded-full border border-line px-2.5 py-1 font-mono text-[10.5px] text-paper-dim transition-transform duration-500 group-hover:-translate-y-0.5"
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              {t}
            </li>
          ))}
        </ul>

        <span className="label relative mt-auto flex items-center gap-2 pt-6 text-paper">
          Case study
          <ArrowUpRight className="size-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </a>
    </motion.article>
  );
}

export function ExperimentCard({ experiment }: { experiment: Experiment }) {
  const inner = (
    <>
      <div className="flex items-center justify-between gap-3">
        <span className="label text-faint">{experiment.domains.join(" · ")}</span>
        <span className="label text-faint">{experiment.date}</span>
      </div>
      <h3 className="mt-4 flex items-start justify-between gap-3 text-lg font-medium tracking-tight text-paper">
        {experiment.name}
        {experiment.link && (
          <ArrowUpRight className="mt-1 size-4 shrink-0 text-mute transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-paper" />
        )}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-mute">{experiment.summary}</p>
      <p className="mt-auto pt-4 font-mono text-[10.5px] text-faint">{experiment.tech.join(" · ")}</p>
    </>
  );
  const cls =
    "group relative flex h-full flex-col rounded-2xl border border-dashed border-line-2 bg-ink/60 p-5 transition-colors duration-500";
  return (
    <motion.article {...cardMotion} className="h-full">
      {experiment.link ? (
        <a
          href={experiment.link}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="project"
          data-cursor-label="Open repo ↗"
          className={`${cls} hover:border-paper/30 hover:bg-ink-2`}
        >
          {inner}
        </a>
      ) : (
        <div className={cls}>{inner}</div>
      )}
    </motion.article>
  );
}
