'use client';

import type { ComponentProps } from 'react';
import { cn } from '../../../lib/utils';

export interface HeadingProps extends ComponentProps<'h2'> {}

export function Heading({ className, children, ref, ...props }: HeadingProps) {
  return (
    <h2
      {...props}
      ref={ref}
      data-slot="heading"
      className={cn('text-foreground text-2xl font-semibold', className)}
    >
      {children}
    </h2>
  );
}

Heading.displayName = 'Heading';
