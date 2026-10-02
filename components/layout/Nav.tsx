"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { navItems, site } from "@/data/site";
import { bumpInteraction, lockScroll, scrollToId, toast } from "@/lib/store";
import { EASE_OUT, cn } from "@/lib/utils";
import { SystemStatus } from "./SystemStatus";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const clicks = useRef<number[]>([]);

  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  // Compact after the first scroll; tuck away while reading downwards, return on any upward scroll.
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > 640 && y > prev + 4);
    if (y < prev - 4) setHidden(false);
  });

  useEffect(() => {
    const ids = navItems.map((n) => n.id);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const go = (id: string) => {
    setMenuOpen(false);
    lockScroll(false);
    scrollToId(id);
  };

  const onLogo = () => {
    const now = performance.now();
    clicks.current = [...clicks.current.filter((t) => now - t < 1800), now];
    if (clicks.current.length >= 5) {
      clicks.current = [];
      bumpInteraction();
      toast(
        {
          title: "// debug port found",
          body: "Most people scroll. You clicked the logo five times to see what would happen — that's exactly how I approach every system I build.",
          action: { label: "Let's talk →", href: "#contact" },
        },
        8000,
      );
      return;
    }
    go("top");
  };

  const toggleMenu = () => {
    const next = !menuOpen;
    setMenuOpen(next);
    lockScroll(next);
  };

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-[120] flex justify-center px-3 pt-3 sm:px-4 sm:pt-4"
        animate={{ y: hidden && !menuOpen ? "-130%" : "0%" }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
      >
        <nav
          aria-label="Primary"
          className={cn(
            "relative flex w-full max-w-5xl items-center justify-between gap-2 overflow-hidden rounded-full border py-1.5 pl-2 pr-1.5 transition-[background-color,border-color,box-shadow,padding] duration-500",
            scrolled || menuOpen
              ? "glass border-line shadow-[0_10px_40px_-10px_rgba(0,0,0,0.7)]"
              : "border-transparent bg-transparent",
          )}
        >
          <button
            type="button"
            onClick={onLogo}
            aria-label="V — back to top"
            className="group flex h-9 items-center gap-2 rounded-full pl-2 pr-3"
          >
            <span className="display text-2xl leading-none text-paper transition-transform duration-500 group-hover:-rotate-6">
              V<span className="text-signal">.</span>
            </span>
            <span className="label hidden text-mute sm:inline">{site.roles[0]} × Builder</span>
          </button>

          <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
            {navItems.map((item) => (
              <li key={item.id} className="relative">
                <a
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    go(item.id);
                  }}
                  aria-current={active === item.id ? "true" : undefined}
                  className={cn(
                    "relative z-10 block rounded-full px-3.5 py-2 text-sm transition-colors duration-300",
                    active === item.id ? "text-paper" : "text-mute hover:text-paper",
                  )}
                >
                  {item.label}
                </a>
                {active === item.id && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full bg-white/[0.07]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1">
            <SystemStatus />
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                go("contact");
              }}
              className="hidden h-9 items-center gap-1.5 rounded-full bg-paper px-4 text-sm font-medium text-ink transition-colors hover:bg-white sm:flex"
            >
              Let&apos;s talk <ArrowUpRight className="size-3.5" />
            </a>
            <button
              type="button"
              onClick={toggleMenu}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="grid size-9 place-items-center rounded-full text-paper md:hidden"
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>

          <motion.span
            aria-hidden="true"
            className="absolute inset-x-6 bottom-0 h-px origin-left bg-signal/80"
            style={{ scaleX: progress, opacity: scrolled ? 1 : 0 }}
          />
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-[110] flex flex-col justify-end bg-ink/95 px-6 pb-10 pt-28 backdrop-blur-xl md:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
          >
            <ul className="space-y-1">
              {navItems.map((item, i) => (
                <li key={item.id} className="overflow-hidden">
                  <motion.a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      go(item.id);
                    }}
                    className="display flex items-baseline gap-4 py-1 text-6xl text-paper"
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.1 + i * 0.05 }}
                  >
                    <span className="label text-signal">{String(i + 1).padStart(2, "0")}</span>
                    {item.label}
                  </motion.a>
                </li>
              ))}
            </ul>
            <p className="label mt-10 text-mute">{site.roles.join(" × ")}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
