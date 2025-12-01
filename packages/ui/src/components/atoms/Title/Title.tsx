'use client';

import type { ComponentProps } from 'react';
import { cn } from '../../../lib/utils';

export interface TitleProps extends ComponentProps<'h4'> {}

export function Title({ className, children, ref, ...props }: TitleProps) {
  return (
    <h4
      {...props}
      ref={ref}
      data-slot="title"
      className={cn('text-foreground text-[15px] font-medium', className)}
    >
      {children}
    </h4>
  );
}

Title.displayName = 'Title';
