/**
 * The boot screen. Pure HTML + CSS (see `.boot` in globals.css): it plays for
 * ~1.7s on a first visit, never waits on JavaScript, and is skipped entirely
 * for returning visitors and reduced-motion users.
 */
export function Boot() {
  return (
    <div className="boot" aria-hidden="true">
      <div className="flex w-[min(78vw,320px)] flex-col items-center">
        <div className="boot-v text-paper">
          V<span className="text-signal">.</span>
        </div>
        <div className="label mt-6 flex w-full items-center justify-between text-mute">
          <span>
            Initializing system<span className="boot-cursor">_</span>
          </span>
          <span className="flex gap-3 text-paper">
            {["01", "02", "03"].map((n, i) => (
              <span key={n} className="boot-step" style={{ animationDelay: `${0.15 + i * 0.25}s` }}>
                {n}
              </span>
            ))}
          </span>
        </div>
        <div className="mt-3 h-px w-full bg-line">
          <div className="boot-bar h-px w-full bg-signal" />
        </div>
      </div>
    </div>
  );
}
