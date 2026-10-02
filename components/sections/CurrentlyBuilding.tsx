"use client";

import { Fragment } from "react";

import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { Reveal, RevealLines } from "@/components/ui/Reveal";
import { buildLog } from "@/data/lab";
import { flagshipProjects, type Project } from "@/data/projects";
import { bumpInteraction, openProject } from "@/lib/store";
import { EASE_OUT, formatDate } from "@/lib/utils";

/**
 * Visually its own thing: a status console rather than a section. Progress
 * is computed from each project's feature list — built vs. total — so it moves
 * when the data does, not when someone edits a percentage.
 */
export function CurrentlyBuilding() {
  const current = flagshipProjects.filter((p) => p.status === "in-progress");

  return (
    <section id="now" aria-label="Currently building" className="relative px-4 py-28 sm:px-8 md:py-36">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[28px] border border-warn/25 bg-[linear-gradient(180deg,rgb(245_184_61/0.05),transparent_40%)]">
        <div className="flex items-center justify-between gap-4 border-b border-warn/15 px-5 py-4 sm:px-8">
          <p className="label flex items-center gap-3 text-warn">
            <span className="pulse-dot relative inline-flex size-2 rounded-full bg-warn" />
            Currently building
          </p>
          <p className="label hidden text-mute sm:block">
            <span className="text-signal">07</span> · live status
          </p>
        </div>

        <div className="px-5 pb-6 pt-10 sm:px-8 sm:pt-14">
          <RevealLines
            lines={[
              <Fragment key="l1">
                Two things on the <span className="serif-accent text-warn">workbench.</span>
              </Fragment>,
            ]}
            className="display text-[clamp(2.4rem,5.5vw,4.75rem)] text-paper"
          />
          <Reveal delay={0.1} className="mt-5 max-w-xl text-lg text-mute">
            A product and an agent — both in active development, both changing week to week.
          </Reveal>
        </div>

        <div className="grid gap-px bg-warn/10 lg:grid-cols-2">
          {current.map((p, i) => (
            <Console key={p.slug} project={p} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Console({ project, delay }: { project: Project; delay: number }) {
  const done = project.features.filter((f) => f.state === "done").length;
  const total = project.features.length;
  const pct = Math.round((done / total) * 100);
  const next = project.features.filter((f) => f.state !== "done").slice(0, 3);
  const log = buildLog.filter((l) => l.project === project.name).slice(0, 3);

  return (
    <Reveal delay={delay} className="flex flex-col bg-ink-2 p-5 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="label" style={{ color: project.accent }}>
            {project.category}
          </p>
          <h3 className="display mt-3 text-5xl text-paper">{project.name}</h3>
          <p className="mt-2 text-paper-dim">{project.subtitle}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            bumpInteraction();
            openProject(project.slug);
          }}
          aria-label={`Open ${project.name} case study`}
          className="grid size-11 shrink-0 place-items-center rounded-full border border-line-2 text-paper transition-colors hover:border-paper/40"
        >
          <ArrowUpRight className="size-4" />
        </button>
      </div>

      <div className="mt-8">
        <div className="flex items-baseline justify-between font-mono text-xs">
          <span className="text-mute">milestones</span>
          <span className="text-paper">
            {done}/{total} <span className="text-faint">· {pct}%</span>
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
          <motion.div
            className="h-full origin-left rounded-full"
            style={{ backgroundColor: project.accent }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: done / total }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: EASE_OUT, delay: 0.2 + delay }}
          />
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div>
          <p className="label text-mute">Next up</p>
          <ul className="mt-3 space-y-2 text-sm">
            {next.map((f) => (
              <li key={f.label} className="flex gap-2.5 text-paper-dim">
                <span className={f.state === "building" ? "text-warn" : "text-faint"}>{f.state === "building" ? "◐" : "○"}</span>
                {f.label}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="label text-mute">Recent changes</p>
          <ul className="mt-3 space-y-2.5 font-mono text-xs">
            {log.map((l) => (
              <li key={l.entry} className="text-paper-dim">
                <span className="block text-faint">{formatDate(l.date)}</span>
                {l.entry}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Reveal>
  );
}
