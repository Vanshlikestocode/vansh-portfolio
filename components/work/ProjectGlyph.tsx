import type { PreviewKind } from "@/data/projects";
import { r2 } from "@/lib/utils";

/**
 * Small, project-specific marks for the index cards. Each one hints at what
 * the project does and comes alive on hover (pure CSS via `group-hover`).
 */
export function ProjectGlyph({ kind, accent }: { kind: PreviewKind; accent: string }) {
  const s = { stroke: accent };
  switch (kind) {
    case "queueless":
      return (
        <svg viewBox="0 0 200 110" className="h-full w-full" aria-hidden="true">
          <rect x="74" y="8" width="52" height="94" rx="10" fill="none" stroke="rgba(236,235,230,0.25)" />
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <circle
                cx="100"
                cy={26 + i * 20}
                r="4"
                fill={accent}
                className="opacity-25 transition-opacity duration-300 group-hover:opacity-100"
                style={{ transitionDelay: `${i * 120}ms` }}
              />
              {i < 3 && <line x1="100" y1={31 + i * 20} x2="100" y2={41 + i * 20} {...s} strokeOpacity="0.4" />}
            </g>
          ))}
          <text x="134" y="29" fontSize="7" fill="rgba(236,235,230,0.45)" fontFamily="monospace">PLACED</text>
          <text x="134" y="89" fontSize="7" fill="rgba(236,235,230,0.45)" fontFamily="monospace">COLLECTED</text>
        </svg>
      );
    case "smg":
      return (
        <svg viewBox="0 0 200 110" className="h-full w-full" aria-hidden="true">
          <path d="M50 92 A50 50 0 0 1 150 92" fill="none" stroke="rgba(236,235,230,0.15)" strokeWidth="8" strokeLinecap="round" />
          <path d="M50 92 A50 50 0 0 1 150 92" fill="none" stroke={accent} strokeWidth="8" strokeLinecap="round" strokeDasharray="157" className="[stroke-dashoffset:110] transition-[stroke-dashoffset] duration-1000 group-hover:[stroke-dashoffset:20]" style={{ transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }} />
          <g className="origin-[100px_92px] -rotate-[60deg] transition-transform duration-1000 group-hover:rotate-[55deg]" style={{ transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }}>
            <line x1="100" y1="92" x2="100" y2="52" stroke="#ecebe6" strokeWidth="2" strokeLinecap="round" />
          </g>
          <circle cx="100" cy="92" r="4" fill="#ecebe6" />
        </svg>
      );
    case "sre":
      return (
        <svg viewBox="0 0 200 110" className="h-full w-full font-mono" aria-hidden="true">
          {["API", "DATABASE", "CACHE", "WORKER"].map((n, i) => (
            <g key={n}>
              <text x="52" y={28 + i * 20} fontSize="8" fill="rgba(236,235,230,0.55)">{n}</text>
              <circle cx="146" cy={25 + i * 20} r="3.5" fill="#3ddc97" />
              {(i === 0 || i === 2) && (
                <circle
                  cx="146"
                  cy={25 + i * 20}
                  r="3.5"
                  fill={i === 2 ? "#ff5a4e" : accent}
                  className="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ transitionDelay: i === 2 ? "0ms" : "250ms" }}
                />
              )}
            </g>
          ))}
        </svg>
      );
    case "resume":
      return (
        <svg viewBox="0 0 200 110" className="h-full w-full" aria-hidden="true">
          <rect x="66" y="8" width="68" height="94" rx="4" fill="rgba(236,235,230,0.06)" stroke="rgba(236,235,230,0.2)" />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <rect key={i} x="76" y={20 + i * 11} width={[48, 30, 44, 36, 48, 26, 40][i]} height="3" rx="1.5" fill={i % 2 ? accent : "rgba(236,235,230,0.3)"} fillOpacity={i % 2 ? 0.8 : 1} />
          ))}
          <rect x="66" y="8" width="68" height="12" fill={accent} fillOpacity="0.25" className="transition-transform duration-1000 group-hover:translate-y-[80px]" style={{ transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }} />
        </svg>
      );
    case "trip":
      return (
        <svg viewBox="0 0 200 110" className="h-full w-full" aria-hidden="true">
          <path d="M30 80 C 60 20, 90 100, 120 50 S 170 30, 175 30" fill="none" stroke={accent} strokeWidth="2" strokeDasharray="4 5" pathLength="100" className="[stroke-dashoffset:0] transition-[stroke-dashoffset] duration-1000 group-hover:[stroke-dashoffset:-40]" />
          {[
            [30, 80],
            [120, 50],
            [175, 30],
          ].map(([x, y], i) => (
            <g key={i} className="transition-transform duration-500 group-hover:-translate-y-1" style={{ transitionDelay: `${i * 100}ms` }}>
              <circle cx={x} cy={y} r="5" fill={accent} />
              <circle cx={x} cy={y} r="2" fill="#08080a" />
            </g>
          ))}
        </svg>
      );
    case "churn":
      return (
        <svg viewBox="0 0 200 110" className="h-full w-full" aria-hidden="true">
          <path d="M20 92 C 80 92, 90 18, 180 18" fill="none" stroke="rgba(236,235,230,0.3)" strokeWidth="1.5" />
          <circle r="5" fill={accent} className="transition-transform duration-1000 [transform:translate(60px,86px)] group-hover:[transform:translate(140px,24px)]" style={{ transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }} />
          <line x1="20" y1="55" x2="180" y2="55" stroke="rgba(236,235,230,0.15)" strokeDasharray="3 4" />
        </svg>
      );
    case "student":
      return (
        <svg viewBox="0 0 200 110" className="h-full w-full" aria-hidden="true">
          {Array.from({ length: 25 }, (_, i) => {
            const x = i % 5;
            const y = Math.floor(i / 5);
            const v = [0.2, 0.5, 0.9, 0.35, 0.7, 0.45, 0.15, 0.6, 0.8, 0.3][i % 10];
            return (
              <rect
                key={i}
                x={62 + x * 16}
                y={10 + y * 18}
                width="14"
                height="16"
                rx="2"
                fill={accent}
                fillOpacity={v * 0.6}
                className="transition-[fill-opacity] duration-500 group-hover:[fill-opacity:var(--h)]"
                style={{ ["--h" as string]: String(1 - v * 0.7), transitionDelay: `${(x + y) * 40}ms` }}
              />
            );
          })}
        </svg>
      );
    case "sales":
      return (
        <svg viewBox="0 0 200 110" className="h-full w-full" aria-hidden="true">
          {[34, 48, 40, 62, 56, 74, 88].map((h, i) => (
            <rect
              key={i}
              x={40 + i * 18}
              y={100 - h}
              width="12"
              height={h}
              rx="2"
              fill={accent}
              fillOpacity="0.55"
              className="origin-bottom scale-y-[0.55] transition-transform duration-700 group-hover:scale-y-100"
              style={{ transformBox: "fill-box", transitionDelay: `${i * 50}ms` }}
            />
          ))}
        </svg>
      );
    case "portfolio":
      return (
        <svg viewBox="0 0 200 110" className="h-full w-full" aria-hidden="true">
          <g className="origin-center transition-transform duration-[1.6s] group-hover:rotate-90" style={{ transformBox: "fill-box" }}>
            {Array.from({ length: 36 }, (_, i) => {
              const a = (i / 36) * Math.PI * 2;
              const r = 34 + (i % 3) * 6;
              return <circle key={i} cx={r2(100 + Math.cos(a) * r)} cy={r2(55 + Math.sin(a) * r * 0.9)} r="1.6" fill={accent} opacity={0.3 + (i % 4) * 0.18} />;
            })}
          </g>
        </svg>
      );
  }
}
