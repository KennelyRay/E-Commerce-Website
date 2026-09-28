'use client';

import React, { useEffect, useState } from 'react';

/**
 * Product photo with a labelled placeholder when there is no photo yet or the image
 * fails to load. The label scales with the box: tiny thumbnails show a short word.
 */
export function ProductImage({ src, alt, className = '', ...rest }: React.ImgHTMLAttributes<HTMLImageElement> & { src: string }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [src]);

  if (!src || failed) {
    return (
      <span
        role={alt ? 'img' : undefined}
        aria-label={alt ? `${alt} (photo coming soon)` : undefined}
        className={`flex items-center justify-center overflow-hidden p-1 text-center font-mono text-[10px] leading-tight text-neutral-500 [container-type:inline-size] ${className}`}
      >
        <span className="hidden [@container(min-width:90px)]:inline">Photo coming soon</span>
        <span className="[@container(min-width:90px)]:hidden">No photo</span>
      </span>
    );
  }

  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} {...rest} />;
}
