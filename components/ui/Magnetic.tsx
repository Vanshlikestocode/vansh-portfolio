"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef, type ComponentProps, type ReactNode } from "react";
import { useFinePointer, useReduced } from "@/lib/hooks";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost";

const variants: Record<Variant, string> = {
  primary: "bg-paper text-ink hover:bg-white",
  outline: "border border-line-2 text-paper hover:border-paper/40 bg-white/[0.02]",
  ghost: "text-paper hover:bg-white/[0.05]",
};

interface MagneticProps {
  children: ReactNode;
  href?: string;
  onClick?: ComponentProps<"button">["onClick"];
  variant?: Variant;
  className?: string;
  /** Pull strength, 0–1. */
  strength?: number;
  external?: boolean;
  ariaLabel?: string;
}

/**
 * A button that leans toward the pointer. The label moves further than the
 * shell, which gives the press a sense of depth. Inert on touch devices.
 */
export function Magnetic({
  children,
  href,
  onClick,
  variant = "outline",
  className,
  strength = 0.35,
  external,
  ariaLabel,
}: MagneticProps) {
  const ref = useRef<HTMLElement>(null);
  const fine = useFinePointer();
  const reduced = useReduced();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 260, damping: 18, mass: 0.4 });
  const y = useSpring(my, { stiffness: 260, damping: 18, mass: 0.4 });
  const ix = useTransform(x, (v) => v * 0.45);
  const iy = useTransform(y, (v) => v * 0.45);

  const enabled = fine && !reduced;

  const onMove = (e: React.PointerEvent) => {
    if (!enabled || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * strength);
    my.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const classes = cn(
    "group/mag relative inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[0.95rem] font-medium tracking-tight transition-colors duration-300 will-change-transform",
    variants[variant],
    className,
  );

  const inner = (
    <motion.span className="relative inline-flex items-center gap-2" style={{ x: ix, y: iy }}>
      {children}
    </motion.span>
  );

  if (href) {
    return (
      <motion.a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        onClick={onClick as ComponentProps<"a">["onClick"]}
        aria-label={ariaLabel}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={classes}
        style={{ x, y }}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        data-cursor="button"
      >
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={classes}
      style={{ x, y }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      data-cursor="button"
    >
      {inner}
    </motion.button>
  );
}
