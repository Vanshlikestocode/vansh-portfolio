import { Fragment } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FeaturedStack } from "@/components/work/FeaturedStack";
import { ProjectIndex } from "@/components/work/ProjectIndex";

export function Work() {
  return (
    <section id="work" aria-label="Work" className="relative px-4 py-28 sm:px-8 md:py-36">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          index="02"
          label="Work"
          lines={[
            "Things I've",
            <Fragment key="l1">
              actually <span className="serif-accent text-signal">built.</span>
            </Fragment>,
          ]}
          intro="Three flagship builds first — a product, a deployed ML platform and an AI agent — then the full index. Open any of them for the architecture and the details."
        />
        <div className="mt-16 md:mt-24">
          <FeaturedStack />
        </div>
        <div className="mt-28 md:mt-40">
          <ProjectIndex />
        </div>
      </div>
    </section>
  );
}
