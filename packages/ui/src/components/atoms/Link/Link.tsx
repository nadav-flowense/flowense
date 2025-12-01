'use client';

import {
  Link as TanStackLink,
  type LinkProps as TanStackLinkProps,
} from '@tanstack/react-router';
import { cn } from '../../../lib/utils';

export interface LinkProps extends Omit<TanStackLinkProps, 'className'> {
  className?: string;
}

export function Link({ className, children, ...props }: LinkProps) {
  return (
    <TanStackLink
      {...props}
      className={cn(
        'text-muted-foreground text-base underline hover:text-foreground transition-colors',
        className,
      )}
    >
      {children}
    </TanStackLink>
  );
}

Link.displayName = 'Link';

export default Link;
