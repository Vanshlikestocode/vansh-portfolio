"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useState, useSyncExternalStore, type RefObject } from "react";

function subscribeMedia(query: string) {
  return (onChange: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  };
}

/** SSR-safe media query. Returns `serverValue` until hydrated. */
export function useMediaQuery(query: string, serverValue = false) {
  return useSyncExternalStore(
    subscribeMedia(query),
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

/** True on devices with a precise pointer that can hover (mouse, trackpad). */
export const useFinePointer = () => useMediaQuery("(hover: hover) and (pointer: fine)");

/** Reduced motion from the OS setting (null on the server → treated as false). */
export const useReduced = () => Boolean(useReducedMotion());

/**
 * Steps through `length` states while `active`, waiting `durations[i]` ms on
 * each. When motion is reduced it rests on `restStep` so the most informative
 * frame is shown without animation.
 */
export function useSequence(length: number, durations: readonly number[], active: boolean, restStep = 0) {
  const reduced = useReduced();
  const [step, setStep] = useState(0);
  const running = active && !reduced;

  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => setStep((s) => (s + 1) % length), durations[step % durations.length]);
    return () => window.clearTimeout(t);
  }, [running, step, length, durations]);

  return reduced ? restStep : step;
}

/** Pauses CSS animations inside `ref` while it is off-screen. */
export function usePauseOffscreen(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      el.dataset.paused = entry.isIntersecting ? "false" : "true";
    });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
}
