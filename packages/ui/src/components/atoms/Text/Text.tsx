'use client';

import type { ComponentProps } from 'react';
import { cn } from '../../../lib/utils';

export interface TextProps extends ComponentProps<'p'> {}

export function Text({ className, children, ref, ...props }: TextProps) {
  return (
    <p
      {...props}
      ref={ref}
      data-slot="text"
      className={cn('text-muted-foreground text-base', className)}
    >
      {children}
    </p>
  );
}

Text.displayName = 'Text';
