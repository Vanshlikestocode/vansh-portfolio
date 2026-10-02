"use client";

import { Check, MapPin } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useSequence } from "@/lib/hooks";
import { EASE_OUT, cn } from "@/lib/utils";

/* Destination → Preferences → AI planning → Itinerary → Trip, with a sample plan. */

const FLOW = ["Destination", "Preferences", "AI planning", "Itinerary", "Trip"];
const DURATIONS = [1000, 1000, 1500, 2600, 2200] as const;

const DAYS = [
  { day: "Day 1", items: ["Amber Fort · morning", "Panna Meena ka Kund", "Johari Bazaar · evening"] },
  { day: "Day 2", items: ["City Palace", "Jantar Mantar", "Hawa Mahal · sunset"] },
  { day: "Day 3", items: ["Nahargarh Fort", "Albert Hall Museum", "Masala Chowk · dinner"] },
];

export function TripPreview({ active }: { active: boolean }) {
  const step = useSequence(FLOW.length, DURATIONS, active, 4);

  return (
    <div
      className="w-full rounded-2xl border border-white/10 bg-[#061110] p-4 font-mono text-[11px] text-[#d3efec] sm:p-5"
      role="img"
      aria-label="Sample: a three-day Jaipur itinerary generated from a destination and preferences."
    >
      <ol className="flex flex-wrap items-center gap-1.5">
        {FLOW.map((f, i) => (
          <li key={f} className="flex items-center gap-1.5">
            <motion.span
              className="rounded-full border px-2.5 py-1 text-[9.5px] tracking-[0.12em]"
              animate={{
                borderColor: i <= step ? "rgba(79,209,197,0.6)" : "rgba(255,255,255,0.1)",
                color: i <= step ? "#4fd1c5" : "rgba(211,239,236,0.4)",
                backgroundColor: i === step ? "rgba(79,209,197,0.1)" : "rgba(0,0,0,0)",
              }}
            >
              {f.toUpperCase()}
            </motion.span>
            {i < FLOW.length - 1 && <span className="text-[#d3efec]/25">→</span>}
          </li>
        ))}
      </ol>

      <div className="mt-4 grid gap-3 sm:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-2">
          <Field label="Destination" value="Jaipur, Rajasthan" on={step >= 0} />
          <Field label="Length" value="3 days" on={step >= 1} />
          <Field label="Interests" value="Heritage · food · photography" on={step >= 1} />
          <Field label="Budget" value="Mid-range" on={step >= 1} />
          <div className="flex h-8 items-center gap-2 rounded-lg border border-white/[0.08] px-2.5">
            {step === 2 ? (
              <>
                <span className="text-[#4fd1c5]">planning</span>
                <span className="flex gap-0.5">
                  {[0, 1, 2, 3].map((i) => (
                    <motion.span
                      key={i}
                      className="h-2.5 w-1 rounded-sm bg-[#4fd1c5]"
                      animate={{ scaleY: [0.3, 1, 0.3] }}
                      transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.1 }}
                    />
                  ))}
                </span>
              </>
            ) : step > 2 ? (
              <span className="flex items-center gap-1.5 text-[#3ddc97]">
                <Check className="size-3" /> structured plan ready
              </span>
            ) : (
              <span className="text-[#d3efec]/35">waiting for input…</span>
            )}
          </div>
        </div>

        <div className="relative min-h-[188px] space-y-2">
          <AnimatePresence>
            {step >= 3 &&
              DAYS.map((d, i) => (
                <motion.div
                  key={d.day}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-2.5"
                  initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.25, ease: EASE_OUT }}
                >
                  <p className="text-[9px] tracking-[0.16em] text-[#4fd1c5]">{d.day.toUpperCase()}</p>
                  <ul className="mt-1 space-y-0.5">
                    {d.items.map((it, j) => (
                      <motion.li
                        key={it}
                        className="flex items-center gap-1.5 text-[10.5px]"
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.25 + 0.15 + j * 0.08 }}
                      >
                        <MapPin className="size-2.5 shrink-0 text-[#4fd1c5]/70" />
                        {it}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
          </AnimatePresence>
          {step < 3 && (
            <div className="absolute inset-0 grid place-items-center rounded-xl border border-dashed border-white/10 text-[#d3efec]/30">
              itinerary appears here
            </div>
          )}
          {step === 4 && (
            <motion.p
              className="text-[10px] tracking-[0.14em] text-[#3ddc97]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              ✓ TRIP SAVED
            </motion.p>
          )}
        </div>
      </div>
      <p className="mt-3 text-[9px] text-[#d3efec]/35">Sample itinerary for illustration.</p>
    </div>
  );
}

function Field({ label, value, on }: { label: string; value: string; on: boolean }) {
  return (
    <div className={cn("rounded-lg border border-white/[0.08] px-2.5 py-1.5 transition-opacity duration-500", on ? "opacity-100" : "opacity-25")}>
      <p className="text-[8.5px] tracking-[0.16em] text-[#d3efec]/45">{label.toUpperCase()}</p>
      <p className="text-[11px] text-[#d3efec]">{value}</p>
    </div>
  );
}
