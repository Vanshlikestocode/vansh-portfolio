"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { Counter } from "@/components/ui/Counter";
import { Reveal } from "@/components/ui/Reveal";
import { experiments } from "@/data/lab";
import { projects } from "@/data/projects";
import { stack } from "@/data/stack";

const QUESTION = "Can this be built better?";

const domains = [
  { name: "AI", line: "Agents and LLMs that reason over real input." },
  { name: "Machine Learning", line: "Models that are evaluated honestly and served." },
  { name: "Full Stack", line: "APIs, databases and the interface on top." },
  { name: "Data", line: "Turning messy datasets into decisions." },
  { name: "Automation", line: "Scripts that remove the repetitive parts." },
  { name: "Product", line: "Shipping things people actually use." },
];

/**
 * The question is read, not shown: each word brightens as the section scrolls
 * through the viewport, so the sentence lands at the reader's own pace.
 */
export function Intro() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = QUESTION.split(" ");

  return (
    <section id="intro" aria-labelledby="intro-title" className="relative px-5 py-32 sm:px-8 md:py-44">
      <div className="mx-auto max-w-7xl">
        <Reveal y={10} className="label flex items-center gap-3 text-mute">
          <span className="text-signal">01</span>
          <span className="h-px w-8 bg-line-2" />
          <span>Identity</span>
        </Reveal>

        <div ref={ref} className="mt-10">
          <Reveal y={16} as="p" className="max-w-xl text-xl text-mute sm:text-2xl">
            Most of my projects start with a simple question:
          </Reveal>
          <h2 id="intro-title" className="display mt-6 max-w-6xl text-[clamp(3rem,9vw,8.5rem)]">
            {words.map((word, i) => (
              <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
                {i === words.length - 1 ? (
                  <span className="serif-accent text-signal">{word}</span>
                ) : (
                  word
                )}
              </Word>
            ))}
          </h2>
        </div>

        <div className="mt-20 grid gap-12 lg:mt-28 lg:grid-cols-[1.1fr_1fr] lg:gap-24">
          <Reveal className="space-y-6 text-lg leading-relaxed text-mute sm:text-xl">
            <p>
              If the answer is yes, I build it — the model, the API, the database and the interface people actually
              touch. I care about the whole path from idea to working product, not just the part that looks good in a screenshot.
            </p>
            <p>
              That&apos;s why my work spans <span className="text-paper">AI</span>,{" "}
              <span className="text-paper">machine learning</span>, <span className="text-paper">full-stack</span>,{" "}
              <span className="text-paper">data</span>, <span className="text-paper">automation</span> and{" "}
              <span className="text-paper">product engineering</span>.
            </p>
          </Reveal>

          <dl className="grid grid-cols-3 gap-px self-start overflow-hidden rounded-2xl border border-line bg-line">
            {[
              { n: projects.length, label: "Projects" },
              { n: experiments.length, label: "Experiments" },
              { n: stack.length, label: "Technologies" },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08} className="bg-ink-2 p-5 sm:p-7">
                <dt className="label text-mute">{s.label}</dt>
                <dd className="display mt-4 text-5xl text-paper sm:text-6xl">
                  <Counter value={s.n} />
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>

        <ul className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {domains.map((d, i) => (
            <Reveal
              as="li"
              key={d.name}
              delay={(i % 3) * 0.07}
              className="group relative bg-ink p-6 transition-colors duration-500 hover:bg-ink-2 sm:p-8"
            >
              <span className="label text-faint transition-colors duration-500 group-hover:text-signal">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-6 text-2xl font-medium tracking-tight text-paper transition-transform duration-500 group-hover:translate-x-1">
                {d.name}
              </p>
              <p className="mt-2 text-mute">{d.line}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Word({
  children,
  progress,
  range,
}: {
  children: React.ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const y = useTransform(progress, range, ["0.12em", "0em"]);
  return (
    <motion.span className="mr-[0.22em] inline-block" style={{ opacity, y }}>
      {children}
    </motion.span>
  );
}
