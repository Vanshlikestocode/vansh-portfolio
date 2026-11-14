import type { ProjectStatus } from "@/data/projects";
import { cn } from "@/lib/utils";

const config: Record<ProjectStatus, { label: string; color: string }> = {
  live: { label: "Live", color: "text-live" },
  built: { label: "Built", color: "text-paper-dim" },
  "in-progress": { label: "Building", color: "text-warn" },
  experiment: { label: "Experiment", color: "text-mute" },
};

function Glyph({ status }: { status: ProjectStatus }) {
  if (status === "live")
    return <span className="pulse-dot inline-block size-1.5 rounded-full bg-current" />;
  if (status === "built") return <span className="inline-block size-1.5 rounded-full bg-current" />;
  if (status === "in-progress")
    return (
      <span className="relative inline-block size-2 overflow-hidden rounded-full border border-current">
        <span className="absolute inset-y-0 left-0 w-1/2 bg-current" />
      </span>
    );
  return <span className="inline-block size-2 rounded-full border border-current" />;
}

/** ● LIVE · ● BUILT · ◐ BUILDING · ○ EXPERIMENT */
export function StatusBadge({ status, className }: { status: ProjectStatus; className?: string }) {
  const c = config[status];
  return (
    <span className={cn("label inline-flex items-center gap-2", c.color, className)}>
      <Glyph status={status} />
      {c.label}
    </span>
  );
}
