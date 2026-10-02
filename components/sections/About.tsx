import { Fragment } from "react";
import { ArrowUpRight, GraduationCap } from "lucide-react";
import { Reveal, RevealLines } from "@/components/ui/Reveal";
import { site } from "@/data/site";

export function About() {
  const cert = site.certification;
  const CertTag = cert.url ? "a" : "div";

  return (
    <section id="about" aria-label="About" className="relative px-5 py-28 sm:px-8 md:py-36">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <div>
          <Reveal y={10} className="label flex items-center gap-3 text-mute">
            <span className="text-signal">09</span>
            <span className="h-px w-8 bg-line-2" />
            <span>About</span>
          </Reveal>
          <RevealLines
            lines={[
              <Fragment key="l1">
                I&apos;m <span className="serif-accent text-signal">V.</span>
              </Fragment>,
            ]}
            className="display mt-6 text-[clamp(4rem,12vw,10rem)] text-paper"
          />
          <Reveal delay={0.1} className="label mt-4 text-mute">
            {site.name}
          </Reveal>
        </div>

        <div className="lg:pt-24">
          <Reveal className="space-y-6 text-xl leading-relaxed text-paper-dim sm:text-2xl">
            <p>
              An AI engineering student who likes turning ambitious ideas into working software.
            </p>
            <p className="text-lg text-mute sm:text-xl">
              I work across machine learning, AI systems, full-stack development, data and product engineering —
              usually all in the same project. Some things I build start as experiments; some become products.
              I&apos;m interested in seeing how far each one can go.
            </p>
            <p className="text-lg text-mute sm:text-xl">
              Right now that means a canteen ordering product and an agent that reads production logs so on-call
              engineers don&apos;t have to.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-3 sm:grid-cols-[1.4fr_1fr]">
            <Reveal className="rounded-2xl border border-line bg-ink-2 p-5">
              <p className="label flex items-center gap-2 text-mute">
                <GraduationCap className="size-3.5" /> Education
              </p>
              <p className="mt-4 font-medium text-paper">{site.education.degree}</p>
              <p className="mt-1 text-sm leading-relaxed text-mute">{site.education.school}</p>
              <p className="label mt-4 text-faint">{site.education.period}</p>
            </Reveal>
            <Reveal delay={0.08} className="h-full">
              <CertTag
                {...(cert.url ? { href: cert.url, target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group flex h-full flex-col justify-between rounded-2xl border border-dashed border-line-2 p-5 transition-colors hover:border-paper/30"
              >
                <p className="label text-mute">Certification</p>
                <div className="mt-4">
                  <p className="font-medium text-paper">
                    {cert.issuer} <span className="text-signal">CS50</span>
                  </p>
                  <p className="mt-1 text-sm text-mute">{cert.name}</p>
                  <p className="label mt-3 flex items-center gap-1 text-faint">
                    {cert.year}
                    {cert.url && <ArrowUpRight className="size-3" />}
                  </p>
                </div>
              </CertTag>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
