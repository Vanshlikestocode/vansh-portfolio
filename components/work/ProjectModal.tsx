"use client";

import { X } from "lucide-react";
import { motion, useIsPresent } from "motion/react";
import { useEffect, useRef } from "react";
import { getProject } from "@/data/projects";
import { closeProject } from "@/lib/store";
import { EASE_OUT } from "@/lib/utils";
import { ProjectDetail } from "./ProjectDetail";

/**
 * Full-screen case study. The card's shell grows into the panel (shared
 * layoutId), then the content settles in. Esc, the close button, the backdrop
 * and the browser back button all close it; focus is trapped while open and
 * returned afterwards.
 */
export function ProjectModal({ slug }: { slug: string }) {
  const project = getProject(slug);
  const panel = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  // While animating out, the overlay must never swallow clicks meant for the page.
  const present = useIsPresent();

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeBtn.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeProject();
        return;
      }
      if (e.key !== "Tab" || !panel.current) return;
      const focusable = [
        ...panel.current.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex='-1'])",
        ),
      ];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previous?.focus?.({ preventScroll: true });
    };
  }, []);

  // Moving between projects inside the modal starts at the top.
  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 });
  }, [slug]);

  if (!project) return null;

  return (
    <div
      className={present ? "fixed inset-0 z-[150]" : "pointer-events-none fixed inset-0 z-[150]"}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-title"
    >
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.3 } }}
        onClick={closeProject}
      />
      <motion.div
        layoutId={`shell-${slug}`}
        className="absolute inset-0 border border-line-2 bg-ink-2 sm:inset-4 lg:inset-6"
        style={{ borderRadius: 24 }}
        transition={{ duration: 0.7, ease: EASE_OUT }}
      />
      <motion.div
        ref={panel}
        className="absolute inset-0 overflow-hidden sm:inset-4 lg:inset-6"
        style={{ borderRadius: 24 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.18, duration: 0.5 } }}
        exit={{ opacity: 0, transition: { duration: 0.18 } }}
      >
        <div ref={scroller} data-lenis-prevent className="h-full overflow-y-auto overscroll-contain">
          <div className="sticky top-0 z-20 flex justify-end p-3 sm:p-4">
            <button
              ref={closeBtn}
              type="button"
              onClick={closeProject}
              aria-label="Close case study"
              className="glass grid size-11 place-items-center rounded-full text-paper transition-transform duration-300 hover:rotate-90"
            >
              <X className="size-5" />
            </button>
          </div>
          <motion.div
            key={slug}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.22, duration: 0.8, ease: EASE_OUT } }}
            className="-mt-16"
          >
            <ProjectDetail project={project} variant="modal" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
