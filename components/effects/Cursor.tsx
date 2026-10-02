"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { useFinePointer, useReduced } from "@/lib/hooks";

type CursorKind = "default" | "link" | "button" | "project" | "text" | "hidden";

interface CursorState {
  kind: CursorKind;
  label?: string;
}

/** Elements opt in with `data-cursor="project|link|button|text"` and optional `data-cursor-label`. */
const INTERACTIVE = "[data-cursor], a, button, [role='button'], summary, label, select";

/**
 * Desktop-only cursor: a glowing point that tracks exactly, plus a ring that
 * trails on a spring and changes shape to say what a click will do.
 */
export function Cursor() {
  const fine = useFinePointer();
  const reduced = useReduced();
  if (!fine || reduced) return null;
  return <CursorInner />;
}

function CursorInner() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 420, damping: 36, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 420, damping: 36, mass: 0.6 });
  const [state, setState] = useState<CursorState>({ kind: "hidden" });
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("has-cursor");

    const resolve = (target: EventTarget | null): CursorState => {
      if (!(target instanceof Element)) return { kind: "default" };
      if (target.closest("input, textarea, [contenteditable='true']")) return { kind: "text" };
      const el = target.closest(INTERACTIVE);
      if (!el) return { kind: "default" };
      const declared = el.getAttribute("data-cursor") as CursorKind | null;
      const label = el.getAttribute("data-cursor-label") ?? undefined;
      if (declared) return { kind: declared, label };
      return { kind: el.tagName === "A" ? "link" : "button" };
    };

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const onOver = (e: PointerEvent) => {
      const next = resolve(e.target);
      setState((prev) => (prev.kind === next.kind && prev.label === next.label ? prev : next));
    };
    const onLeave = () => setState({ kind: "hidden" });
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    return () => {
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [x, y]);

  const ring: Record<CursorKind, { scale: number; opacity: number; fill: number }> = {
    default: { scale: 0.31, opacity: 1, fill: 0 },
    link: { scale: 0.47, opacity: 1, fill: 0.08 },
    button: { scale: 0.6, opacity: 1, fill: 0.1 },
    project: { scale: 1, opacity: 1, fill: 1 },
    text: { scale: 0.2, opacity: 0, fill: 0 },
    hidden: { scale: 0.2, opacity: 0, fill: 0 },
  };
  const r = ring[state.kind];
  const showDot = state.kind === "default";

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[400]">
      <motion.div
        className="absolute left-0 top-0 grid size-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full"
        style={{ x: rx, y: ry }}
        animate={{ scale: pressed ? r.scale * 0.85 : r.scale, opacity: r.opacity }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
      >
        <motion.span
          className="absolute inset-0 rounded-full border"
          animate={{
            backgroundColor: state.kind === "project" ? "rgba(255,91,31,1)" : `rgba(236,235,230,${r.fill})`,
            borderColor: state.kind === "project" ? "rgba(255,91,31,1)" : "rgba(236,235,230,0.45)",
            borderWidth: state.kind === "default" ? 2.5 : 1.5,
          }}
          transition={{ duration: 0.25 }}
        />
        <AnimatePresence>
          {state.kind === "project" && (
            <motion.span
              key="label"
              className="relative whitespace-nowrap font-mono text-[9.5px] font-medium uppercase tracking-[0.12em] text-ink"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              {state.label ?? "View project →"}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
      <motion.div
        className="absolute left-0 top-0 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal shadow-[0_0_12px_2px_rgba(255,91,31,0.7)]"
        style={{ x, y }}
        animate={{ opacity: showDot ? 1 : 0, scale: pressed ? 0.6 : 1 }}
        transition={{ duration: 0.15 }}
      />
    </div>
  );
}
