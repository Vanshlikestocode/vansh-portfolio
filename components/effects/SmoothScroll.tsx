"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { useFinePointer, useReduced } from "@/lib/hooks";
import { setLenis } from "@/lib/store";

/**
 * Inertial scrolling for mouse and trackpad users only. Touch devices keep
 * native scrolling, and reduced-motion users keep the browser default.
 */
export function SmoothScroll() {
  const fine = useFinePointer();
  const reduced = useReduced();

  useEffect(() => {
    if (!fine || reduced) return;
    const lenis = new Lenis({ lerp: 0.11, smoothWheel: true, autoRaf: true });
    setLenis(lenis);
    return () => {
      setLenis(null);
      lenis.destroy();
    };
  }, [fine, reduced]);

  return null;
}
