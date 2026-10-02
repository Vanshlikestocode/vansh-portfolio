"use client";

import { useEffect, useRef } from "react";
import { useFinePointer } from "@/lib/hooks";

/**
 * The page's ground plane: a faint engineering grid, a patch of it that lights
 * up around the pointer, and a static film grain. One pointer listener, one
 * rAF write per frame, no React re-renders.
 */
export function Backdrop() {
  const spot = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();

  useEffect(() => {
    const el = spot.current;
    if (!el || !fine) return;
    let frame = 0;
    let x = -999;
    let y = -999;
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!frame) {
        frame = requestAnimationFrame(() => {
          el.style.setProperty("--mx", `${x}px`);
          el.style.setProperty("--my", `${y}px`);
          frame = 0;
        });
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [fine]);

  return (
    <div aria-hidden="true">
      <div className="backdrop-grid" />
      {fine && <div ref={spot} className="backdrop-spot" />}
      <div className="noise" />
    </div>
  );
}
