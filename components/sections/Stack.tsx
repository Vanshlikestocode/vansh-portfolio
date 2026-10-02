import { Fragment } from "react";
import { StackSystem } from "@/components/stack/StackSystem";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Stack() {
  return (
    <section id="stack" aria-label="Technology stack" className="relative px-5 py-28 sm:px-8 md:py-36">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          index="04"
          label="Stack"
          lines={[
            "The tools,",
            <Fragment key="l1">
              wired <span className="serif-accent text-signal">together.</span>
            </Fragment>,
          ]}
          intro="Hover or tap a technology to see what I use it for and where it shows up. The lines are real: they connect tools that have shipped in the same project."
        />
        <div className="mt-16 md:mt-20">
          <StackSystem />
        </div>
      </div>
    </section>
  );
}
