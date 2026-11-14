"use client";

import { motion, useSpring, useTransform } from "motion/react";
import { useEffect, useId, useState } from "react";
import { cn, r2 } from "@/lib/utils";

/*
 * Interactive churn probability. The weights are a hand-written toy logistic
 * function chosen to behave plausibly — it is NOT the trained project model,
 * and the panel says so.
 */

interface Inputs {
  tenure: number;
  charges: number;
  tickets: number;
  monthly: boolean;
}

function churnProbability({ tenure, charges, tickets, monthly }: Inputs) {
  const z = -1.2 - 0.045 * tenure + 0.0011 * charges + 0.42 * tickets + (monthly ? 1.25 : -0.4);
  return 1 / (1 + Math.exp(-z));
}

function topDriver(i: Inputs) {
  const contributions = [
    { name: "short tenure", v: 0.045 * (36 - i.tenure) },
    { name: "high monthly charges", v: 0.0011 * (i.charges - 900) },
    { name: "support tickets", v: 0.42 * (i.tickets - 1) },
    { name: i.monthly ? "month-to-month contract" : "annual contract", v: i.monthly ? 1.25 : -0.4 },
  ];
  return contributions.sort((a, b) => b.v - a.v)[0].name;
}

export function ChurnPreview({ interactive = true }: { active?: boolean; interactive?: boolean }) {
  const [inputs, setInputs] = useState<Inputs>({ tenure: 8, charges: 1499, tickets: 3, monthly: true });
  const p = churnProbability(inputs);
  const spring = useSpring(p, { stiffness: 120, damping: 20 });
  useEffect(() => {
    spring.set(p);
  }, [p, spring]);
  const angle = useTransform(spring, (v) => -90 + v * 180);
  const pct = useTransform(spring, (v) => `${(v * 100).toFixed(1)}%`);
  const level = p >= 0.6 ? "High" : p >= 0.3 ? "Medium" : "Low";
  const color = level === "High" ? "#ff5a4e" : level === "Medium" ? "#f5b83d" : "#3ddc97";

  const set = <K extends keyof Inputs>(k: K, v: Inputs[K]) => setInputs((s) => ({ ...s, [k]: v }));

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-[#120a0c] p-4 font-mono text-[11px] text-[#f3dfe3] sm:p-5">
      <div className="flex items-center justify-between">
        <span className="tracking-[0.18em] text-[#ff8fa3]">CHURN · PROBABILITY</span>
        <span className="text-[9px] tracking-[0.14em] text-[#f3dfe3]/45">ILLUSTRATIVE MODEL</span>
      </div>
      <div className="mt-4 grid items-center gap-5 sm:grid-cols-[1fr_1fr]">
        <div className="space-y-3">
          <Slider label="Tenure" unit="months" min={1} max={72} value={inputs.tenure} onChange={(v) => set("tenure", v)} disabled={!interactive} />
          <Slider label="Monthly charges" unit="₹" min={199} max={2499} step={50} value={inputs.charges} onChange={(v) => set("charges", v)} disabled={!interactive} />
          <Slider label="Support tickets" unit="last 90 days" min={0} max={8} value={inputs.tickets} onChange={(v) => set("tickets", v)} disabled={!interactive} />
          <div className="grid grid-cols-2 gap-1 rounded-lg bg-white/[0.05] p-1" role="radiogroup" aria-label="Contract type">
            {[true, false].map((m) => (
              <button
                key={String(m)}
                type="button"
                role="radio"
                aria-checked={inputs.monthly === m}
                disabled={!interactive}
                onClick={() => set("monthly", m)}
                className={cn(
                  "rounded-md py-1.5 text-[10px] tracking-[0.1em] transition-colors",
                  inputs.monthly === m ? "bg-[#ff8fa3] text-[#120a0c]" : "text-[#f3dfe3]/60 hover:text-[#f3dfe3]",
                )}
              >
                {m ? "MONTHLY" : "ANNUAL"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative w-full max-w-[220px]">
            <svg viewBox="0 0 200 112" className="w-full" aria-hidden="true">
              <defs>
                <linearGradient id="churn-arc" x1="0" x2="1">
                  <stop offset="0%" stopColor="#3ddc97" />
                  <stop offset="50%" stopColor="#f5b83d" />
                  <stop offset="100%" stopColor="#ff5a4e" />
                </linearGradient>
              </defs>
              <path d="M16 100 A84 84 0 0 1 184 100" fill="none" stroke="url(#churn-arc)" strokeWidth="10" strokeLinecap="round" opacity="0.85" />
              {Array.from({ length: 11 }, (_, i) => {
                const a = Math.PI - (i / 10) * Math.PI;
                return (
                  <line
                    key={i}
                    x1={r2(100 + Math.cos(a) * 70)}
                    y1={r2(100 - Math.sin(a) * 70)}
                    x2={r2(100 + Math.cos(a) * 64)}
                    y2={r2(100 - Math.sin(a) * 64)}
                    stroke="rgba(243,223,227,0.25)"
                  />
                );
              })}
              <motion.g style={{ rotate: angle, originX: "100px", originY: "100px" }}>
                <line x1="100" y1="100" x2="100" y2="30" stroke="#f3dfe3" strokeWidth="2.5" strokeLinecap="round" />
              </motion.g>
              <circle cx="100" cy="100" r="6" fill="#f3dfe3" />
            </svg>
          </div>
          <motion.p className="mt-1 font-sans text-3xl font-semibold tabular-nums text-white" aria-live="polite">
            {pct}
          </motion.p>
          <p className="mt-1 text-[10px] tracking-[0.14em]" style={{ color }}>
            {level.toUpperCase()} CHURN RISK
          </p>
          <p className="mt-2 text-center text-[10px] text-[#f3dfe3]/55">Top driver: {topDriver(inputs)}</p>
        </div>
      </div>
      <p className="mt-4 text-[9px] leading-relaxed text-[#f3dfe3]/40">
        Illustrative logistic function for exploring how inputs move risk, separate from the trained model (reported
        ~72% accuracy on its own dataset).
      </p>
    </div>
  );
}

function Slider({
  label,
  unit,
  min,
  max,
  step = 1,
  value,
  onChange,
  disabled,
}: {
  label: string;
  unit: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="flex justify-between text-[9.5px] tracking-[0.12em] text-[#f3dfe3]/55">
        <span>{label.toUpperCase()}</span>
        <span className="text-[#f3dfe3]">
          {unit === "₹" ? `₹${value.toLocaleString("en-IN")}` : `${value} ${unit}`}
        </span>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1.5 h-1 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-[#ff8fa3]"
      />
    </div>
  );
}
