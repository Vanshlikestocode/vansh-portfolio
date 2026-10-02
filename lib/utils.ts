import { clsx, type ClassValue } from "clsx";

export const cn = (...inputs: ClassValue[]) => clsx(inputs);

/** Expo-out: the house easing for anything that arrives. */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
/** Quint in-out: for things that move between two resting states. */
export const EASE_IN_OUT = [0.83, 0, 0.17, 1] as const;

/** Deterministic PRNG so "random" visuals render identically on server and client. */
export function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Rounds SVG coordinates so server and browser trig results serialise identically. */
export const r2 = (n: number) => Math.round(n * 100) / 100;

export const pad2 = (n: number) => String(n).padStart(2, "0");

export function formatDate(iso: string) {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
}
