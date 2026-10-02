"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll, useVelocity } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { bumpInteraction, toast, useInteractions } from "@/lib/store";
import { cn, pad2 } from "@/lib/utils";

type Mode = "nominal" | "throughput" | "diagnostics";

const labels: Record<Mode, string> = {
  nominal: "Nominal",
  throughput: "High throughput",
  diagnostics: "Running checks",
};

/**
 * A small status light that is quietly alive: it reacts to fast scrolling,
 * reports the session's vitals on hover, and runs a "diagnostic" on click.
 */
export function SystemStatus() {
  const [mode, setMode] = useState<Mode>("nominal");
  const [open, setOpen] = useState(false);
  const [uptime, setUptime] = useState(0);
  const [seen, setSeen] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const interactions = useInteractions();
  const calm = useRef<number | undefined>(undefined);

  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  useMotionValueEvent(velocity, "change", (v) => {
    if (Math.abs(v) < 2600) return;
    setMode((m) => (m === "diagnostics" ? m : "throughput"));
    window.clearTimeout(calm.current);
    calm.current = window.setTimeout(() => setMode((m) => (m === "throughput" ? "nominal" : m)), 900);
  });

  const start = useRef(0);
  useEffect(() => {
    start.current = performance.now();
  }, []);
  const secondsUp = () => Math.floor((performance.now() - start.current) / 1000);

  // Only tick while the report is open.
  useEffect(() => {
    if (!open) return;
    const tick = () => setUptime(secondsUp());
    const first = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, 1000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, [open]);

  useEffect(() => {
    const sections = [...document.querySelectorAll<HTMLElement>("main section[id]")];
    const io = new IntersectionObserver(
      (entries) => {
        const ids = entries.filter((e) => e.isIntersecting).map((e) => e.target.id);
        if (ids.length) setSeen((prev) => (ids.every((id) => prev.includes(id)) ? prev : [...new Set([...prev, ...ids])]));
      },
      { threshold: 0.25 },
    );
    sections.forEach((s) => io.observe(s));
    const t = window.setTimeout(() => setTotal(sections.length), 0);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  const runDiagnostics = () => {
    if (mode === "diagnostics") return;
    bumpInteraction();
    setMode("diagnostics");
    window.setTimeout(() => {
      const up = secondsUp();
      setMode("nominal");
      toast({
        title: "All systems go",
        body: `Uptime ${Math.floor(up / 60)}m ${pad2(up % 60)}s · ${seen.length}/${total} sections explored · ${interactions + 1} interactions. No incidents to report.`,
      });
    }, 1400);
  };

  const color = mode === "nominal" ? "text-live" : mode === "throughput" ? "text-warn" : "text-info";

  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        onClick={runDiagnostics}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        aria-label={`System status: ${labels[mode]}. Activate to run diagnostics.`}
        className="label flex h-9 items-center gap-2 rounded-full px-3 text-mute transition-colors hover:text-paper"
      >
        <span className={cn("relative inline-flex size-1.5 rounded-full bg-current", color, mode !== "nominal" && "pulse-dot")} />
        <span className="hidden xl:inline">SYS</span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={mode}
            className={cn("hidden xl:inline", mode !== "nominal" && color)}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {labels[mode]}
          </motion.span>
        </AnimatePresence>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="glass absolute right-0 top-12 w-64 rounded-2xl p-4 text-left shadow-2xl shadow-black/60"
          >
            <p className="label text-paper">System report</p>
            <dl className="mt-3 space-y-2 font-mono text-xs text-mute">
              <Row k="status" v={labels[mode].toLowerCase()} />
              <Row k="uptime" v={`${pad2(Math.floor(uptime / 60))}:${pad2(uptime % 60)}`} />
              <Row k="sections explored" v={`${seen.length}/${total || "—"}`} />
              <Row k="interactions" v={String(interactions)} />
            </dl>
            <p className="mt-3 border-t border-line pt-3 font-mono text-[11px] text-faint">click the light to run diagnostics</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt>{k}</dt>
      <dd className="text-paper tabular-nums">{v}</dd>
    </div>
  );
}
