"use client";

import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Magnetic } from "@/components/ui/Magnetic";
import { site } from "@/data/site";
import { scrollToId } from "@/lib/store";

export function HeroActions() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Magnetic
        href="#work"
        variant="primary"
        onClick={(e) => {
          e.preventDefault();
          scrollToId("work");
        }}
      >
        Explore my work
        <ArrowDown className="size-4 transition-transform duration-500 group-hover/mag:translate-y-0.5" />
      </Magnetic>
      {site.links.github && (
        <Magnetic href={site.links.github} external variant="outline">
          GitHub
          <ArrowUpRight className="size-4 transition-transform duration-500 group-hover/mag:-translate-y-0.5 group-hover/mag:translate-x-0.5" />
        </Magnetic>
      )}
    </div>
  );
}
