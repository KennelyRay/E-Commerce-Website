import React from 'react';

/**
 * The VertixHub icon: the white-outlined PC case with V and H, on its dark tile.
 * Cut from the master logo (public/brand/vertixhub-logo.png). The tile is kept in
 * both themes because the case's faces share the logo's black background.
 */
export function LogoMark({ size = 28, className = '', title }: { size?: number; className?: string; title?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/vertixhub-icon.png"
      width={size}
      height={size}
      alt={title ?? ''}
      aria-hidden={title ? undefined : true}
      className={`shrink-0 ${className}`}
      draggable={false}
    />
  );
}
