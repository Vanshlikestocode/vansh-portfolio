"use client";

import { ArrowUpRight, X } from "lucide-react";
import { motion, useIsPresent } from "motion/react";
import { useEffect, useRef } from "react";
import { experiments, labDomains, type LabDomain } from "@/data/lab";
import { getProject } from "@/data/projects";
import { openProject } from "@/lib/store";
import { EASE_OUT } from "@/lib/utils";

export function LabModal({ domain, onClose }: { domain: LabDomain; onClose: () => void }) {
  const close = useRef<HTMLButtonElement>(null);
  const present = useIsPresent();
  const items = experiments.filter((e) => e.domains.includes(domain));
  const info = labDomains.find((d) => d.id === domain);
  const related = (info?.projects ?? []).map(getProject).filter((p) => p !== undefined);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    close.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previous?.focus?.({ preventScroll: true });
    };
  }, [onClose]);

  return (
    <div
      className={`fixed inset-0 z-[140] flex items-end justify-center sm:items-center sm:p-6 ${present ? "" : "pointer-events-none"}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lab-title"
    >
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="relative max-h-[88svh] w-full max-w-2xl overflow-hidden rounded-t-3xl border border-line-2 bg-ink-2 shadow-2xl sm:rounded-3xl"
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.98, transition: { duration: 0.2 } }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
      >
        <div data-lenis-prevent className="max-h-[88svh] overflow-y-auto overscroll-contain p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="label text-signal">Lab module</p>
              <h3 id="lab-title" className="display mt-3 text-5xl text-paper">
                {domain}
              </h3>
              {info && <p className="mt-2 text-mute">{info.blurb}</p>}
            </div>
            <button
              ref={close}
              type="button"
              onClick={onClose}
              aria-label="Close module"
              className="grid size-10 shrink-0 place-items-center rounded-full border border-line-2 text-paper transition-transform duration-300 hover:rotate-90"
            >
              <X className="size-4" />
            </button>
          </div>

          {items.length > 0 ? (
            <ul className="mt-8 space-y-3">
              {items.map((e, i) => (
                <motion.li
                  key={e.slug}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05, duration: 0.5, ease: EASE_OUT }}
                  className="rounded-2xl border border-line bg-ink p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-medium text-paper">{e.name}</p>
                    <span className="label shrink-0 text-faint">{e.date}</span>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-mute">{e.summary}</p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-[11px] text-faint">{e.tech.join(" · ")}</span>
                    {e.link && (
                      <a
                        href={e.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="label link-line inline-flex items-center gap-1 text-paper"
                      >
                        Repository <ArrowUpRight className="size-3" />
                      </a>
                    )}
                  </div>
                </motion.li>
              ))}
            </ul>
          ) : (
            <p className="mt-8 text-mute">No smaller builds here yet — the flagship work below covers this area.</p>
          )}

          {related.length > 0 && (
            <div className="mt-8 border-t border-line pt-6">
              <p className="label text-mute">Related projects</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {related.map((p) => (
                  <button
                    key={p.slug}
                    type="button"
                    onClick={() => {
                      onClose();
                      openProject(p.slug);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line-2 px-4 py-2 text-sm text-paper transition-colors hover:border-paper/40"
                  >
                    {p.name} <ArrowUpRight className="size-3.5" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
