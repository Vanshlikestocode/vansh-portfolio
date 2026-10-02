"use client";

import { ArrowUpRight, Check, Copy, Mail } from "lucide-react";
import { useRef, useState } from "react";
import { Magnetic } from "@/components/ui/Magnetic";
import { Reveal, RevealLines } from "@/components/ui/Reveal";
import { site } from "@/data/site";
import { usePauseOffscreen } from "@/lib/hooks";
import { bumpInteraction, toast } from "@/lib/store";

/**
 * The end of the system: the page's grid tilts into a floor that runs toward
 * a vanishing point, and the copy narrows to a single invitation.
 */
export function Contact() {
  const ref = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  usePauseOffscreen(ref);
  const { github, linkedin, email, resume } = site.links;

  const copy = async () => {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      bumpInteraction();
      toast({ title: "Email copied", body: email });
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <section
      ref={ref}
      id="contact"
      aria-label="Contact"
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden px-5 py-32 sm:px-8"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[40%] [perspective:420px]">
        <div className="absolute -left-1/2 bottom-[-30%] h-[160%] w-[200%] origin-bottom overflow-hidden [transform:rotateX(68deg)] [mask-image:linear-gradient(to_top,#000_25%,transparent_90%)]">
          {/* The floor runs toward the viewer by translating one grid cell per loop — compositor-only. */}
          <div
            className="absolute inset-x-0 -top-[72px] bottom-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgb(236 235 230 / 0.16) 1px, transparent 1px), linear-gradient(to bottom, rgb(236 235 230 / 0.16) 1px, transparent 1px)",
              backgroundSize: "72px 72px",
              animation: "floor-run 2.6s linear infinite",
              willChange: "transform",
            }}
          />
        </div>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-signal/60 to-transparent" />
        <div className="absolute left-1/2 top-0 h-40 w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-signal/10 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-7xl text-center">
        <Reveal y={10} className="label flex items-center justify-center gap-3 text-mute">
          <span className="text-signal">10</span>
          <span className="h-px w-8 bg-line-2" />
          <span>Contact</span>
        </Reveal>

        <RevealLines
          as="h2"
          lines={["Have an idea", "worth building?"]}
          className="display mx-auto mt-8 text-[clamp(3.2rem,10.5vw,10rem)] text-paper"
        />
        <Reveal delay={0.25} className="serif-accent mt-4 text-[clamp(2.4rem,6vw,5.5rem)] leading-none text-signal">
          Let&apos;s build it.
        </Reveal>

        <Reveal delay={0.35} className="mt-14 flex flex-wrap items-center justify-center gap-3">
          {email && (
            <Magnetic href={`mailto:${email}`} variant="primary">
              <Mail className="size-4" /> Email me
            </Magnetic>
          )}
          {github && (
            <Magnetic href={github} external>
              GitHub <ArrowUpRight className="size-4" />
            </Magnetic>
          )}
          {linkedin && (
            <Magnetic href={linkedin} external>
              LinkedIn <ArrowUpRight className="size-4" />
            </Magnetic>
          )}
          {resume && (
            <Magnetic href={resume} external>
              Résumé <ArrowUpRight className="size-4" />
            </Magnetic>
          )}
        </Reveal>

        {email && (
          <Reveal delay={0.45} className="mt-6">
            <button
              type="button"
              onClick={copy}
              className="group inline-flex items-center gap-2 font-mono text-sm text-mute transition-colors hover:text-paper"
            >
              {email}
              {copied ? <Check className="size-3.5 text-live" /> : <Copy className="size-3.5 opacity-60 group-hover:opacity-100" />}
              <span className="sr-only">{copied ? "Copied" : "Copy email address"}</span>
            </button>
          </Reveal>
        )}

        <Reveal delay={0.55} className="mt-20 font-mono text-xs text-faint">
          <span className="text-signal">&gt;</span> session.end() <span className="text-mute">— thanks for exploring the workshop</span>
          <span className="boot-cursor ml-1 text-paper">▍</span>
        </Reveal>
      </div>
    </section>
  );
}
