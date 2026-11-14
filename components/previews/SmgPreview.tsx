"use client";

import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect } from "react";
import { useReduced, useSequence } from "@/lib/hooks";
import { EASE_OUT, cn, r2, seeded } from "@/lib/utils";

/*
 * SMG risk engine, as a labelled DEMO. Three simulated transactions flow
 * through the same stages the real API uses. Nothing here calls the model.
 */

const DEMO = [
  { amount: "₹18,420", merchant: "Electronics", time: "02:14", card: "4821", device: "New device", p: 87.4, risk: "High" as const },
  { amount: "₹640", merchant: "Groceries", time: "18:32", card: "1093", device: "Known device", p: 2.1, risk: "Low" as const },
  { amount: "₹5,260", merchant: "Travel", time: "23:47", card: "7710", device: "Known device", p: 46.3, risk: "Medium" as const },
];

const STAGES = ["Transaction", "Feature processing", "ML model", "Fraud probability", "Risk decision"];
// For each transaction: 5 stages, then a hold on the decision.
const DURATIONS = [900, 1100, 1000, 1300, 2200] as const;

const riskColor = { High: "#ff5a4e", Medium: "#f5b83d", Low: "#3ddc97" };
const decision = { High: "Hold for review", Medium: "Step-up verification", Low: "Approve" };

/** 30 feature magnitudes per transaction (Time, V1–V28, Amount), deterministic. */
const VECTORS = DEMO.map((_, i) => {
  const r = seeded(41 + i * 17);
  return Array.from({ length: 30 }, () => r2(0.12 + r() * 0.88));
});

export function SmgPreview({ active }: { active: boolean }) {
  const tick = useSequence(DEMO.length * STAGES.length, DURATIONS, active, 4);
  const txIndex = Math.floor(tick / STAGES.length);
  const stage = tick % STAGES.length;
  const tx = DEMO[txIndex];

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-[#07110d] p-4 font-mono text-[11px] text-[#cfe9dc] sm:p-5"
      role="img"
      aria-label={`Illustration of the SMG pipeline: a simulated ${tx.amount} transaction scored at ${tx.p}% fraud probability, ${tx.risk.toLowerCase()} risk.`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{ background: "radial-gradient(600px 240px at 80% 0%, rgba(61,220,151,0.12), transparent 70%)" }}
      />
      <div className="relative flex items-center justify-between gap-3">
        <span className="tracking-[0.18em] text-[#3ddc97]">SMG · RISK ENGINE</span>
        <span className="rounded-full border border-[#f5b83d]/40 bg-[#f5b83d]/10 px-2.5 py-1 text-[10px] tracking-[0.14em] text-[#f5b83d]">
          SIMULATED DATA
        </span>
      </div>

      <div className="relative mt-4 grid gap-3 sm:grid-cols-[1fr_1.25fr_1fr]">
        {/* Transaction */}
        <Panel lit={stage === 0} title="Transaction">
          <motion.p
            key={tx.amount}
            className="font-sans text-2xl font-semibold tracking-tight text-white"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
          >
            {tx.amount}
          </motion.p>
          <dl className="mt-2 space-y-1 text-[10px] text-[#cfe9dc]/60 [&>div]:gap-3 [&_dd]:text-right">
            <div className="flex justify-between"><dt>merchant</dt><dd className="text-[#cfe9dc]">{tx.merchant}</dd></div>
            <div className="flex justify-between"><dt>time</dt><dd className="text-[#cfe9dc]">{tx.time} IST</dd></div>
            <div className="flex justify-between"><dt>card</dt><dd className="text-[#cfe9dc]">•••• {tx.card}</dd></div>
            <div className="flex justify-between"><dt>device</dt><dd className="text-[#cfe9dc]">{tx.device}</dd></div>
          </dl>
        </Panel>

        {/* Features + model */}
        <Panel lit={stage === 1 || stage === 2} title={stage === 2 ? "ML model · logistic regression" : "Features · 30 inputs"}>
          <div className="flex h-14 items-end gap-[2px]">
            {VECTORS[txIndex].map((v, i) => (
              <motion.span
                key={i}
                className="flex-1 rounded-[1px]"
                style={{ backgroundColor: i === 0 || i === 29 ? "#f5b83d" : "#3ddc97" }}
                initial={false}
                animate={{ height: stage >= 1 ? `${v * 100}%` : "8%", opacity: stage >= 1 ? 0.85 : 0.25 }}
                transition={{ duration: 0.6, delay: stage === 1 ? i * 0.012 : 0, ease: EASE_OUT }}
              />
            ))}
          </div>
          <div className="mt-1 flex justify-between text-[9px] text-[#cfe9dc]/40">
            <span>Time</span>
            <span>V1 … V28</span>
            <span>Amount</span>
          </div>
          <Sigmoid p={tx.p} on={stage >= 2} />
        </Panel>

        {/* Probability + decision */}
        <Panel lit={stage >= 3} title="Fraud probability">
          <Gauge p={tx.p} on={stage >= 3} color={riskColor[tx.risk]} />
          <motion.div
            className="mt-2 flex items-center justify-between rounded-lg px-2.5 py-2"
            animate={{
              backgroundColor: stage >= 4 ? `${riskColor[tx.risk]}22` : "rgba(255,255,255,0.03)",
              opacity: stage >= 4 ? 1 : 0.4,
            }}
          >
            <span className="tracking-[0.14em]" style={{ color: stage >= 4 ? riskColor[tx.risk] : undefined }}>
              {stage >= 4 ? `${tx.risk.toUpperCase()} RISK` : "PENDING"}
            </span>
            <span className="text-[10px] text-[#cfe9dc]/70">{stage >= 4 ? decision[tx.risk] : "—"}</span>
          </motion.div>
        </Panel>
      </div>

      <ol className="relative mt-4 hidden items-center gap-2 text-[9px] tracking-[0.14em] sm:flex">
        {STAGES.map((s, i) => (
          <li key={s} className="flex flex-1 items-center gap-2">
            <span className={cn("whitespace-nowrap transition-colors duration-300", i <= stage ? "text-[#3ddc97]" : "text-[#cfe9dc]/30")}>
              {s.toUpperCase()}
            </span>
            {i < STAGES.length - 1 && (
              <span className="relative h-px flex-1 bg-white/10">
                <motion.span
                  className="absolute inset-0 origin-left bg-[#3ddc97]"
                  animate={{ scaleX: i < stage ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: EASE_OUT }}
                />
              </span>
            )}
          </li>
        ))}
      </ol>
      <p className="relative mt-3 text-[9px] text-[#cfe9dc]/40">
        Illustration only — no real transactions, no live API call. Sample {txIndex + 1}/3.
      </p>
    </div>
  );
}

function Panel({ lit, title, children }: { lit: boolean; title: string; children: React.ReactNode }) {
  return (
    <motion.div
      className="rounded-xl border p-3"
      animate={{
        borderColor: lit ? "rgba(61,220,151,0.45)" : "rgba(255,255,255,0.08)",
        backgroundColor: lit ? "rgba(61,220,151,0.05)" : "rgba(255,255,255,0.02)",
      }}
      transition={{ duration: 0.4 }}
    >
      <p className="mb-2 text-[9px] tracking-[0.16em] text-[#cfe9dc]/50">{title.toUpperCase()}</p>
      {children}
    </motion.div>
  );
}

function Sigmoid({ p, on }: { p: number; on: boolean }) {
  // Map probability back to the logit to place the point on the curve.
  const z = Math.log(p / 100 / (1 - p / 100));
  const W = 160;
  const H = 46;
  const px = r2(((z + 6) / 12) * W);
  const py = r2(H - (p / 100) * H);
  const d = Array.from({ length: 41 }, (_, i) => {
    const x = (i / 40) * W;
    const y = H - (1 / (1 + Math.exp(-((x / W) * 12 - 6)))) * H;
    return `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  return (
    <svg viewBox={`-4 -4 ${W + 8} ${H + 8}`} className="mt-2 h-12 w-full" aria-hidden="true">
      <path d={d} fill="none" stroke="rgba(207,233,220,0.18)" strokeWidth="1.5" />
      <motion.path
        d={d}
        fill="none"
        stroke="#3ddc97"
        strokeWidth="1.5"
        initial={false}
        animate={{ pathLength: on ? 1 : 0 }}
        transition={{ duration: 0.8, ease: EASE_OUT }}
      />
      <motion.circle
        r="3.5"
        fill="#f5b83d"
        initial={false}
        animate={{ cx: on ? px : 0, cy: on ? py : H, opacity: on ? 1 : 0 }}
        transition={{ duration: 0.8, ease: EASE_OUT }}
      />
    </svg>
  );
}

function Gauge({ p, on, color }: { p: number; on: boolean; color: string }) {
  const reduced = useReduced();
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => `${v.toFixed(1)}%`);
  const r = 34;
  const c = Math.PI * r;
  const offset = useTransform(mv, (v) => c - (v / 100) * c);

  useEffect(() => {
    if (!on) {
      mv.set(0);
      return;
    }
    if (reduced) {
      mv.set(p);
      return;
    }
    const ctl = animate(mv, p, { duration: 1.1, ease: EASE_OUT });
    return () => ctl.stop();
  }, [on, p, mv, reduced]);

  return (
    <div className="relative mx-auto w-[120px]">
      <svg viewBox="0 0 84 46" className="w-full" aria-hidden="true">
        <path d="M8 42 A34 34 0 0 1 76 42" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" strokeLinecap="round" />
        <motion.path
          d="M8 42 A34 34 0 0 1 76 42"
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          style={{ strokeDashoffset: offset }}
        />
      </svg>
      <motion.p className="absolute inset-x-0 bottom-0 text-center font-sans text-xl font-semibold tabular-nums text-white">
        {text}
      </motion.p>
    </div>
  );
}
