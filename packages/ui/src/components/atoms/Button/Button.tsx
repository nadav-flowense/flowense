'use client';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { LoaderCircle, type LucideIcon } from 'lucide-react';
import * as React from 'react';
import type { ReactNode } from 'react';
import { cn } from '../../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none rounded-lg',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary-hover',
        primary:
          'bg-primary text-primary-foreground hover:bg-primary-hover',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary-hover',
        outline:
          'border border-border bg-background text-foreground hover:bg-hover',
        ghost:
          'text-muted-foreground hover:bg-hover hover:text-foreground',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive-hover',
        social:
          'bg-card border border-border text-foreground hover:bg-secondary font-normal',
        dark:
          'bg-primary text-primary-foreground hover:bg-primary-hover font-semibold',
        success:
          'bg-success text-success-foreground hover:bg-success-hover',
        link:
          'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        xs: 'h-8 px-2 py-1 text-xs gap-1',
        sm: 'h-9 px-3 py-2.5 text-[15px] gap-2',
        md: 'h-10 px-4 py-2.5 text-base gap-2',
        lg: 'h-11 px-6 py-3 text-lg gap-3',
        xl: 'h-12 px-8 py-4 text-xl gap-4',
        social: 'px-4 py-2.5 text-lg gap-4',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  icon?: LucideIcon | ReactNode;
  loading?: boolean;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      icon: Icon,
      loading = false,
      asChild = false,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';

    const isLucideIcon = Icon && typeof Icon === 'function';
    const iconElement =
      Icon && !loading ? (
        isLucideIcon ? (
          <Icon className="h-4 w-4 shrink-0" />
        ) : (
          Icon
        )
      ) : null;

    // When using asChild, we don't render the icon/loading directly
    if (asChild) {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          disabled={disabled || loading}
          {...props}
        >
          {children}
        </Comp>
      );
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
        {iconElement}
        {children}
      </Comp>
    );
  },
);

Button.displayName = 'Button';

export { Button, buttonVariants };
