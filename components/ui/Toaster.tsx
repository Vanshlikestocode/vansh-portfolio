"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { dismissToast, scrollToId, useToasts } from "@/lib/store";

export function Toaster() {
  const toasts = useToasts();
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-5 z-[250] flex flex-col items-center gap-2 px-4"
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98, transition: { duration: 0.2 } }}
            className="glass pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl p-4 shadow-2xl shadow-black/50"
          >
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-signal" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-paper">{t.title}</p>
              {t.body && <p className="mt-1 text-sm leading-relaxed text-mute">{t.body}</p>}
              {t.action && (
                <button
                  type="button"
                  onClick={() => {
                    scrollToId(t.action!.href.replace("#", ""));
                    dismissToast(t.id);
                  }}
                  className="label link-line mt-3 text-signal"
                >
                  {t.action.label}
                </button>
              )}
            </div>
            <button
              type="button"
              aria-label="Dismiss"
              onClick={() => dismissToast(t.id)}
              className="-m-1 rounded-full p-1 text-mute transition-colors hover:text-paper"
            >
              <X className="size-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
