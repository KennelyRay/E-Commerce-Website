'use client';

import React, { useEffect, useRef } from 'react';

type RevealProps = {
  as?: keyof JSX.IntrinsicElements;
  delay?: number;
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>;

/** Fades a block up once when it scrolls into view. See `[data-reveal]` in globals.css. */
export function Reveal({ as = 'div', delay = 0, className, children, style, ...rest }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      node.classList.add('is-visible');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const Component = as as React.ElementType;

  return (
    <Component
      ref={ref}
      data-reveal=""
      className={className}
      style={{ ...style, ['--reveal-delay' as string]: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Component>
  );
}
