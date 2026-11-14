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
    case "orbit":
      return (
        <svg viewBox="0 0 200 110" className="h-full w-full" aria-hidden="true">
          <ellipse cx="100" cy="55" rx="70" ry="30" fill="none" stroke="rgba(236,235,230,0.18)" />
          <ellipse cx="100" cy="55" rx="44" ry="19" fill="none" stroke="rgba(236,235,230,0.12)" strokeDasharray="3 4" />
          <circle cx="100" cy="55" r="9" fill={accent} fillOpacity="0.85" />
          <circle cx="100" cy="55" r="15" fill="none" stroke={accent} strokeOpacity="0.4" className="origin-center scale-75 opacity-0 transition-all duration-700 group-hover:scale-100 group-hover:opacity-100" style={{ transformBox: "fill-box" }} />
          <g className="origin-[100px_55px] transition-transform duration-[1.4s] group-hover:rotate-[160deg]" style={{ transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }}>
            {[[30, 55], [170, 55], [100, 25]].map(([x, y], i) => (
              <g key={i}>
                <circle cx={x} cy={y} r="4.5" fill="#ff5a4e" />
                <circle cx={x} cy={y} r="4.5" fill="#3ddc97" className="opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ transitionDelay: `${500 + i * 150}ms` }} />
              </g>
            ))}
          </g>
        </svg>
      );
    case "craft":
      return (
        <svg viewBox="0 0 200 110" className="h-full w-full" aria-hidden="true">
          {[18, 34, 52, 70, 86, 70, 52, 34, 18].map((h, i) => (
            <rect
              key={i}
              x={52 + i * 11}
              y={55 - h / 2}
              width="6"
              height={h}
              rx="3"
              fill={accent}
              fillOpacity={0.35 + (i % 3) * 0.2}
              className="origin-center scale-y-[0.15] transition-transform duration-500 group-hover:scale-y-100"
              style={{ transformBox: "fill-box", transitionDelay: `${Math.abs(4 - i) * 70}ms` }}
            />
          ))}
          <text x="100" y="104" textAnchor="middle" fontSize="7" fill="rgba(236,235,230,0.45)" fontFamily="monospace">HEY CRAFT</text>
        </svg>
      );
    case "aircontrol":
      return (
        <svg viewBox="0 0 200 110" className="h-full w-full" aria-hidden="true">
          <rect x="40" y="14" width="120" height="76" rx="6" fill="none" stroke="rgba(236,235,230,0.2)" />
          <circle cx="100" cy="52" r="5" fill={accent} className="transition-transform duration-700 [transform:translateX(-26px)] group-hover:[transform:translateX(-4px)]" style={{ transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }} />
          <circle cx="100" cy="52" r="5" fill={accent} className="transition-transform duration-700 [transform:translateX(26px)] group-hover:[transform:translateX(4px)]" style={{ transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }} />
          <circle cx="100" cy="52" r="16" fill="none" stroke={accent} strokeOpacity="0.6" className="origin-center scale-50 opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100" style={{ transformBox: "fill-box", transitionDelay: "450ms" }} />
          <text x="100" y="104" textAnchor="middle" fontSize="7" fill="rgba(236,235,230,0.45)" fontFamily="monospace">PINCH · CLICK</text>
        </svg>
      );
    case "algoguard":
      return (
        <svg viewBox="0 0 200 110" className="h-full w-full" aria-hidden="true">
          <line x1="24" y1="78" x2="180" y2="78" stroke="#ff5a4e" strokeOpacity="0.7" strokeDasharray="4 4" />
          <text x="180" y="90" textAnchor="end" fontSize="7" fill="rgba(255,90,78,0.8)" fontFamily="monospace">STOP</text>
          <path d="M24 60 L48 44 L66 52 L88 30 L108 42 L126 70 L140 78 L158 78 L180 78" fill="none" stroke="rgba(236,235,230,0.15)" strokeWidth="2" />
          <path d="M24 60 L48 44 L66 52 L88 30 L108 42 L126 70 L140 78 L158 78 L180 78" fill="none" stroke={accent} strokeWidth="2" pathLength="100" strokeDasharray="100" className="[stroke-dashoffset:100] transition-[stroke-dashoffset] duration-[1.2s] group-hover:[stroke-dashoffset:0]" style={{ transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }} />
          <circle cx="140" cy="78" r="5" fill="none" stroke={accent} strokeWidth="2" className="opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ transitionDelay: "900ms" }} />
        </svg>
      );
    case "finguard":
      return (
        <svg viewBox="0 0 200 110" className="h-full w-full" aria-hidden="true">
          <rect x="40" y="14" width="120" height="70" rx="6" fill="rgba(236,235,230,0.04)" stroke="rgba(236,235,230,0.2)" />
          {[[52, 28, 70], [52, 42, 92], [52, 56, 60], [52, 70, 80]].map(([x, y, w], i) => (
            <rect key={i} x={x} y={y} width={w} height="5" rx="2.5" fill={i === 1 ? accent : "rgba(236,235,230,0.25)"} fillOpacity={i === 1 ? 0.25 : 1} className={i === 1 ? "transition-[fill-opacity] duration-500 group-hover:[fill-opacity:0.9]" : undefined} />
          ))}
          {["FRAUD", "HIGH", "CARDS"].map((t, i) => (
            <g key={t} className="translate-y-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100" style={{ transitionDelay: `${300 + i * 120}ms` }}>
              <rect x={46 + i * 38} y="90" width="34" height="13" rx="6.5" fill={i === 0 ? "#ff5a4e" : accent} fillOpacity="0.85" />
              <text x={63 + i * 38} y="99" textAnchor="middle" fontSize="6.5" fill="#08080a" fontFamily="monospace">{t}</text>
            </g>
          ))}
        </svg>
      );
  }
}
