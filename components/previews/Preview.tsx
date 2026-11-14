"use client";

import dynamic from "next/dynamic";
import type { PreviewKind } from "@/data/projects";
import { QueueLessPreview } from "./QueueLessPreview";
import { SmgPreview } from "./SmgPreview";
import { SrePreview } from "./SrePreview";
import { ProjectGlyph } from "@/components/work/ProjectGlyph";

// Flagship previews render on the page; the rest load only when a project is opened.
const Skeleton = () => <div className="h-64 w-full animate-pulse rounded-2xl bg-white/[0.03]" />;
const ResumePreview = dynamic(() => import("./ResumePreview").then((m) => m.ResumePreview), { loading: Skeleton });
const TripPreview = dynamic(() => import("./TripPreview").then((m) => m.TripPreview), { loading: Skeleton });
const ChurnPreview = dynamic(() => import("./ChurnPreview").then((m) => m.ChurnPreview), { loading: Skeleton });
const StudentPreview = dynamic(() => import("./StudentPreview").then((m) => m.StudentPreview), { loading: Skeleton });
const SalesPreview = dynamic(() => import("./SalesPreview").then((m) => m.SalesPreview), { loading: Skeleton });
const PortfolioPreview = dynamic(() => import("./PortfolioPreview").then((m) => m.PortfolioPreview), { loading: Skeleton });

const accentFor: Record<string, string> = {
  orbit: "#8b7bff",
  craft: "#ffb4a2",
  aircontrol: "#9ae66e",
  algoguard: "#56c2e6",
  finguard: "#f0a0d8",
};

export function Preview({ kind, active }: { kind: PreviewKind; active: boolean }) {
  switch (kind) {
    case "queueless":
      return <QueueLessPreview active={active} />;
    case "smg":
      return <SmgPreview active={active} />;
    case "sre":
      return <SrePreview active={active} />;
    case "resume":
      return <ResumePreview active={active} />;
    case "trip":
      return <TripPreview active={active} />;
    case "churn":
      return <ChurnPreview active={active} />;
    case "student":
      return <StudentPreview active={active} />;
    case "sales":
      return <SalesPreview active={active} />;
    case "portfolio":
      return <PortfolioPreview active={active} />;
    default:
      // Projects without a bespoke preview show their card glyph large; hovering plays it.
      return (
        <div className="group mx-auto aspect-[16/8] w-full max-w-2xl">
          <ProjectGlyph kind={kind} accent={accentFor[kind] ?? "#ecebe6"} />
        </div>
      );
  }
}
