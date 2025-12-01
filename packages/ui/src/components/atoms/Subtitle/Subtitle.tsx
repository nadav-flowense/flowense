'use client';

import type { ComponentProps } from 'react';
import { cn } from '../../../lib/utils';

export interface SubtitleProps extends ComponentProps<'h5'> {}

export function Subtitle({
  className,
  children,
  ref,
  ...props
}: SubtitleProps) {
  return (
    <h5
      {...props}
      ref={ref}
      data-slot="subtitle"
      className={cn('text-foreground text-sm', className)}
    >
      {children}
    </h5>
  );
}

Subtitle.displayName = 'Subtitle';
