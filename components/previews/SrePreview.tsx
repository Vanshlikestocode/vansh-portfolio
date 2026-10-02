"use client";

import { AnimatePresence, motion } from "motion/react";
import { useSequence } from "@/lib/hooks";
import { EASE_OUT, cn } from "@/lib/utils";

/*
 * Incident command center. A simulated incident built from the log lines in
 * the project's own logs/sample.log, followed by the analysis steps the agent
 * performs. The report text is illustrative, not captured model output.
 */

const PHASES = 9;
const DURATIONS = [1600, 900, 900, 1100, 900, 900, 900, 1000, 3200] as const;

const LOGS = [
  { at: 0, level: "INFO", text: "Service Started" },
  { at: 1, level: "ERROR", text: "Redis Connection Refused" },
  { at: 2, level: "ERROR", text: "Cache Failure" },
  { at: 2, level: "ERROR", text: "API Request Timeout" },
];

const ANALYSIS = ["analyzing logs", "correlating events", "identifying probable root cause", "generating recommendation"];

type Health = "healthy" | "degraded" | "down";
const healthColor: Record<Health, string> = { healthy: "#3ddc97", degraded: "#f5b83d", down: "#ff5a4e" };

const ERROR_SERIES = [3, 4, 3, 5, 4, 6, 9, 18, 31, 42];

export function SrePreview({ active }: { active: boolean }) {
  const phase = useSequence(PHASES, DURATIONS, active, 8);
  const incident = phase >= 1;

  const services: { name: string; health: Health }[] = [
    { name: "API", health: phase >= 2 ? "degraded" : "healthy" },
    { name: "Database", health: "healthy" },
    { name: "Cache", health: phase >= 1 ? "down" : "healthy" },
    { name: "Worker", health: phase >= 2 ? "degraded" : "healthy" },
  ];

  const series = incident ? ERROR_SERIES : ERROR_SERIES.slice(0, 6).concat([4, 3, 4, 3]);
  const max = 46;
  const points = series.map((v, i) => `${(i / (series.length - 1)) * 100},${30 - (v / max) * 28}`).join(" ");

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0d0b07] p-4 font-mono text-[11px] text-[#ece3cf] sm:p-5"
      role="img"
      aria-label="Simulated incident: cache down, API degraded, error rate up 42%, followed by an AI analysis that identifies the cache outage as the probable root cause."
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(560px 220px at 10% 0%, rgba(245,184,61,0.10), transparent 70%)" }}
      />
      <div className="relative flex items-center justify-between">
        <span className="tracking-[0.18em] text-[#f5b83d]">AI-SRE · INCIDENT COMMAND</span>
        <span className="text-[10px] tracking-[0.14em] text-[#ece3cf]/45">SIMULATED INCIDENT</span>
      </div>

      <div className="relative mt-4 grid gap-3 sm:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">
          <p className="mb-2 text-[9px] tracking-[0.16em] text-[#ece3cf]/50">SYSTEM STATUS</p>
          <ul className="space-y-1.5">
            {services.map((s) => (
              <li key={s.name} className="flex items-center justify-between">
                <span className="text-[#ece3cf]/80">{s.name.toUpperCase()}</span>
                <span className="flex items-center gap-1.5 text-[10px] tracking-[0.12em]">
                  <motion.span
                    className={cn("size-1.5 rounded-full", s.health !== "healthy" && "pulse-dot")}
                    style={{ color: healthColor[s.health] }}
                    animate={{ backgroundColor: healthColor[s.health] }}
                  />
                  <motion.span animate={{ color: healthColor[s.health] }}>{s.health.toUpperCase()}</motion.span>
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-3 border-t border-white/[0.06] pt-2">
            <div className="flex items-center justify-between">
              <span className="text-[9px] tracking-[0.16em] text-[#ece3cf]/50">ERROR RATE</span>
              <motion.span
                className="text-[11px]"
                animate={{ color: incident ? "#ff5a4e" : "#3ddc97" }}
              >
                {incident ? "↑ 42%" : "nominal"}
              </motion.span>
            </div>
            <svg viewBox="0 0 100 32" preserveAspectRatio="none" className="mt-1 h-8 w-full" aria-hidden="true">
              <motion.polyline
                fill="none"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
                initial={false}
                animate={{ points, stroke: incident ? "#ff5a4e" : "#3ddc97" }}
                transition={{ duration: 0.8, ease: EASE_OUT }}
              />
            </svg>
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-black/30 p-3">
          <p className="mb-2 text-[9px] tracking-[0.16em] text-[#ece3cf]/50">LOG STREAM · sample.log</p>
          <ul className="space-y-1">
            {LOGS.map((l, i) => (
              <motion.li
                key={i}
                className="flex gap-2 whitespace-nowrap"
                initial={false}
                animate={{ opacity: phase >= l.at ? 1 : 0.15, x: phase >= l.at ? 0 : -4 }}
                transition={{ duration: 0.4, delay: phase === l.at ? 0.12 * i : 0 }}
              >
                <span className="text-[#ece3cf]/35">2026-06-01</span>
                <span style={{ color: l.level === "ERROR" ? "#ff5a4e" : "#3ddc97" }}>{l.level.padEnd(5)}</span>
                <span className="truncate">{l.text}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative mt-3 rounded-xl border border-[#f5b83d]/20 bg-[#f5b83d]/[0.04] p-3">
        <div className="flex items-center justify-between">
          <span className="text-[9px] tracking-[0.16em] text-[#ece3cf]/50">AI ANALYSIS · llama3 via ollama</span>
          <AnimatePresence>
            {phase >= 3 && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[10px] tracking-[0.14em] text-[#ff5a4e]"
              >
                ▲ INCIDENT DETECTED
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <ul className="mt-2 space-y-1">
          {ANALYSIS.map((a, i) => {
            const at = 4 + i;
            const done = phase > at;
            const running = phase === at;
            return (
              <motion.li
                key={a}
                className="flex items-center gap-2"
                initial={false}
                animate={{ opacity: phase >= at ? 1 : 0.2 }}
              >
                <span className="text-[#f5b83d]">→</span>
                <span>{a}</span>
                <span className="ml-auto text-[10px]">
                  {done ? <span className="text-[#3ddc97]">done</span> : running ? <Dots /> : ""}
                </span>
              </motion.li>
            );
          })}
        </ul>
        <AnimatePresence>
          {phase >= 8 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
              className="overflow-hidden"
            >
              <dl className="mt-3 grid gap-1.5 border-t border-white/[0.08] pt-3 text-[10.5px] sm:grid-cols-[auto_1fr] sm:gap-x-4">
                <dt className="text-[#ece3cf]/50">SEVERITY</dt>
                <dd className="text-[#ff5a4e]">HIGH</dd>
                <dt className="text-[#ece3cf]/50">ROOT CAUSE</dt>
                <dd>Redis unreachable → cache failures → upstream API timeouts</dd>
                <dt className="text-[#ece3cf]/50">NEXT STEPS</dt>
                <dd>Check Redis health and connection pool · fail open to the database · watch API latency</dd>
              </dl>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Dots() {
  return (
    <span className="inline-flex gap-0.5 text-[#f5b83d]">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
        >
          •
        </motion.span>
      ))}
    </span>
  );
}
