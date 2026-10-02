"use client";

import { motion } from "motion/react";
import { useSequence } from "@/lib/hooks";
import { EASE_OUT } from "@/lib/utils";

/* Resume → AI analysis. A sample resume, scanned line by line; keywords lift out as skills. */

const LINES: { w: string; skill?: string }[] = [
  { w: "92%" },
  { w: "60%", skill: "Python" },
  { w: "84%" },
  { w: "70%", skill: "SQL" },
  { w: "88%", skill: "Machine Learning" },
  { w: "55%" },
  { w: "78%", skill: "Pandas" },
  { w: "66%" },
  { w: "82%", skill: "REST APIs" },
  { w: "48%" },
];
const SUGGESTIONS = [
  { tone: "+", text: "Quantify impact in project bullets" },
  { tone: "+", text: "Add “FastAPI” — it appears 3× in the job description" },
  { tone: "−", text: "Drop the two-column table; ATS parsers misread it" },
];

const DURATIONS = [700, 700, 700, 700, 700, 900, 1200, 1100, 2600] as const;

export function ResumePreview({ active }: { active: boolean }) {
  const step = useSequence(DURATIONS.length, DURATIONS, active, 8);
  const scanned = Math.min(LINES.length, Math.round((step / 5) * LINES.length));
  const skills = LINES.slice(0, scanned).filter((l) => l.skill);
  const score = step >= 6 ? 78 : 0;

  return (
    <div
      className="grid w-full gap-3 rounded-2xl border border-white/10 bg-[#070d12] p-4 font-mono text-[11px] text-[#d8ecf7] sm:grid-cols-[0.9fr_1.1fr] sm:p-5"
      role="img"
      aria-label="Sample resume being scanned; extracted skills, a 78 out of 100 ATS match score and three improvement suggestions."
    >
      <div className="relative overflow-hidden rounded-xl bg-[#eef3f7] p-4">
        <div className="h-2.5 w-1/2 rounded-sm bg-[#22313d]" />
        <div className="mt-1.5 h-1.5 w-1/3 rounded-sm bg-[#22313d]/40" />
        <div className="mt-4 space-y-2">
          {LINES.map((l, i) => (
            <motion.div
              key={i}
              className="h-1.5 rounded-sm"
              style={{ width: l.w }}
              animate={{
                backgroundColor: i < scanned && l.skill ? "#4aa8e0" : "rgba(34,49,61,0.22)",
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
        <motion.div
          aria-hidden="true"
          className="absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-[#7fd1ff]/40 to-transparent"
          animate={{ top: step < 5 ? `${(step / 5) * 100}%` : "110%" }}
          transition={{ duration: 0.7, ease: "linear" }}
        />
        <p className="absolute bottom-2 right-3 text-[9px] tracking-[0.14em] text-[#22313d]/50">SAMPLE RESUME</p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">
          <p className="text-[9px] tracking-[0.16em] text-[#d8ecf7]/50">EXTRACTED SKILLS</p>
          <div className="mt-2 flex min-h-12 flex-wrap gap-1.5">
            {skills.map((s) => (
              <motion.span
                key={s.skill}
                className="rounded-md border border-[#7fd1ff]/30 bg-[#7fd1ff]/10 px-2 py-1 text-[10px] text-[#7fd1ff]"
                initial={{ opacity: 0, y: 6, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: EASE_OUT }}
              >
                {s.skill}
              </motion.span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">
          <Ring value={score} />
          <div>
            <p className="text-[9px] tracking-[0.16em] text-[#d8ecf7]/50">ATS MATCH</p>
            <p className="mt-1 text-[10px] text-[#d8ecf7]/70">TF-IDF + cosine similarity vs job description</p>
          </div>
        </div>
        <ul className="space-y-1.5">
          {SUGGESTIONS.map((s, i) => (
            <motion.li
              key={s.text}
              className="flex gap-2 rounded-lg bg-white/[0.03] px-2.5 py-1.5"
              initial={false}
              animate={{ opacity: step >= 7 + (i > 0 ? 1 : 0) ? 1 : 0.12, x: step >= 7 ? 0 : -6 }}
              transition={{ duration: 0.4, delay: i * 0.12 }}
            >
              <span className={s.tone === "+" ? "text-[#3ddc97]" : "text-[#ff5a4e]"}>{s.tone}</span>
              {s.text}
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Ring({ value }: { value: number }) {
  const r = 20;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative size-14">
      <svg viewBox="0 0 48 48" className="size-14 -rotate-90" aria-hidden="true">
        <circle cx="24" cy="24" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
        <motion.circle
          cx="24"
          cy="24"
          r={r}
          fill="none"
          stroke="#7fd1ff"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={false}
          animate={{ strokeDashoffset: c - (value / 100) * c }}
          transition={{ duration: 1.1, ease: EASE_OUT }}
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center font-sans text-sm font-semibold text-white">
        {value || "—"}
      </span>
    </div>
  );
}
