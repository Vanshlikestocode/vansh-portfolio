"use client";

import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { relatedTech, stack, stackGroups, usageFor, type Tech } from "@/data/stack";
import { useFinePointer } from "@/lib/hooks";
import { bumpInteraction, openProject } from "@/lib/store";
import { EASE_OUT, cn } from "@/lib/utils";

interface Line {
  id: string;
  d: string;
}

const DEFAULT = "FastAPI";

/**
 * The stack as a system rather than a logo wall. Selecting a technology
 * explains what I use it for, lists the projects it appears in, and draws
 * connections to the tools it has shipped alongside.
 */
export function StackSystem() {
  const fine = useFinePointer();
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string>(DEFAULT);
  const [lines, setLines] = useState<Line[]>([]);
  const board = useRef<HTMLDivElement>(null);
  const chips = useRef(new Map<string, HTMLElement>());

  const activeName = hovered ?? pinned;
  const active = stack.find((t) => t.name === activeName) ?? stack[0];
  const related = useMemo(() => new Set(relatedTech(active)), [active]);
  const usage = useMemo(() => usageFor(active), [active]);

  const measure = useCallback((name: string) => {
    const root = board.current;
    const from = chips.current.get(name);
    const tech = stack.find((t) => t.name === name);
    if (!root || !from || !tech) return;
    const base = root.getBoundingClientRect();
    const a = from.getBoundingClientRect();
    const ax = a.left + a.width / 2 - base.left;
    const ay = a.top + a.height / 2 - base.top;
    const next: Line[] = [];
    for (const other of relatedTech(tech)) {
      const el = chips.current.get(other);
      if (!el) continue;
      const b = el.getBoundingClientRect();
      const bx = b.left + b.width / 2 - base.left;
      const by = b.top + b.height / 2 - base.top;
      const mx = (ax + bx) / 2;
      const my = (ay + by) / 2 - Math.min(80, Math.abs(bx - ax) * 0.25 + 20);
      next.push({ id: `${name}-${other}`, d: `M${ax.toFixed(1)},${ay.toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${bx.toFixed(1)},${by.toFixed(1)}` });
    }
    setLines(next);
  }, []);

  // Re-measure on resize (the observer also fires once on mount, drawing the default).
  useEffect(() => {
    const root = board.current;
    if (!root) return;
    const ro = new ResizeObserver(() => measure(activeName));
    ro.observe(root);
    return () => ro.disconnect();
  }, [activeName, measure]);

  const select = (name: string, how: "hover" | "pin") => {
    if (how === "hover") setHovered(name);
    else {
      setPinned(name);
      bumpInteraction();
    }
    measure(name);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
      <div
        ref={board}
        className="relative"
        onPointerLeave={() => {
          if (!fine) return;
          setHovered(null);
          measure(pinned);
        }}
      >
        <svg aria-hidden="true" className="pointer-events-none absolute inset-0 size-full overflow-visible">
          <AnimatePresence>
            {lines.map((l, i) => (
              <motion.path
                key={l.id}
                d={l.d}
                fill="none"
                stroke="var(--color-signal)"
                strokeWidth="1"
                strokeOpacity="0.55"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                transition={{ duration: 0.6, ease: EASE_OUT, delay: i * 0.03 }}
              />
            ))}
          </AnimatePresence>
        </svg>

        <div className="relative space-y-8">
          {stackGroups.map((group) => (
            <div key={group}>
              <p className="label text-faint">{group}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {stack
                  .filter((t) => t.group === group)
                  .map((t) => {
                    const isActive = t.name === active.name;
                    const isRelated = related.has(t.name);
                    return (
                      <li key={t.name}>
                        <button
                          ref={(el) => {
                            if (el) chips.current.set(t.name, el);
                            else chips.current.delete(t.name);
                          }}
                          type="button"
                          aria-pressed={t.name === pinned}
                          onPointerEnter={() => fine && select(t.name, "hover")}
                          onFocus={() => select(t.name, "hover")}
                          onBlur={() => setHovered(null)}
                          onClick={() => select(t.name, "pin")}
                          className={cn(
                            "relative rounded-full border px-4 py-2 font-mono text-[12.5px] transition-all duration-300",
                            isActive
                              ? "border-paper bg-paper text-ink"
                              : isRelated
                                ? "border-signal/60 bg-ink text-paper shadow-[inset_0_0_0_999px_rgb(255_91_31/0.1)]"
                                : "border-line-2 bg-ink text-paper-dim hover:border-paper/40 hover:text-paper",
                            !isActive && !isRelated && "opacity-60",
                          )}
                        >
                          {t.name}
                        </button>
                      </li>
                    );
                  })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <aside
        aria-live="polite"
        className="glass sticky bottom-3 z-10 self-end rounded-2xl p-5 shadow-2xl shadow-black/60 sm:p-6 lg:top-28 lg:bottom-auto lg:self-start"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
          >
            <p className="label text-mute">{active.group}</p>
            <p className="display mt-3 text-4xl text-paper sm:text-5xl">{active.name}</p>
            <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1">
              {active.reveals.map((r, i) => (
                <motion.li
                  key={r}
                  className="text-paper-dim"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i + 0.05 }}
                >
                  {i > 0 && <span className="mr-3 text-signal">·</span>}
                  {r}
                </motion.li>
              ))}
            </ul>
            <Usage tech={active} usage={usage} />
            <p className="label mt-5 text-faint">
              {related.size ? `Shipped alongside ${related.size} other tool${related.size === 1 ? "" : "s"}` : "No shared projects on this site yet"}
              {fine ? " · click to pin" : ""}
            </p>
          </motion.div>
        </AnimatePresence>
      </aside>
    </div>
  );
}

function Usage({ tech, usage }: { tech: Tech; usage: ReturnType<typeof usageFor> }) {
  const projects = usage.filter((u) => u.kind === "project");
  const builds = usage.filter((u) => u.kind === "experiment");
  if (!usage.length) {
    return <p className="mt-5 text-sm text-mute">Part of my toolkit — {tech.name} isn&apos;t featured in a project on this site yet.</p>;
  }
  return (
    <div className="mt-5 border-t border-line pt-4">
      <p className="label text-mute">Used in</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {projects.map((u) => (
          <li key={u.slug}>
            <button
              type="button"
              onClick={() => openProject(u.slug)}
              data-cursor="link"
              className="group inline-flex items-center gap-1 rounded-full border border-line-2 px-3 py-1 text-sm text-paper transition-colors hover:border-paper/40"
            >
              {u.name}
              <ArrowUpRight className="size-3 opacity-60 transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
            </button>
          </li>
        ))}
        {builds.slice(0, 4).map((u) => (
          <li key={u.slug} className="rounded-full border border-dashed border-line px-3 py-1 text-sm text-mute">
            {u.name}
          </li>
        ))}
        {builds.length > 4 && <li className="px-1 py-1 text-sm text-faint">+{builds.length - 4}</li>}
      </ul>
    </div>
  );
}
