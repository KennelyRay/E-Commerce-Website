'use client';

import React from 'react';

/*
  Top-down line drawing of a motherboard section. Five traces run at 45 degrees from
  the CPU, memory, M.2, chipset and PCIe slot into one via, the logo's hub. `lit`
  traces turn accent as the sign-in form fills in; when all are lit the via lights.
  The panel is always dark, so colours come from the --panel-* tokens.
*/

// Panel colours come from the logo palette (see --panel-* in globals.css).
const PAPER = 'rgb(var(--panel-ink))';
const ACCENT = 'rgb(var(--panel-accent))';

// Order matters: traces light up in this order.
const TRACES = [
  { id: 'cpu', d: 'M175 250V290L240 355V433', pad: [172, 247] },
  { id: 'ddr5', d: 'M297 284V393L252 438', pad: [294, 281] },
  { id: 'm2', d: 'M100 338V380H170L228 438', pad: [97, 335] },
  { id: 'pch', d: 'M350 380V420L320 450H257', pad: [347, 377] },
  { id: 'pcie', d: 'M120 520V505L175 450H223', pad: [117, 517] },
];

function Label({ x, y, children }: { x: number; y: number; children: React.ReactNode }) {
  return (
    <text x={x} y={y} fill={PAPER} fillOpacity={0.55} fontSize={10} fontFamily="var(--font-mono), monospace">
      {children}
    </text>
  );
}

export function BoardArt({
  lit,
  className = '',
  fit = 'meet',
  viewBox = '0 0 480 640',
}: {
  lit: number;
  className?: string;
  fit?: 'meet' | 'slice';
  /** Crop to part of the board, e.g. around the via for a short banner. */
  viewBox?: string;
}) {
  const complete = lit >= TRACES.length;

  return (
    <svg viewBox={viewBox} className={`board-art ${className}`} fill="none" aria-hidden="true" preserveAspectRatio={`xMidYMid ${fit}`}>
      <defs>
        <pattern id="pins" width="7" height="7" patternUnits="userSpaceOnUse">
          <circle cx="3.5" cy="3.5" r="1.1" fill={PAPER} fillOpacity={0.28} />
        </pattern>
        <pattern id="atx" width="10" height="10" patternUnits="userSpaceOnUse">
          <rect x="2" y="2" width="6" height="6" rx="1" stroke={PAPER} strokeOpacity={0.35} />
        </pattern>
      </defs>

      <g className="board-parts" stroke={PAPER} strokeOpacity={0.4} strokeWidth={1.25}>
        {/* Board edge and mounting holes */}
        <rect x="20" y="20" width="440" height="600" rx="10" strokeOpacity={0.22} />
        {[
          [44, 44],
          [436, 44],
          [44, 596],
          [436, 596],
        ].map(([cx, cy]) => (
          <g key={`${cx}-${cy}`}>
            <circle cx={cx} cy={cy} r="9" strokeOpacity={0.25} />
            <circle cx={cx} cy={cy} r="4" strokeOpacity={0.25} />
          </g>
        ))}

        {/* Power stage chokes */}
        {Array.from({ length: 6 }, (_, index) => (
          <rect key={index} x={100 + index * 26} y="62" width="20" height="20" rx="2" />
        ))}

        {/* CPU socket with pin field and pin-1 marker */}
        <rect x="100" y="100" width="150" height="150" rx="4" strokeOpacity={0.6} />
        <rect x="114" y="114" width="122" height="122" fill="url(#pins)" stroke="none" />
        <path d="M114 114h14l-14 14z" fill={PAPER} fillOpacity={0.5} stroke="none" />
        <rect x="150" y="162" width="50" height="26" rx="2" fill="rgb(var(--panel))" strokeOpacity={0.5} />

        {/* DDR5 slots with key notch */}
        {[292, 308, 324, 340].map((x) => (
          <g key={x}>
            <path d={`M${x} 86V170M${x + 10} 86V170M${x} 176V284M${x + 10} 176V284M${x} 86H${x + 10}M${x} 284H${x + 10}`} />
          </g>
        ))}

        {/* 24-pin ATX header */}
        <rect x="404" y="110" width="30" height="130" rx="3" />
        <rect x="405" y="111" width="28" height="128" fill="url(#atx)" stroke="none" />

        {/* M.2 slot and standoff */}
        <rect x="40" y="318" width="110" height="20" rx="3" />
        <circle cx="162" cy="328" r="5" />

        {/* Chipset */}
        <rect x="320" y="320" width="60" height="60" rx="3" strokeOpacity={0.55} />

        {/* PCIe slots */}
        <rect x="60" y="520" width="360" height="16" rx="3" strokeOpacity={0.55} />
        <path d="M150 520v16" />
        <rect x="60" y="570" width="90" height="12" rx="3" />
      </g>

      <g className="board-labels">
        <Label x={160} y={179}>
          CPU
        </Label>
        <Label x={292} y={78}>
          DDR5
        </Label>
        <Label x={404} y={256}>
          ATX 24P
        </Label>
        <Label x={40} y={310}>
          M.2 NVMe
        </Label>
        <Label x={337} y={354}>
          PCH
        </Label>
        <Label x={300} y={512}>
          PCIe x16
        </Label>
        <Label x={318} y={604}>
          VertixHub rev 1.0
        </Label>
      </g>

      {/* Traces: base line, lit overlay, and a travelling signal */}
      {TRACES.map((trace, index) => {
        const isLit = index < lit;
        return (
          <g key={trace.id}>
            <rect x={trace.pad[0]} y={trace.pad[1]} width="6" height="6" fill={isLit ? ACCENT : PAPER} fillOpacity={isLit ? 1 : 0.5} className="board-pad" />
            <path d={trace.d} pathLength={1} stroke={PAPER} strokeOpacity={0.35} strokeWidth={3} className="board-trace" style={{ animationDelay: `${300 + index * 140}ms` }} />
            <path
              d={trace.d}
              pathLength={1}
              stroke={ACCENT}
              strokeWidth={3}
              className="board-trace-lit"
              style={{ strokeDasharray: 1, strokeDashoffset: isLit ? 0 : 1 }}
            />
            {!isLit && (
              <path d={trace.d} pathLength={1} stroke={PAPER} strokeWidth={3} strokeLinecap="round" className="board-signal" style={{ animationDelay: `${1800 + index * 900}ms` }} />
            )}
          </g>
        );
      })}

      {/* The hub */}
      <circle cx="240" cy="450" r="13" stroke={complete ? ACCENT : PAPER} strokeOpacity={complete ? 1 : 0.55} strokeWidth={8} className="board-via" />
      {complete && <circle cx="240" cy="450" r="13" stroke={ACCENT} strokeWidth={2} className="board-via-ping" />}
    </svg>
  );
}
