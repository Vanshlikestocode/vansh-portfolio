"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { experiments, type Experiment, type LabDomain } from "@/data/lab";
import { projects, type FilterKey } from "@/data/projects";
import { bumpInteraction } from "@/lib/store";
import { cn } from "@/lib/utils";
import { ExperimentCard, ProjectCard } from "./ProjectCard";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "ai-ml", label: "AI / ML" },
  { key: "full-stack", label: "Full Stack" },
  { key: "data", label: "Data" },
  { key: "mobile", label: "Mobile" },
  { key: "experiments", label: "Experiments" },
];

const domainToFilter: Partial<Record<LabDomain, FilterKey>> = {
  AI: "ai-ml",
  ML: "ai-ml",
  Data: "data",
  Mobile: "mobile",
  APIs: "full-stack",
};

const experimentMatches = (e: Experiment, f: FilterKey) =>
  f === "experiments" || e.domains.some((d) => domainToFilter[d] === f);

const ALL_PREVIEW = 7;

export function ProjectIndex() {
  const [filter, setFilter] = useState<FilterKey>("all");

  const shownProjects = projects.filter((p) => filter === "all" || p.filters.includes(filter as Exclude<FilterKey, "all">));
  const matchingExperiments = filter === "all" ? experiments : experiments.filter((e) => experimentMatches(e, filter));
  const shownExperiments = filter === "all" ? matchingExperiments.slice(0, ALL_PREVIEW) : matchingExperiments;
  const hiddenCount = matchingExperiments.length - shownExperiments.length;

  const count = (f: FilterKey) =>
    f === "all"
      ? projects.length + experiments.length
      : projects.filter((p) => p.filters.includes(f as Exclude<FilterKey, "all">)).length +
        experiments.filter((e) => experimentMatches(e, f)).length;

  const choose = (f: FilterKey) => {
    if (f === filter) return;
    bumpInteraction();
    setFilter(f);
  };

  return (
    <div>
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="label text-mute">Project index</p>
          <p className="mt-3 max-w-md text-mute">
            Everything else — shipped projects, studies and the smaller builds where most of the learning happened.
          </p>
        </div>
        <div
          role="group"
          aria-label="Filter projects"
          className="no-scrollbar -mx-4 flex gap-1 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:justify-end md:overflow-visible md:px-0"
        >
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              aria-pressed={filter === f.key}
              onClick={() => choose(f.key)}
              className={cn(
                "relative shrink-0 rounded-full px-4 py-2 text-sm transition-colors duration-300",
                filter === f.key ? "text-ink" : "text-mute hover:text-paper",
              )}
            >
              {filter === f.key && (
                <motion.span
                  layoutId="filter-pill"
                  className="absolute inset-0 rounded-full bg-paper"
                  transition={{ type: "spring", stiffness: 400, damping: 34 }}
                />
              )}
              <span className="relative flex items-center gap-1.5">
                {f.label}
                <sup className={cn("font-mono text-[9px]", filter === f.key ? "text-ink/60" : "text-faint")}>
                  {count(f.key)}
                </sup>
              </span>
            </button>
          ))}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {`Showing ${shownProjects.length} projects and ${matchingExperiments.length} experiments`}
      </p>
      <div>
        {shownProjects.length > 0 && (
          <motion.div layout className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout" initial={false}>
              {shownProjects.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {shownExperiments.length > 0 && (
          <motion.div layout="position" className="mt-14">
            <p className="label flex items-center gap-3 text-mute">
              Experiments &amp; builds
              <span className="h-px flex-1 bg-line" />
              <span className="text-faint">{matchingExperiments.length}</span>
            </p>
            <motion.div layout className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <AnimatePresence mode="popLayout" initial={false}>
                {shownExperiments.map((e) => (
                  <ExperimentCard key={e.slug} experiment={e} />
                ))}
                {hiddenCount > 0 && (
                  <motion.div key="more" layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <button
                      type="button"
                      onClick={() => choose("experiments")}
                      className="group flex h-full min-h-44 w-full flex-col items-start justify-between rounded-2xl border border-dashed border-line-2 p-5 text-left transition-colors duration-500 hover:border-paper/30 hover:bg-ink-2"
                    >
                      <span className="label text-mute">View all</span>
                      <span className="display text-5xl text-paper">
                        +{hiddenCount}
                        <span className="ml-3 align-middle text-base font-normal tracking-normal text-mute transition-colors group-hover:text-paper">
                          more →
                        </span>
                      </span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
