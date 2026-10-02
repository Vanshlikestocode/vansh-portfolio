"use client";

import { MotionConfig } from "motion/react";
import { Backdrop } from "@/components/effects/Backdrop";
import { Cursor } from "@/components/effects/Cursor";
import { EasterEggs } from "@/components/effects/EasterEggs";
import { SmoothScroll } from "@/components/effects/SmoothScroll";
import { Toaster } from "@/components/ui/Toaster";
import { ProjectModalHost } from "@/components/work/ProjectModalHost";
import { EASE_OUT } from "@/lib/utils";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.8, ease: EASE_OUT }}>
      <SmoothScroll />
      <Backdrop />
      {children}
      <ProjectModalHost />
      <Toaster />
      <Cursor />
      <EasterEggs />
    </MotionConfig>
  );
}
