'use client';

import type { ComponentProps } from 'react';
import { cn } from '../../../lib/utils';

export interface InfoProps extends ComponentProps<'p'> {}

export function Info({ className, children, ref, ...props }: InfoProps) {
  return (
    <p
      {...props}
      ref={ref}
      data-slot="info"
      className={cn('text-muted-foreground font-light text-sm', className)}
    >
      {children}
    </p>
  );
}

Info.displayName = 'Info';
