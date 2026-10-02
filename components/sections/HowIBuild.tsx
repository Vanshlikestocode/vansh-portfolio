"use client";

import { motion, useInView, useScroll, useSpring } from "motion/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useReduced } from "@/lib/hooks";
import { EASE_OUT, cn } from "@/lib/utils";

const stages = [
  {
    n: "01",
    title: "Find the problem",
    body: "Start with friction people actually feel: a canteen line at 1 pm, an error buried in a log, a transaction nobody flagged. If I can't state the problem in one sentence, I'm not ready to build.",
    Visual: FindVisual,
  },
  {
    n: "02",
    title: "Build the system",
    body: "Design the data flow before the interface: typed APIs, rules enforced on the server, one source of truth for state. Then make the surface feel effortless.",
    Visual: BuildVisual,
  },
  {
    n: "03",
    title: "Break the system",
    body: "Hunt the failure modes before users do — writes that should be rejected, accuracy that hides poor recall, a network that never answers. Tests, rules and honest metrics.",
    Visual: BreakVisual,
  },
  {
    n: "04",
    title: "Ship the product",
    body: "Deploy it, put it in front of people, watch what happens, iterate. A demo proves an idea; a shipped product proves the engineering.",
    Visual: ShipVisual,
  },
];

export function HowIBuild() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.6"] });
  const line = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section id="process" aria-label="How I build" className="relative px-5 py-28 sm:px-8 md:py-36">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          index="03"
          label="Process"
          lines={[
            <Fragment key="l1">
              How I <span className="serif-accent text-signal">build</span>
            </Fragment>,
          ]}
          intro="Not demos — working products. Every project goes through the same four stages, and the third one is the one most people skip."
        />

        <div ref={ref} className="relative mt-16 md:mt-24">
          <div aria-hidden="true" className="absolute left-0 right-0 top-0 hidden h-px bg-line lg:block">
            <motion.div className="h-full origin-left bg-signal" style={{ scaleX: line }} />
          </div>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
            {stages.map((s, i) => (
              <Stage key={s.n} stage={s} index={i} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Stage({ stage, index }: { stage: (typeof stages)[number]; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const { Visual } = stage;
  return (
    <motion.li
      ref={ref}
      className={cn(
        "group relative flex flex-col rounded-2xl border border-line bg-ink-2/60 p-6 lg:rounded-none lg:border-0 lg:border-l lg:bg-transparent lg:px-7 lg:pb-4 lg:pt-10",
        index === 0 && "lg:border-l-0 lg:pl-0",
      )}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, ease: EASE_OUT, delay: index * 0.12 }}
    >
      <span
        aria-hidden="true"
        className="absolute -top-[5px] left-0 hidden size-2.5 rounded-full border border-signal bg-ink lg:block"
        style={{ left: index === 0 ? 0 : 28 }}
      />
      <span className="label text-signal">{stage.n}</span>
      <h3 className="mt-4 text-2xl font-medium tracking-tight text-paper">{stage.title}</h3>
      <div className="my-6 h-32 overflow-hidden rounded-xl border border-line bg-ink p-3">
        <Visual on={inView} />
      </div>
      <p className="leading-relaxed text-mute">{stage.body}</p>
    </motion.li>
  );
}

/* 01 — a queue is scanned until the real bottleneck is found. */
const SCAN = [0, 1, 2, 3, 4, 5, 6, 7, 8, 7, 6];
const TARGET = 6;
function FindVisual({ on }: { on: boolean }) {
  const reduced = useReduced();
  const [step, setStep] = useState(-1);
  useEffect(() => {
    if (!on) return;
    if (reduced) {
      const t = window.setTimeout(() => setStep(SCAN.length - 1), 0);
      return () => window.clearTimeout(t);
    }
    const timers = SCAN.map((_, i) => window.setTimeout(() => setStep(i), 200 + i * 170));
    return () => timers.forEach(window.clearTimeout);
  }, [on, reduced]);
  const pos = step < 0 ? -1 : SCAN[step];
  const found = step === SCAN.length - 1;

  return (
    <div className="flex h-full flex-col justify-between font-mono text-[10px] text-mute">
      <span className="tracking-[0.14em]">{found ? "BOTTLENECK FOUND" : "SCANNING QUEUE"}</span>
      <div className="flex items-center gap-1.5">
        {Array.from({ length: 9 }, (_, i) => (
          <span key={i} className="relative h-6 flex-1">
            <motion.span
              className="absolute inset-0 rounded-[4px] border"
              animate={{
                backgroundColor: found && i === TARGET ? "rgba(255,91,31,0.85)" : "rgba(236,235,230,0.04)",
                borderColor: found && i === TARGET ? "rgba(255,91,31,1)" : "rgba(236,235,230,0.15)",
              }}
              transition={{ duration: 0.4 }}
            />
            {pos === i && (
              <motion.span
                layoutId="scan-ring"
                className="absolute -inset-1 rounded-md border-2 border-paper"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
          </span>
        ))}
      </div>
      <motion.span initial={{ opacity: 0 }} animate={{ opacity: found ? 1 : 0 }} transition={{ duration: 0.4 }}>
        <span className="text-signal">found:</span> <span className="text-paper">the 1 pm lunch queue</span>
      </motion.span>
    </div>
  );
}

/* 02 — components slide in and get wired together. */
function BuildVisual({ on }: { on: boolean }) {
  const blocks = [
    { label: "UI", x: 4, y: 40, from: { x: -20, y: 0 } },
    { label: "API", x: 72, y: 12, from: { x: 0, y: -20 } },
    { label: "MODEL", x: 140, y: 40, from: { x: 20, y: 0 } },
    { label: "DB", x: 72, y: 68, from: { x: 0, y: 20 } },
  ];
  return (
    <svg viewBox="0 0 200 100" className="h-full w-full font-mono" aria-hidden="true">
      {[
        "M48 52 L72 30",
        "M48 52 L72 82",
        "M128 30 L140 52",
        "M100 44 L100 68",
      ].map((d, i) => (
        <motion.path
          key={d}
          d={d}
          stroke="rgba(255,91,31,0.9)"
          strokeWidth="1.2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={on ? { pathLength: 1 } : {}}
          transition={{ delay: 0.9 + i * 0.15, duration: 0.5 }}
        />
      ))}
      {blocks.map((b, i) => (
        <motion.g
          key={b.label}
          initial={{ opacity: 0, ...b.from }}
          animate={on ? { opacity: 1, x: 0, y: 0 } : {}}
          transition={{ delay: i * 0.15, duration: 0.7, ease: EASE_OUT }}
        >
          <rect x={b.x} y={b.y} width="56" height="24" rx="5" fill="rgba(236,235,230,0.04)" stroke="rgba(236,235,230,0.3)" />
          <text x={b.x + 28} y={b.y + 15.5} textAnchor="middle" fontSize="8" fill="#ecebe6" letterSpacing="1">
            {b.label}
          </text>
        </motion.g>
      ))}
    </svg>
  );
}

/* 03 — tests go red, get fixed, go green. */
const TESTS = [
  "edit order after 60 s",
  "duplicate pickup code",
  "99.9% accuracy, low recall",
];
function BreakVisual({ on }: { on: boolean }) {
  const reduced = useReduced();
  const [fixed, setFixed] = useState(0);
  useEffect(() => {
    if (!on) return;
    if (reduced) {
      const t = window.setTimeout(() => setFixed(TESTS.length), 0);
      return () => window.clearTimeout(t);
    }
    const timers = TESTS.map((_, i) => window.setTimeout(() => setFixed(i + 1), 1300 + i * 550));
    return () => timers.forEach(window.clearTimeout);
  }, [on, reduced]);

  return (
    <div className="flex h-full flex-col justify-between font-mono text-[10.5px]">
      <span className="tracking-[0.14em] text-mute">
        {fixed === TESTS.length ? <span className="text-live">3 PASSING</span> : on ? <span className="text-danger">{TESTS.length - fixed} FAILING</span> : "TEST SUITE"}
      </span>
      <ul className="space-y-1">
        {TESTS.map((t, i) => {
          const ok = i < fixed;
          return (
            <motion.li
              key={t}
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -6 }}
              animate={on ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.18 }}
            >
              <motion.span animate={{ color: ok ? "#3ddc97" : "#ff5a4e" }}>{ok ? "✓" : "✕"}</motion.span>
              <span className={ok ? "text-paper-dim" : "text-mute"}>{t}</span>
              <span className="ml-auto text-faint">{ok ? "caught" : ""}</span>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}

/* 04 — the deploy fills, then the status flips to live. */
function ShipVisual({ on }: { on: boolean }) {
  const [live, setLive] = useState(false);
  const reduced = useReduced();
  useEffect(() => {
    if (!on) return;
    const t = window.setTimeout(() => setLive(true), reduced ? 0 : 1900);
    return () => window.clearTimeout(t);
  }, [on, reduced]);
  return (
    <div className="flex h-full flex-col justify-between font-mono text-[10.5px]">
      <span className="tracking-[0.14em] text-mute">{live ? "DEPLOYED" : on ? "DEPLOYING…" : "READY TO SHIP"}</span>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          className="h-full origin-left rounded-full bg-paper"
          initial={{ scaleX: 0 }}
          animate={on ? { scaleX: 1 } : {}}
          transition={{ duration: reduced ? 0 : 1.7, ease: [0.65, 0, 0.35, 1] }}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="truncate text-faint">build → test → deploy</span>
        <motion.span
          className="flex items-center gap-1.5 rounded-full border px-2 py-0.5"
          animate={{
            borderColor: live ? "rgba(61,220,151,0.5)" : "rgba(236,235,230,0.15)",
            color: live ? "#3ddc97" : "#64625d",
            scale: live ? [1, 1.12, 1] : 1,
          }}
          transition={{ duration: 0.5 }}
        >
          <span className={cn("size-1.5 rounded-full bg-current", live && "pulse-dot")} />
          LIVE
        </motion.span>
      </div>
    </div>
  );
}
