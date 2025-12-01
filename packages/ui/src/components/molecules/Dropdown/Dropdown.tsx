'use client';

import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import React from 'react';

import { cn } from '../../../lib/utils';

// =============================================================================
// Dropdown (Root)
// =============================================================================

interface DropdownProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Dropdown({
  children,
  defaultOpen,
  open,
  onOpenChange,
}: DropdownProps) {
  return (
    <DropdownMenuPrimitive.Root
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
    >
      {children}
    </DropdownMenuPrimitive.Root>
  );
}
Dropdown.displayName = 'Dropdown';

// =============================================================================
// DropdownTrigger
// =============================================================================

interface DropdownTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const DropdownTrigger = React.forwardRef<
  HTMLButtonElement,
  DropdownTriggerProps
>(({ className, children, asChild = false, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.Trigger
      ref={ref}
      asChild={asChild}
      data-slot="dropdown-trigger"
      className={cn(
        'inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-hover focus:outline-none',
        'data-[state=open]:bg-hover',
        className,
      )}
      {...props}
    >
      {children}
    </DropdownMenuPrimitive.Trigger>
  );
});

DropdownTrigger.displayName = 'DropdownTrigger';

// =============================================================================
// DropdownContent
// =============================================================================

interface DropdownContentProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content> {
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
}

export const DropdownContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  DropdownContentProps
>(
  (
    {
      className,
      children,
      align = 'end',
      side = 'bottom',
      sideOffset = 8,
      ...props
    },
    ref,
  ) => {
    return (
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          ref={ref}
          align={align}
          side={side}
          sideOffset={sideOffset}
          data-slot="dropdown-content"
          className={cn(
            'z-50 min-w-32 overflow-hidden rounded-lg border border-border bg-popover p-1 shadow-lg',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
            'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            className,
          )}
          {...props}
        >
          {children}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    );
  },
);

DropdownContent.displayName = 'DropdownContent';

// =============================================================================
// DropdownItem
// =============================================================================

interface DropdownItemProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> {
  destructive?: boolean;
}

export const DropdownItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  DropdownItemProps
>(({ className, children, destructive, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.Item
      ref={ref}
      data-slot="dropdown-item"
      className={cn(
        'flex w-full items-center rounded-md px-4 py-2.5 text-sm font-medium text-muted-foreground outline-none transition-colors',
        'hover:bg-hover focus:bg-hover cursor-pointer',
        destructive && 'text-destructive hover:text-destructive',
        className,
      )}
      {...props}
    >
      {children}
    </DropdownMenuPrimitive.Item>
  );
});

DropdownItem.displayName = 'DropdownItem';

// =============================================================================
// DropdownSeparator
// =============================================================================

interface DropdownSeparatorProps
  extends React.ComponentPropsWithoutRef<
    typeof DropdownMenuPrimitive.Separator
  > {}

export const DropdownSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  DropdownSeparatorProps
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    data-slot="dropdown-separator"
    className={cn('my-1 h-px bg-border', className)}
    {...props}
  />
));

DropdownSeparator.displayName = 'DropdownSeparator';
