"use client";

import { useEffect } from "react";
import { bumpInteraction, toast } from "@/lib/store";

const KONAMI = ["arrowup", "arrowup", "arrowdown", "arrowdown", "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a"];

/**
 * Secrets:
 *  1. The Konami code toggles Blueprint mode — the UI shows its construction lines.
 *  2. Typing "sudo" anywhere gets a polite refusal.
 *  3. (Nav) Clicking the V mark five times; (Nav) the system-status light.
 */
export function EasterEggs() {
  useEffect(() => {
    console.log(
      "%cV%c  Hello, fellow inspector of source.\n   Try the Konami code, or click the V a few times.",
      "font: 700 28px system-ui; color: #ff5b1f",
      "font: 12px ui-monospace, monospace; color: #95928b",
    );

    let seq: string[] = [];
    let typed = "";
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof Element && e.target.closest("input, textarea, select, [contenteditable='true']")) return;
      const key = e.key.toLowerCase();

      seq = [...seq, key].slice(-KONAMI.length);
      if (seq.join() === KONAMI.join()) {
        seq = [];
        const root = document.documentElement;
        const on = root.dataset.mode !== "blueprint";
        if (on) root.dataset.mode = "blueprint";
        else delete root.dataset.mode;
        bumpInteraction();
        toast(
          on
            ? { title: "Blueprint mode", body: "The interface now shows its construction lines. Enter the code again to exit." }
            : { title: "Blueprint mode off", body: "Back to the finished build." },
        );
      }

      if (key.length === 1) {
        typed = (typed + key).slice(-8);
        if (typed.endsWith("sudo")) {
          typed = "";
          bumpInteraction();
          toast({
            title: "Permission denied",
            body: "Nice try. Root access is earned — start by saying hello.",
            action: { label: "Open contact →", href: "#contact" },
          });
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return null;
}
