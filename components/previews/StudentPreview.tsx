"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { EASE_OUT, seeded } from "@/lib/utils";

/* A dashboard-like EDA view on sample data: correlations, a fitted scatter and a score distribution. */

const VARS = ["Study", "Attend.", "Sleep", "Prev.", "Final"];
const CORR = [
  [1, 0.42, 0.08, 0.35, 0.71],
  [0.42, 1, 0.12, 0.29, 0.58],
  [0.08, 0.12, 1, 0.05, 0.16],
  [0.35, 0.29, 0.05, 1, 0.64],
  [0.71, 0.58, 0.16, 0.64, 1],
];
const rand = seeded(9);
const POINTS = Array.from({ length: 34 }, () => {
  const x = rand();
  return { x, y: Math.min(0.98, Math.max(0.04, 0.18 + x * 0.66 + (rand() - 0.5) * 0.24)) };
});
const HIST = [2, 5, 9, 14, 18, 15, 10, 6, 3];

export function StudentPreview({ active }: { active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.3 });
  const on = active || seen;

  return (
    <div
      ref={ref}
      className="w-full rounded-2xl border border-white/10 bg-[#100f06] p-4 font-mono text-[11px] text-[#f1ebc9] sm:p-5"
      role="img"
      aria-label="Sample data dashboard: correlation heatmap, study hours versus score scatter with a fitted line, and a score distribution."
    >
      <div className="flex items-center justify-between">
        <span className="tracking-[0.18em] text-[#e8d35b]">STUDENT PERFORMANCE · EDA</span>
        <span className="text-[9px] tracking-[0.14em] text-[#f1ebc9]/45">SAMPLE DATA</span>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1.2fr]">
        <div className="rounded-xl border border-white/[0.08] p-3">
          <p className="text-[9px] tracking-[0.16em] text-[#f1ebc9]/50">CORRELATION</p>
          <div className="mt-2 grid grid-cols-[auto_repeat(5,1fr)] gap-[3px] text-[8px]">
            <span />
            {VARS.map((v) => (
              <span key={v} className="truncate text-center text-[#f1ebc9]/40">{v}</span>
            ))}
            {CORR.map((row, i) => (
              <Row key={i} label={VARS[i]} row={row} i={i} on={on} />
            ))}
          </div>
        </div>
        <div className="grid gap-3">
          <div className="rounded-xl border border-white/[0.08] p-3">
            <p className="text-[9px] tracking-[0.16em] text-[#f1ebc9]/50">STUDY HOURS × FINAL SCORE</p>
            <svg viewBox="0 0 200 80" className="mt-2 h-20 w-full" aria-hidden="true">
              {POINTS.map((p, i) => (
                <motion.circle
                  key={i}
                  cx={8 + p.x * 184}
                  cy={76 - p.y * 72}
                  r="2.2"
                  fill="#e8d35b"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={on ? { opacity: 0.75, scale: 1 } : {}}
                  transition={{ delay: i * 0.02, duration: 0.3 }}
                />
              ))}
              <motion.line
                x1="8"
                y1={76 - 0.18 * 72}
                x2="192"
                y2={76 - 0.84 * 72}
                stroke="#f1ebc9"
                strokeWidth="1.5"
                strokeDasharray="4 3"
                initial={{ pathLength: 0 }}
                animate={on ? { pathLength: 1 } : {}}
                transition={{ delay: 0.8, duration: 0.9, ease: EASE_OUT }}
              />
            </svg>
          </div>
          <div className="rounded-xl border border-white/[0.08] p-3">
            <p className="text-[9px] tracking-[0.16em] text-[#f1ebc9]/50">SCORE DISTRIBUTION</p>
            <div className="mt-2 flex h-12 items-end gap-1">
              {HIST.map((h, i) => (
                <motion.span
                  key={i}
                  className="flex-1 origin-bottom rounded-t-sm bg-[#e8d35b]/70"
                  style={{ height: `${(h / 18) * 100}%` }}
                  initial={{ scaleY: 0 }}
                  animate={on ? { scaleY: 1 } : {}}
                  transition={{ delay: 0.3 + i * 0.05, duration: 0.6, ease: EASE_OUT }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, row, i, on }: { label: string; row: number[]; i: number; on: boolean }) {
  return (
    <>
      <span className="pr-1 text-right text-[#f1ebc9]/40">{label}</span>
      {row.map((v, j) => (
        <motion.span
          key={j}
          className="grid aspect-square place-items-center rounded-[3px] text-[7.5px] text-[#100f06]"
          style={{ backgroundColor: `rgba(232,211,91,${0.08 + v * 0.85})` }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={on ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: (i + j) * 0.04, duration: 0.4 }}
        >
          {v >= 0.5 ? v.toFixed(2).slice(1) : ""}
        </motion.span>
      ))}
    </>
  );
}
