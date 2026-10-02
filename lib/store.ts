"use client";

import type Lenis from "lenis";
import { useSyncExternalStore } from "react";

/* A tiny external store: enough for a handful of global UI states without a library. */
function createStore<T>(initial: T) {
  let value = initial;
  const listeners = new Set<() => void>();
  return {
    get: () => value,
    set: (next: T) => {
      if (Object.is(next, value)) return;
      value = next;
      listeners.forEach((l) => l());
    },
    subscribe: (l: () => void) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
  };
}

/* -------------------------------- Project modal -------------------------------- */

const projectStore = createStore<string | null>(null);

export const useOpenProject = () =>
  useSyncExternalStore(projectStore.subscribe, projectStore.get, () => null);

export function openProject(slug: string) {
  if (projectStore.get() === slug) return;
  if (projectStore.get() === null) {
    window.history.pushState({ project: slug, pushed: true }, "", `#work/${slug}`);
  } else {
    const pushed = Boolean(window.history.state?.pushed);
    window.history.replaceState({ ...window.history.state, project: slug, pushed }, "", `#work/${slug}`);
  }
  projectStore.set(slug);
}

/**
 * Closes the modal. If we pushed its history entry, step back over it (so the
 * browser back button and the close button agree); if the page was opened on
 * a deep link, just drop the hash.
 */
export function closeProject() {
  if (projectStore.get() === null) return;
  if (window.history.state?.pushed) {
    window.history.back();
  } else {
    window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
    projectStore.set(null);
  }
}

export const syncProjectFromHash = () => {
  const match = window.location.hash.match(/^#work\/([\w-]+)$/);
  projectStore.set(match ? match[1] : null);
};

/* ------------------------------------ Toasts ------------------------------------ */

export interface Toast {
  id: number;
  title: string;
  body?: string;
  action?: { label: string; href: string };
}

const toastStore = createStore<Toast[]>([]);
let toastId = 0;

const NO_TOASTS: Toast[] = [];
export const useToasts = () => useSyncExternalStore(toastStore.subscribe, toastStore.get, () => NO_TOASTS);

export function toast(t: Omit<Toast, "id">, ttl = 5200) {
  const id = ++toastId;
  toastStore.set([...toastStore.get(), { ...t, id }].slice(-3));
  window.setTimeout(() => dismissToast(id), ttl);
}

export const dismissToast = (id: number) => toastStore.set(toastStore.get().filter((t) => t.id !== id));

/* ----------------------------------- Scrolling ---------------------------------- */

let lenis: Lenis | null = null;
export const setLenis = (instance: Lenis | null) => {
  lenis = instance;
};

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) {
    // Not on the home page (e.g. a /work/[slug] page): go there instead.
    window.location.assign(id === "top" ? "/" : `/#${id}`);
    return;
  }
  if (lenis) lenis.scrollTo(el, { offset: id === "top" ? 0 : -24, duration: 1.4 });
  else el.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
}

export function lockScroll(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

/* ------------------------------ Interaction signal ------------------------------ */

const interactionStore = createStore(0);
export const useInteractions = () => useSyncExternalStore(interactionStore.subscribe, interactionStore.get, () => 0);
export const bumpInteraction = () => interactionStore.set(interactionStore.get() + 1);
