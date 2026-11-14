"use client";

import { ArrowUpRight } from "lucide-react";
import {
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Preview } from "@/components/previews/Preview";
import { Counter } from "@/components/ui/Counter";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { flagshipProjects, type Project } from "@/data/projects";
import { useFinePointer, useMediaQuery, useReduced } from "@/lib/hooks";
import { bumpInteraction, openProject } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * The three flagship projects as full panels. On large screens they stack:
 * each panel pins while the next slides over it, and the one underneath
 * recedes — the order of the stack is the order of importance.
 */
export function FeaturedStack() {
  const ref = useRef<HTMLDivElement>(null);
  const stacking = useMediaQuery("(min-width: 1024px) and (min-height: 760px)");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const n = flagshipProjects.length;

  return (
    <div ref={ref} className="relative space-y-6 lg:space-y-10">
      {flagshipProjects.map((p, i) => (
        <FeaturedProject
          key={p.slug}
          project={p}
          index={i}
          total={n}
          progress={scrollYProgress}
          stacking={stacking}
        />
      ))}
    </div>
  );
}

function FeaturedProject({
  project,
  index,
  total,
  progress,
  stacking,
}: {
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
  stacking: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduced = useReduced();
  const inView = useInView(ref, { amount: 0.35 });
  const [hover, setHover] = useState(false);

  // QueueLess runs its order flow on hover (the brief), everything else plays in view.
  const active = project.preview === "queueless" ? (fine ? hover : inView) : inView;

  const target = 1 - (total - 1 - index) * 0.05;
  const scale = useTransform(progress, [index / total, 1], [1, stacking ? target : 1]);
  const dim = useTransform(progress, [index / total, 1], [0, stacking ? (total - 1 - index) * 0.22 : 0]);

  // Pointer tilt on the visual, spotlight on the panel.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rx = useSpring(useTransform(py, [-0.5, 0.5], [5, -5]), { stiffness: 150, damping: 20 });
  const ry = useSpring(useTransform(px, [-0.5, 0.5], [-7, 7]), { stiffness: 150, damping: 20 });
  const sx = useMotionValue(50);
  const sy = useMotionValue(30);
  const glow = useMotionTemplate`radial-gradient(700px circle at ${sx}% ${sy}%, color-mix(in oklab, ${project.accent} 13%, transparent), transparent 60%)`;

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    sx.set(x * 100);
    sy.set(y * 100);
    if (fine && !reduced) {
      px.set(x - 0.5);
      py.set(y - 0.5);
    }
  };
  const onLeave = () => {
    setHover(false);
    px.set(0);
    py.set(0);
  };

  const open = () => {
    bumpInteraction();
    openProject(project.slug);
  };

  // Pin each panel only once its whole height is on screen, so the next panel
  // never covers content (buttons, tags) that the reader hasn't reached yet.
  const [stickyTop, setStickyTop] = useState(88 + index * 18);
  useEffect(() => {
    const el = ref.current;
    if (!el || !stacking) return;
    const update = () => setStickyTop(Math.min(88 + index * 18, window.innerHeight - el.offsetHeight - 24));
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [stacking, index]);

  const reversed = index % 2 === 1;
  const isPhone = project.preview === "queueless";

  return (
    <article
      ref={ref}
      aria-labelledby={`featured-${project.slug}`}
      className={cn(stacking && "sticky")}
      style={stacking ? { top: stickyTop } : undefined}
    >
      <motion.div
        style={{ scale, transformOrigin: "50% 0%" }}
        onPointerMove={onMove}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={onLeave}
        onClick={(e) => {
          if ((e.target as Element).closest("a, button")) return;
          open();
        }}
        data-cursor="project"
        className="group relative overflow-hidden rounded-[28px] border border-line bg-ink-2 shadow-[0_-20px_80px_-30px_rgba(0,0,0,0.9)]"
      >
        <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: glow }} />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.5] [background-image:linear-gradient(to_right,rgb(236_235_230/0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgb(236_235_230/0.03)_1px,transparent_1px)] [background-size:36px_36px]"
        />

        <div
          className={cn(
            "relative grid gap-10 p-6 sm:p-10 lg:min-h-[600px] lg:items-center lg:gap-12 lg:p-12",
            isPhone ? "lg:grid-cols-[1fr_1.05fr]" : "lg:grid-cols-[0.85fr_1.15fr]",
          )}
        >
          <div className={cn("flex flex-col", reversed && "lg:order-2")}>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="label text-faint">
                {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </span>
              <StatusBadge status={project.status} />
              <span className="label" style={{ color: project.accent }}>
                {project.category}
              </span>
            </div>
            <h3 id={`featured-${project.slug}`} className="display mt-6 text-[clamp(3rem,6.4vw,5.75rem)] text-paper">
              {project.name}
            </h3>
            <p className="mt-3 text-lg text-paper-dim">{project.subtitle}</p>
            <p className="mt-5 max-w-xl leading-relaxed text-mute">{project.description}</p>

            {project.metrics && (
              <dl className="mt-8 grid max-w-lg grid-cols-3 gap-5">
                {project.metrics.slice(0, 3).map((m) => (
                  <div key={m.label} className="flex flex-col-reverse justify-end">
                    <dt className="label mt-2 leading-snug text-mute">{m.label}</dt>
                    <dd className="display text-4xl text-paper">
                      <Counter value={m.value} decimals={m.decimals} prefix={m.prefix} suffix={m.suffix} />
                    </dd>
                  </div>
                ))}
              </dl>
            )}
            {project.disclaimer && (
              <p className="mt-4 max-w-md text-xs leading-relaxed text-faint">
                Reported on a public, imbalanced dataset — not real-world performance. Details in the case study.
              </p>
            )}

            <ul className="mt-8 flex flex-wrap gap-1.5">
              {project.technologies.slice(0, 6).map((t) => (
                <li key={t} className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-paper-dim">
                  {t}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={open}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-paper px-5 text-sm font-medium text-ink transition-colors hover:bg-white"
              >
                Open case study
                <ArrowUpRight className="size-4" />
              </button>
              {project.links.demo && (
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="link"
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-line-2 px-5 text-sm text-paper transition-colors hover:border-paper/40"
                >
                  Live {project.preview === "queueless" ? "web app" : "app"} <ArrowUpRight className="size-4" />
                </a>
              )}
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="link"
                  className="inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm text-mute transition-colors hover:text-paper"
                >
                  GitHub <ArrowUpRight className="size-4" />
                </a>
              )}
            </div>
          </div>

          <div className={cn("relative [perspective:1400px]", reversed && "lg:order-1")}>
            <motion.div style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }} className="relative">
              <div className={cn(isPhone && "pb-8")}>
                {project.preview && <Preview kind={project.preview} active={active} />}
              </div>
              {isPhone && fine && (
                <p className="label pointer-events-none absolute inset-x-0 -bottom-1 text-center text-faint transition-opacity duration-500 group-hover:opacity-0">
                  Hover to run the order flow
                </p>
              )}
            </motion.div>
          </div>
        </div>

        <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-ink" style={{ opacity: dim }} />
      </motion.div>
    </article>
  );
}
