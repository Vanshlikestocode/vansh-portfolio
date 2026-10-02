"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { EASE_OUT, cn } from "@/lib/utils";

const viewport = { once: true, margin: "0px 0px -12% 0px" } as const;

/** Fades and lifts its children into place the first time they scroll into view. */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "p" | "span" | "section";
}) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: 1, ease: EASE_OUT, delay }}
    >
      {children}
    </Comp>
  );
}

const lineParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const lineChild: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 1.1, ease: EASE_OUT } },
};

/**
 * Masked line reveal: each line rises out of its own clipping box. Used for
 * headings, where the stagger reads as the sentence being set in type.
 */
export function RevealLines({
  lines,
  className,
  lineClassName,
  as = "h2",
}: {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  as?: "h1" | "h2" | "h3" | "p";
}) {
  const Comp = motion[as];
  return (
    <Comp className={className} variants={lineParent} initial="hidden" whileInView="show" viewport={viewport}>
      {lines.map((line, i) => (
        <span key={i} className="rise-mask">
          <motion.span className={cn("block", lineClassName)} variants={lineChild}>
            {line}
          </motion.span>
        </span>
      ))}
    </Comp>
  );
}

const wordParent: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.025 } } };
const wordChild: Variants = {
  hidden: { opacity: 0, y: "0.6em", filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: EASE_OUT } },
};

/** Word-by-word reveal for body copy. */
export function RevealWords({ text, className }: { text: string; className?: string }) {
  return (
    <motion.p className={className} variants={wordParent} initial="hidden" whileInView="show" viewport={viewport}>
      {text.split(" ").map((w, i) => (
        <motion.span key={i} className="inline-block whitespace-pre" variants={wordChild}>
          {w}{" "}
        </motion.span>
      ))}
    </motion.p>
  );
}
