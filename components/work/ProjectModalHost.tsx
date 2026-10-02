"use client";

import { AnimatePresence } from "motion/react";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { lockScroll, syncProjectFromHash, useOpenProject } from "@/lib/store";

const ProjectModal = dynamic(() => import("./ProjectModal").then((m) => m.ProjectModal));

/** Owns the open/closed state of the project modal and keeps it in step with the URL hash. */
export function ProjectModalHost() {
  const slug = useOpenProject();

  useEffect(() => {
    syncProjectFromHash();
    window.addEventListener("popstate", syncProjectFromHash);
    return () => window.removeEventListener("popstate", syncProjectFromHash);
  }, []);

  useEffect(() => {
    if (!slug) return;
    lockScroll(true);
    return () => lockScroll(false);
  }, [slug]);

  return <AnimatePresence>{slug && <ProjectModal key="project-modal" slug={slug} />}</AnimatePresence>;
}
