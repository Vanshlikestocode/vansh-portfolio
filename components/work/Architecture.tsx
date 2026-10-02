"use client";

import { Fragment, useRef } from "react";
import { Reveal } from "@/components/ui/Reveal";
import type { ArchNode } from "@/data/projects";
import { usePauseOffscreen } from "@/lib/hooks";
import { cn, pad2 } from "@/lib/utils";

/**
 * A deliberately simple system diagram: one row of components (a column on
 * phones) with packets travelling the connections. Planned parts are dashed.
 */
export function Architecture({ nodes, accent }: { nodes: ArchNode[]; accent: string }) {
  const ref = useRef<HTMLOListElement>(null);
  usePauseOffscreen(ref);

  return (
    <ol ref={ref} className="flex flex-col md:flex-row md:items-stretch" aria-label="System architecture">
      {nodes.map((n, i) => (
        <Fragment key={n.label}>
          <Reveal
            as="li"
            delay={i * 0.07}
            className={cn(
              "group relative flex-1 rounded-xl border p-4 transition-colors duration-300 hover:bg-white/[0.03]",
              n.planned ? "border-dashed border-line-2" : "border-line bg-white/[0.015]",
            )}
          >
            <span className="label text-faint">{pad2(i + 1)}</span>
            <p className="mt-3 font-medium text-paper">{n.label}</p>
            <p className="mt-1 font-mono text-[11px] leading-relaxed text-mute">{n.detail}</p>
            {n.planned && <p className="label mt-3 text-warn">Planned</p>}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-4 top-0 h-px origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
              style={{ backgroundColor: accent }}
            />
          </Reveal>
          {i < nodes.length - 1 && (
            <li aria-hidden="true" className="relative mx-auto h-8 w-px shrink-0 overflow-hidden bg-line-2 md:mx-0 md:h-px md:w-8 md:self-center">
              <span
                className="absolute inset-0 hidden md:block"
                style={{ animation: `travel-x 1.8s ${i * 0.3}s var(--ease-quint) infinite` }}
              >
                <span className="absolute right-0 top-1/2 size-1.5 -translate-y-1/2 rounded-full" style={{ backgroundColor: accent, boxShadow: `0 0 8px ${accent}` }} />
              </span>
              <span
                className="absolute inset-0 md:hidden"
                style={{ animation: `travel-y 1.8s ${i * 0.3}s var(--ease-quint) infinite` }}
              >
                <span className="absolute bottom-0 left-1/2 size-1.5 -translate-x-1/2 rounded-full" style={{ backgroundColor: accent, boxShadow: `0 0 8px ${accent}` }} />
              </span>
            </li>
          )}
        </Fragment>
      ))}
    </ol>
  );
}
