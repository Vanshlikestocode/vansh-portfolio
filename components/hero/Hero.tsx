import { flagshipProjects } from "@/data/projects";
import { site } from "@/data/site";
import { HeroActions } from "./HeroActions";
import { NeuralField } from "./NeuralField";

/**
 * First screen. The type and the canvas say the same thing: ideas go in on
 * the left, systems come out on the right. Entrance timing is CSS-driven and
 * keyed to the boot screen (see `.rise` / `.appear` in globals.css).
 */
export function Hero() {
  const building = flagshipProjects.filter((p) => p.status === "in-progress");

  return (
    <section id="top" aria-label="Introduction" className="relative isolate min-h-[100svh] overflow-hidden">
      <div className="appear absolute inset-0 -z-10" style={{ "--d": "0.15s" } as React.CSSProperties}>
        <NeuralField />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,transparent_45%,var(--color-ink)_92%)] lg:bg-[linear-gradient(90deg,var(--color-ink)_8%,rgb(8_8_10/0.55)_48%,transparent_70%)]"
      />

      <div className="mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-28 pt-32 sm:px-8 lg:justify-center lg:pb-24">
        <p className="label appear flex items-center gap-3 text-mute" style={{ "--d": "0s" } as React.CSSProperties}>
          <span className="inline-block h-px w-8 bg-signal" />
          Hi, I&apos;m V — {site.name}
        </p>

        <h1 className="display mt-6 text-[clamp(3.6rem,11.6vw,11.25rem)] text-paper">
          <span className="sr-only">{site.name}, AI engineer and product builder: </span>
          <span className="rise-mask">
            <span className="rise">Ideas in.</span>
          </span>
          <span className="rise-mask">
            <span className="rise" style={{ "--d": "0.09s" } as React.CSSProperties}>
              Systems <span className="serif-accent pr-[0.06em] text-signal">out.</span>
            </span>
          </span>
        </h1>

        <p
          className="label appear mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-paper-dim"
          style={{ "--d": "0.3s" } as React.CSSProperties}
        >
          {site.roles.map((role, i) => (
            <span key={role} className="flex items-center gap-3">
              {i > 0 && <span className="text-signal">×</span>}
              {role}
            </span>
          ))}
        </p>

        <p
          className="appear mt-6 max-w-[34rem] text-lg leading-relaxed text-mute sm:text-xl"
          style={{ "--d": "0.4s" } as React.CSSProperties}
        >
          I build AI-powered products, intelligent systems, data applications and full-stack experiences — from
          machine-learning APIs to complete consumer apps.
        </p>

        <div className="appear mt-10" style={{ "--d": "0.5s" } as React.CSSProperties}>
          <HeroActions />
        </div>
      </div>

      <div
        className="appear absolute inset-x-0 bottom-0 mx-auto flex max-w-7xl items-end justify-between px-5 pb-7 sm:px-8"
        style={{ "--d": "0.75s" } as React.CSSProperties}
      >
        <div className="label flex items-center gap-3 text-faint">
          <span className="relative block h-10 w-px overflow-hidden bg-line">
            <span className="absolute inset-0 bg-paper/70 [animation:scroll-cue_2.2s_var(--ease-quint)_infinite]" />
          </span>
          Scroll
        </div>
        <div className="label hidden items-center gap-3 text-mute sm:flex">
          <span className="pulse-dot relative inline-flex size-1.5 rounded-full bg-warn text-warn" />
          Now building
          <span className="text-paper">{building.map((p) => p.name).join(" · ")}</span>
        </div>
      </div>
    </section>
  );
}
