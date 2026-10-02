"use client";

import { ArrowUp } from "lucide-react";
import { scrollToId } from "@/lib/store";

export function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => scrollToId("top")}
      className="label group flex items-center gap-2 self-start text-mute transition-colors hover:text-paper md:self-end"
    >
      Back to top
      <span className="grid size-8 place-items-center rounded-full border border-line-2 transition-transform duration-500 group-hover:-translate-y-1">
        <ArrowUp className="size-3.5" />
      </span>
    </button>
  );
}
