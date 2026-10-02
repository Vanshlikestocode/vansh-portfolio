"use client";

import {
  Bot,
  BrainCircuit,
  Braces,
  ChartScatter,
  PanelsTopLeft,
  Sigma,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { buildLog, experiments, labDomains, type LabDomain } from "@/data/lab";
import { useFinePointer, usePauseOffscreen, useReduced } from "@/lib/hooks";
import { bumpInteraction, lockScroll } from "@/lib/store";
import { EASE_OUT, cn } from "@/lib/utils";

const LabModal = dynamic(() => import("./LabModal").then((m) => m.LabModal));

const icons: Record<LabDomain, LucideIcon> = {
  AI: BrainCircuit,
  ML: Sigma,
  APIs: Braces,
  UI: PanelsTopLeft,
  Mobile: Smartphone,
  Automation: Bot,
  Data: ChartScatter,
};

// Hand-placed constellation for large screens: [left %, top %, depth].
const layout: Record<LabDomain, [number, number, number]> = {
  AI: [2, 10, 0.7],
  ML: [27, 0, 1.1],
  APIs: [53, 12, 0.8],
  UI: [78, 2, 0.55],
  Mobile: [12, 54, 1],
  Automation: [41, 58, 0.65],
  Data: [68, 52, 0.9],
};

export function Lab() {
  const [open, setOpen] = useState<LabDomain | null>(null);
  const field = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduced = useReduced();
  usePauseOffscreen(field);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!fine || reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  const show = (d: LabDomain) => {
    bumpInteraction();
    setOpen(d);
    lockScroll(true);
  };
  const hide = () => {
    setOpen(null);
    lockScroll(false);
  };

  const count = (d: LabDomain) => experiments.filter((e) => e.domains.includes(d)).length;

  return (
    <section id="lab" aria-label="Lab and build log" className="relative px-5 py-28 sm:px-8 md:py-36">
      <div className="mx-auto max-w-7xl">
        <header>
          <Reveal y={10} className="label flex items-center gap-3 text-mute">
            <span className="text-signal">08</span>
            <span className="h-px w-8 bg-line-2" />
            <span>Lab</span>
          </Reveal>
          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="display text-[clamp(2.75rem,7.2vw,6.5rem)] text-paper">
              <span className="rise-mask">
                <Reveal as="span" y={60} className="block">
                  The <span className="serif-accent text-signal">workshop.</span>
                </Reveal>
              </span>
            </h2>
            <Reveal delay={0.1} className="max-w-md text-lg text-mute">
              Coursework apps, early ML repos, prototypes and tooling — the smaller builds where most of the learning
              happens. Open a module.
            </Reveal>
          </div>
        </header>

        <div
          ref={field}
          onPointerMove={onMove}
          onPointerLeave={() => {
            mx.set(0);
            my.set(0);
          }}
          className="relative mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:mt-20 lg:block lg:h-[520px]"
        >
          {labDomains.map((d, i) => (
            <Module
              key={d.id}
              domain={d.id}
              blurb={d.blurb}
              builds={count(d.id)}
              projects={d.projects.length}
              Icon={icons[d.id]}
              place={layout[d.id]}
              index={i}
              px={sx}
              py={sy}
              onOpen={() => show(d.id)}
            />
          ))}
        </div>

        <BuildLog />
      </div>

      <AnimatePresence>{open && <LabModal key="lab" domain={open} onClose={hide} />}</AnimatePresence>
    </section>
  );
}

function Module({
  domain,
  blurb,
  builds,
  projects,
  Icon,
  place,
  index,
  px,
  py,
  onOpen,
}: {
  domain: LabDomain;
  blurb: string;
  builds: number;
  projects: number;
  Icon: LucideIcon;
  place: [number, number, number];
  index: number;
  px: MotionValue<number>;
  py: MotionValue<number>;
  onOpen: () => void;
}) {
  const [left, top, depth] = place;
  const x = useTransform(px, (v) => v * 46 * depth);
  const y = useTransform(py, (v) => v * 36 * depth);

  return (
    <motion.div
      className={cn("lg:absolute lg:w-[21%]", index === 6 && "col-span-2 sm:col-span-1")}
      style={{ left: `${left}%`, top: `${top}%`, x, y, zIndex: Math.round(depth * 10) }}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, ease: EASE_OUT, delay: index * 0.06 }}
    >
      <div
        className="lg:[animation:float-y_var(--dur)_ease-in-out_infinite]"
        style={{ ["--dur" as string]: `${6 + (index % 3) * 1.4}s`, animationDelay: `${-index * 0.9}s` }}
      >
        <button
          type="button"
          onClick={onOpen}
          aria-haspopup="dialog"
          data-cursor="project"
          data-cursor-label="Open module"
          className="group relative block w-full overflow-hidden rounded-2xl border border-line bg-ink-2 p-5 text-left transition-[border-color,background-color,transform] duration-500 hover:-translate-y-1 hover:border-paper/25 hover:bg-ink-3"
          style={{ opacity: 0.55 + depth * 0.4 }}
        >
          <span className="flex items-center justify-between gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-line-2 text-paper-dim transition-colors duration-500 group-hover:border-signal/60 group-hover:text-signal">
              <Icon className="size-4" />
            </span>
            <span className="label text-right text-faint">
              {builds} build{builds === 1 ? "" : "s"}
              {projects > 0 && <span className="hidden sm:inline">{` · ${projects} project${projects === 1 ? "" : "s"}`}</span>}
            </span>
          </span>
          <span className="mt-6 block text-2xl font-medium tracking-tight text-paper">{domain}</span>
          <span className="mt-1 block text-sm leading-relaxed text-mute">{blurb}</span>
          <span className="label mt-4 block text-faint transition-colors group-hover:text-paper">Open →</span>
        </button>
      </div>
    </motion.div>
  );
}

function BuildLog() {
  return (
    <div className="mt-20 overflow-hidden rounded-2xl border border-line bg-ink lg:mt-28">
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-2.5 rounded-full bg-white/10" />
        ))}
        <span className="ml-3 font-mono text-xs text-mute">build.log</span>
        <span className="label ml-auto text-faint">from project history</span>
      </div>
      <div className="p-4 font-mono text-[12.5px] sm:p-6">
        <p className="text-mute">
          <span className="text-signal">$</span> tail -n {buildLog.length} build.log
        </p>
        <ol className="mt-4 space-y-2.5 sm:space-y-1.5">
          {buildLog.map((l, i) => (
            <motion.li
              key={`${l.date}-${l.entry}`}
              className="grid gap-x-6 sm:grid-cols-[96px_130px_1fr]"
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "0px 0px -8% 0px" }}
              transition={{ duration: 0.5, delay: Math.min(i, 8) * 0.04 }}
            >
              <span className="text-faint">{l.date}</span>
              <span className="text-signal">{l.project}</span>
              <span className="text-paper-dim">{l.entry}</span>
            </motion.li>
          ))}
        </ol>
        <p className="mt-4 text-mute">
          <span className="text-signal">$</span> <span className="boot-cursor">▍</span>
        </p>
      </div>
    </div>
  );
}
