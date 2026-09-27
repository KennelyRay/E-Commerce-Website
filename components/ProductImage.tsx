'use client';

import React, { useEffect, useState } from 'react';

/** Product photo with a labelled placeholder when the remote image fails to load. */
export function ProductImage({ src, alt, className = '', ...rest }: React.ImgHTMLAttributes<HTMLImageElement> & { src: string }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [src]);

  if (failed) {
    return (
      <span role={alt ? 'img' : undefined} aria-label={alt || undefined} className={`flex items-center justify-center text-center overflow-hidden break-words p-1 font-mono text-[9px] leading-tight text-neutral-500 ${className}`}>
        No image
      </span>
    );
  }

  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} {...rest} />;
}
