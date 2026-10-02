"use client";

import { ArrowUpRight } from "lucide-react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { Fragment, useRef } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { journey } from "@/data/journey";
import { openProject } from "@/lib/store";
import { EASE_OUT, cn } from "@/lib/utils";

/**
 * The timeline draws itself as you read it: the rail fills with scroll, its
 * glowing head marks "now reading", and each step lights up as it is reached.
 */
export function Journey() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.6", "end 0.6"] });
  const fill = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  const headTop = useTransform(fill, (v) => `${v * 100}%`);

  return (
    <section id="journey" aria-label="Journey" className="relative px-5 py-28 sm:px-8 md:py-36">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          index="05"
          label="Journey"
          lines={[
            "From first model",
            <Fragment key="l1">
              to shipped <span className="serif-accent text-signal">product.</span>
            </Fragment>,
          ]}
        />

        <div className="relative mt-16 md:mt-24">
          <div aria-hidden="true" className="absolute bottom-0 left-[7px] top-0 w-px bg-line md:left-[calc(28%+7px)]">
            <motion.div className="absolute inset-x-0 top-0 h-full origin-top bg-signal" style={{ scaleY: fill }} />
            <motion.div
              className="absolute left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal shadow-[0_0_20px_4px_rgba(255,91,31,0.55)]"
              style={{ top: headTop }}
            />
          </div>

          <ol ref={ref} className="relative">

          {journey.map((step) => (
            <motion.li
              key={step.title}
              className="relative grid gap-3 pb-16 pl-10 last:pb-0 md:grid-cols-[28%_1fr] md:gap-0 md:pl-0"
              initial="off"
              whileInView="on"
              viewport={{ once: true, margin: "0px 0px -40% 0px" }}
            >
              <motion.div
                className="md:pr-14 md:text-right"
                variants={{ off: { opacity: 0.25 }, on: { opacity: 1, transition: { duration: 0.6 } } }}
              >
                <span className={cn("display text-3xl md:text-5xl", step.future ? "text-faint" : "text-paper")}>
                  {step.date}
                </span>
              </motion.div>

              <motion.span
                aria-hidden="true"
                className={cn(
                  "absolute left-0 top-2 size-[15px] rounded-full border-2 bg-ink md:left-[28%]",
                  step.future && "border-dashed",
                )}
                variants={{
                  off: { borderColor: "rgba(236,235,230,0.2)", scale: 0.8 },
                  on: { borderColor: "rgba(255,91,31,1)", scale: 1, transition: { duration: 0.4 } },
                }}
              />

              <motion.div
                className="md:pl-14"
                variants={{
                  off: { opacity: 0, y: 24 },
                  on: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE_OUT, delay: 0.05 } },
                }}
              >
                <h3 className={cn("text-2xl font-medium tracking-tight sm:text-3xl", step.future ? "text-paper-dim" : "text-paper")}>
                  {step.title}
                </h3>
                <p className="mt-3 max-w-2xl leading-relaxed text-mute">{step.body}</p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {step.tags.map((t) => (
                    <span key={t} className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-paper-dim">
                      {t}
                    </span>
                  ))}
                  {step.project && (
                    <button
                      type="button"
                      onClick={() => openProject(step.project!)}
                      className="label link-line ml-1 inline-flex items-center gap-1 text-signal"
                    >
                      View project <ArrowUpRight className="size-3" />
                    </button>
                  )}
                </div>
              </motion.div>
            </motion.li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
