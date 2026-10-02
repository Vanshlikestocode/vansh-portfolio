"use client";

import { motion } from "motion/react";
import { r2, seeded } from "@/lib/utils";

/* v1 → v2: the previous single-file site next to a sketch of this one. */

const rand = seeded(3);
const DOTS = Array.from({ length: 70 }, () => {
  const t = rand() * Math.PI * 2;
  const p = Math.acos(2 * rand() - 1);
  return { x: r2(Math.sin(p) * Math.cos(t)), y: r2(Math.cos(p)), z: r2(Math.sin(p) * Math.sin(t)) };
});

export function PortfolioPreview({ active }: { active: boolean }) {
  return (
    <div className="grid w-full items-center gap-4 font-mono text-[10px] sm:grid-cols-[1.2fr_auto_1fr]" role="img" aria-label="The previous portfolio, a dark page with a cyan particle sphere, next to a sketch of this site.">
      <Browser label="v1 · HTML + Three.js">
        <div className="relative h-36 overflow-hidden bg-[#020408] p-3">
          <motion.svg
            viewBox="-1.2 -1.2 2.4 2.4"
            className="absolute -right-6 top-2 size-36 opacity-80"
            animate={active ? { rotate: 360 } : {}}
            transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
            aria-hidden="true"
          >
            {DOTS.map((d, i) => (
              <circle key={i} cx={d.x} cy={d.y} r={r2(0.018 + (d.z + 1) * 0.012)} fill="#00f5ff" opacity={r2(0.35 + (d.z + 1) * 0.3)} />
            ))}
          </motion.svg>
          <p className="relative text-[8px] tracking-[0.15em] text-[#00f5ff]/80">SEEKING AI / ML OPPORTUNITIES</p>
          <p className="relative mt-2 max-w-[60%] font-sans text-[15px] font-bold leading-tight text-[#f0f4ff]">
            Building Real-World AI Projects
          </p>
          <span className="relative mt-3 inline-block rounded-md bg-gradient-to-r from-[#00f5ff] to-[#7c3aed] px-2 py-1 text-[8px] text-[#020408]">
            View my projects
          </span>
        </div>
      </Browser>
      <span className="hidden text-center text-mute sm:block">→</span>
      <Browser label="v2 · this site">
        <div className="h-36 bg-ink p-3">
          <p className="text-[8px] tracking-[0.15em] text-mute">HI, I&apos;M V</p>
          <p className="mt-2 font-sans text-[18px] font-semibold leading-[0.95] tracking-tight text-paper">
            Ideas in.
            <br />
            Systems <span className="font-serif italic text-signal">out.</span>
          </p>
          <div className="mt-3 flex gap-1">
            <span className="h-3 w-12 rounded-full bg-paper" />
            <span className="h-3 w-10 rounded-full border border-line-2" />
          </div>
        </div>
      </Browser>
    </div>
  );
}

function Browser({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-ink-3">
      <div className="flex items-center gap-1.5 border-b border-white/[0.06] px-3 py-2">
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-1.5 rounded-full bg-white/15" />
        ))}
        <span className="ml-2 text-[9px] text-mute">{label}</span>
      </div>
      {children}
    </div>
  );
}
