import { Fragment } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getGitHubData } from "@/lib/github";
import { GitHubPanel } from "./GitHubPanel";

export async function GitHub() {
  const data = await getGitHubData();
  return (
    <section id="github" aria-label="Open source and GitHub" className="relative px-5 py-28 sm:px-8 md:py-36">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          index="06"
          label="Open source / GitHub"
          lines={[
            <Fragment key="l1">
              Commits, <span className="serif-accent text-signal">in public.</span>
            </Fragment>,
          ]}
          intro="Pulled from GitHub when the site is built and refreshed daily. Nothing on this panel is typed in by hand."
        />
        <div className="mt-14 md:mt-20">
          <GitHubPanel data={data} />
        </div>
      </div>
    </section>
  );
}
