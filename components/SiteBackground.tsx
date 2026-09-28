'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { BoardLayout, generateBoard } from '@/lib/boardPattern';

/*
  Fixed circuit-board layer behind every page. The board is faint and fades toward
  the centre of the screen so content stays readable; a few violet signals travel
  along the buses at random intervals. Styles and reduced-motion handling live in
  globals.css under .site-bg.
*/

const SIGNAL_PX = 70;
const SPEED_PX_PER_S = 220;

function useViewport() {
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    let timer: number | undefined;
    const read = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    const onResize = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(read, 200);
    };
    read();
    window.addEventListener('resize', onResize);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return size;
}

function pickSignals(board: BoardLayout) {
  // Longest buses carry signals; a few at a time keeps it calm.
  const count = Math.min(7, Math.max(3, Math.round((board.width * board.height) / 260000)));
  const candidates = [...board.buses].sort((a, b) => b.length - a.length).slice(0, count * 2);
  return candidates
    .filter((_, index) => index % 2 === 0)
    .slice(0, count)
    .map((bus, index) => {
      const travel = bus.length / SPEED_PX_PER_S;
      // The signal is moving for 35% of each cycle and idle for the rest.
      const cycle = travel / 0.35;
      return {
        d: bus.d,
        dash: SIGNAL_PX / bus.length,
        duration: cycle,
        delay: -((index * 0.37 + 0.13) % 1) * cycle + index * 1.7,
      };
    });
}

export function SiteBackground() {
  const size = useViewport();
  const board = useMemo(() => (size ? generateBoard(size.width + 40, size.height + 40) : null), [size]);
  const signals = useMemo(() => (board ? pickSignals(board) : []), [board]);

  if (!board) {
    return null;
  }

  return (
    <div className="site-bg" aria-hidden="true">
      <svg width={board.width} height={board.height} className="site-bg-board">
        <g className="site-bg-lines" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round">
          {board.buses.map((bus, index) => (
            <path key={`b${index}`} d={bus.d} />
          ))}
          {board.stubs.map((d, index) => (
            <path key={`s${index}`} d={d} />
          ))}
          {board.chips.map((chip, index) => (
            <g key={`c${index}`}>
              <rect x={chip.x} y={chip.y} width={chip.w} height={chip.h} rx={2} />
              <path d={chip.pins} />
            </g>
          ))}
          {board.vias.map((via, index) => (
            <circle key={`v${index}`} cx={via.x} cy={via.y} r={via.r} />
          ))}
        </g>
        <g className="site-bg-lines" fill="currentColor">
          {board.pads.map((pad, index) => (
            <rect key={`p${index}`} x={pad.x - 3.5} y={pad.y - 3.5} width={7} height={7} />
          ))}
        </g>
        <g className="site-bg-signals" fill="none" strokeWidth={2} strokeLinecap="round">
          {signals.map((signal, index) => (
            <path
              key={`sig${index}`}
              d={signal.d}
              pathLength={1}
              className="site-bg-signal"
              style={
                {
                  strokeDasharray: `${signal.dash} 1`,
                  '--dash': signal.dash,
                  animationDuration: `${signal.duration}s`,
                  animationDelay: `${signal.delay}s`,
                } as React.CSSProperties
              }
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
