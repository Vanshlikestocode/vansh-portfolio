import { site } from "@/data/site";
import { BackToTop } from "./BackToTop";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-5 py-12 sm:px-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="display text-5xl text-paper">
            V<span className="text-signal">.</span>
          </p>
          <p className="label mt-3 text-mute">AI Engineer × Product Builder</p>
        </div>
        <div className="flex flex-col gap-2 text-sm text-mute md:items-end">
          <p>Built with curiosity + code.</p>
          <p className="font-mono text-xs text-faint">Next.js · TypeScript · Tailwind CSS · Motion</p>
          <p className="font-mono text-xs text-faint">
            © 2026 {site.name}
            <span className="mx-2 text-line-2">/</span>
            <span title="There are a few secrets on this page.">3 secrets hidden</span>
          </p>
        </div>
        <BackToTop />
      </div>
    </footer>
  );
}
