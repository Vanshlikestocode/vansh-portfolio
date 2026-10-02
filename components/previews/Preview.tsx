"use client";

import dynamic from "next/dynamic";
import type { PreviewKind } from "@/data/projects";
import { QueueLessPreview } from "./QueueLessPreview";
import { SmgPreview } from "./SmgPreview";
import { SrePreview } from "./SrePreview";

// Flagship previews render on the page; the rest load only when a project is opened.
const Skeleton = () => <div className="h-64 w-full animate-pulse rounded-2xl bg-white/[0.03]" />;
const ResumePreview = dynamic(() => import("./ResumePreview").then((m) => m.ResumePreview), { loading: Skeleton });
const TripPreview = dynamic(() => import("./TripPreview").then((m) => m.TripPreview), { loading: Skeleton });
const ChurnPreview = dynamic(() => import("./ChurnPreview").then((m) => m.ChurnPreview), { loading: Skeleton });
const StudentPreview = dynamic(() => import("./StudentPreview").then((m) => m.StudentPreview), { loading: Skeleton });
const SalesPreview = dynamic(() => import("./SalesPreview").then((m) => m.SalesPreview), { loading: Skeleton });
const PortfolioPreview = dynamic(() => import("./PortfolioPreview").then((m) => m.PortfolioPreview), { loading: Skeleton });

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
  }
}
