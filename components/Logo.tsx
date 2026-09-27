import React from 'react';

/**
 * The VertixHub mark: two PCB traces routed at 45 degrees from their solder pads
 * into a via, the point where they meet. Vertex plus hub, drawn the way a board is.
 * Traces use currentColor; the via takes the accent.
 * Geometry is shared with app/icon.svg and public/brand/*.svg; change them together.
 */
export function LogoMark({ size = 28, className = '', title }: { size?: number; className?: string; title?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <path d="M5 6V10L11.8 16.8M27 6V10L20.2 16.8" stroke="currentColor" strokeWidth="3.2" />
      <rect x="2.4" y="2" width="5.2" height="4.4" fill="currentColor" />
      <rect x="24.4" y="2" width="5.2" height="4.4" fill="currentColor" />
      <circle cx="16" cy="21" r="4.4" stroke="rgb(var(--accent))" strokeWidth="3.2" />
    </svg>
  );
}
