import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal, RevealLines } from "./Reveal";

/**
 * Section opener: a numbered mono label (the "system address" of the section)
 * and a display heading that sets itself line by line.
 */
export function SectionHeading({
  index,
  label,
  lines,
  intro,
  className,
  align = "left",
}: {
  index: string;
  label: string;
  lines: ReactNode[];
  intro?: ReactNode;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <header className={cn("relative", align === "center" && "text-center", className)}>
      <Reveal y={10} className={cn("label flex items-center gap-3 text-mute", align === "center" && "justify-center")}>
        <span className="text-signal">{index}</span>
        <span className="h-px w-8 bg-line-2" />
        <span>{label}</span>
      </Reveal>
      <RevealLines
        lines={lines}
        className="display mt-6 text-[clamp(2.75rem,7.2vw,6.5rem)] text-paper"
      />
      {intro && (
        <Reveal delay={0.15} className={cn("mt-6 max-w-xl text-lg leading-relaxed text-mute", align === "center" && "mx-auto")}>
          {intro}
        </Reveal>
      )}
    </header>
  );
}
