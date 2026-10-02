"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Counter } from "@/components/ui/Counter";
import { EASE_OUT } from "@/lib/utils";

/* Sales dashboard on SAMPLE DATA: KPIs count up, the revenue line draws, bars grow. */

const MONTHLY = [32, 35, 31, 38, 41, 39, 44, 47, 45, 52, 58, 66];
const PRODUCTS = [
  { name: "Wireless earbuds", v: 0.92 },
  { name: "Smart watch", v: 0.74 },
  { name: "Laptop stand", v: 0.58 },
  { name: "USB-C hub", v: 0.41 },
];
const REGIONS = [
  { name: "West", v: 0.88 },
  { name: "North", v: 0.71 },
  { name: "South", v: 0.63 },
  { name: "East", v: 0.39 },
];

export function SalesPreview({ active }: { active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.3 });
  const on = active || seen;
  const max = 70;
  const path = MONTHLY.map((v, i) => `${i ? "L" : "M"}${(i / 11) * 200},${70 - (v / max) * 64}`).join(" ");

  return (
    <div
      ref={ref}
      className="w-full rounded-2xl border border-white/10 bg-[#070c14] p-4 font-mono text-[11px] text-[#d6e6f7] sm:p-5"
      role="img"
      aria-label="Sample sales dashboard with revenue, orders and growth KPIs, a monthly revenue trend, top products and regional performance."
    >
      <div className="flex items-center justify-between">
        <span className="tracking-[0.18em] text-[#6cb8ff]">SALES · DASHBOARD</span>
        <span className="text-[9px] tracking-[0.14em] text-[#d6e6f7]/45">SAMPLE DATA</span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {[
          { label: "Revenue", node: <Counter value={48.2} decimals={1} prefix="₹" suffix="L" /> },
          { label: "Orders", node: <Counter value={12480} /> },
          { label: "Growth", node: <Counter value={18.4} decimals={1} prefix="+" suffix="%" /> },
        ].map((k) => (
          <div key={k.label} className="rounded-xl border border-white/[0.08] p-2.5">
            <p className="text-[8.5px] tracking-[0.16em] text-[#d6e6f7]/50">{k.label.toUpperCase()}</p>
            <p className="mt-1 font-sans text-base font-semibold text-white sm:text-lg">{k.node}</p>
          </div>
        ))}
      </div>
      <div className="mt-2 rounded-xl border border-white/[0.08] p-3">
        <p className="text-[9px] tracking-[0.16em] text-[#d6e6f7]/50">MONTHLY REVENUE</p>
        <svg viewBox="0 0 200 72" preserveAspectRatio="none" className="mt-2 h-20 w-full" aria-hidden="true">
          <defs>
            <linearGradient id="sales-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#6cb8ff" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#6cb8ff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path
            d={`${path} L200,72 L0,72 Z`}
            fill="url(#sales-fill)"
            initial={{ opacity: 0 }}
            animate={on ? { opacity: 1 } : {}}
            transition={{ delay: 0.9, duration: 0.6 }}
          />
          <motion.path
            d={path}
            fill="none"
            stroke="#6cb8ff"
            strokeWidth="1.8"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            animate={on ? { pathLength: 1 } : {}}
            transition={{ duration: 1.4, ease: EASE_OUT }}
          />
        </svg>
      </div>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        <Bars title="Top products" rows={PRODUCTS} on={on} delay={0.3} />
        <Bars title="Regional performance" rows={REGIONS} on={on} delay={0.5} />
      </div>
    </div>
  );
}

function Bars({ title, rows, on, delay }: { title: string; rows: { name: string; v: number }[]; on: boolean; delay: number }) {
  return (
    <div className="rounded-xl border border-white/[0.08] p-3">
      <p className="text-[9px] tracking-[0.16em] text-[#d6e6f7]/50">{title.toUpperCase()}</p>
      <ul className="mt-2 space-y-1.5">
        {rows.map((r, i) => (
          <li key={r.name}>
            <div className="flex justify-between text-[9.5px] text-[#d6e6f7]/70">
              <span>{r.name}</span>
            </div>
            <div className="mt-0.5 h-1.5 rounded-full bg-white/[0.06]">
              <motion.div
                className="h-full origin-left rounded-full bg-[#6cb8ff]"
                style={{ width: `${r.v * 100}%` }}
                initial={{ scaleX: 0 }}
                animate={on ? { scaleX: 1 } : {}}
                transition={{ delay: delay + i * 0.08, duration: 0.8, ease: EASE_OUT }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
