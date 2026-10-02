"use client";

import { animate, motion, useInView, useMotionValue, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { useReduced } from "@/lib/hooks";
import { EASE_OUT } from "@/lib/utils";

/** Counts up from zero the first time it scrolls into view. */
export function Counter({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1.6,
  className,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduced = useReduced();
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => `${prefix}${v.toFixed(decimals)}${suffix}`);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      mv.set(value);
      return;
    }
    const controls = animate(mv, value, { duration, ease: EASE_OUT });
    return () => controls.stop();
  }, [inView, reduced, value, duration, mv]);

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{`${prefix}${value.toFixed(decimals)}${suffix}`}</span>
      <motion.span aria-hidden="true" className="tabular-nums">
        {text}
      </motion.span>
    </span>
  );
}
