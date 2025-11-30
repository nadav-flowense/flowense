import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';

import { cn } from '#/lib/utils';

const SIDEBAR_COOKIE_NAME = 'sidebar:width';
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_DEFAULT_WIDTH = 240;
const SIDEBAR_MIN_WIDTH = 60;
const SIDEBAR_MAX_WIDTH = 400;
const SIDEBAR_ICON_MODE_THRESHOLD = 120;

type SidebarContext = {
  width: number;
  setWidth: (width: number) => void;
  isIconMode: boolean;
  isResizing: boolean;
  setIsResizing: (isResizing: boolean) => void;
};

const SidebarContext = React.createContext<SidebarContext | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.');
  }
  return context;
}

interface SidebarProviderProps extends React.ComponentProps<'div'> {
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  iconModeThreshold?: number;
}

const SidebarProvider = React.forwardRef<HTMLDivElement, SidebarProviderProps>(
  (
    {
      defaultWidth = SIDEBAR_DEFAULT_WIDTH,
      minWidth = SIDEBAR_MIN_WIDTH,
      maxWidth = SIDEBAR_MAX_WIDTH,
      iconModeThreshold = SIDEBAR_ICON_MODE_THRESHOLD,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const [width, setWidthState] = React.useState(defaultWidth);
    const [isResizing, setIsResizing] = React.useState(false);

    const isIconMode = width < iconModeThreshold;

    const setWidth = React.useCallback(
      (newWidth: number) => {
        const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
        setWidthState(clampedWidth);
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${clampedWidth}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
      },
      [minWidth, maxWidth],
    );

    const handleMouseMove = React.useCallback(
      (e: MouseEvent) => {
        if (!isResizing) return;
        const newWidth = e.clientX;
        if (newWidth >= minWidth && newWidth <= maxWidth) {
          setWidthState(newWidth);
        }
      },
      [isResizing, minWidth, maxWidth],
    );

    const handleMouseUp = React.useCallback(() => {
      setIsResizing(false);
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${width}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    }, [width]);

    React.useEffect(() => {
      if (isResizing) {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
      } else {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }, [isResizing, handleMouseMove, handleMouseUp]);

    const contextValue = React.useMemo<SidebarContext>(
      () => ({
        width,
        setWidth,
        isIconMode,
        isResizing,
        setIsResizing,
      }),
      [width, setWidth, isIconMode, isResizing],
    );

    return (
      <SidebarContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn('flex h-screen bg-background', className)}
          {...props}
        >
          {children}
        </div>
      </SidebarContext.Provider>
    );
  },
);
SidebarProvider.displayName = 'SidebarProvider';

const Sidebar = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  ({ className, children, ...props }, ref) => {
    const { width, isResizing, setIsResizing } = useSidebar();

    const handleMouseDown = (e: React.MouseEvent) => {
      setIsResizing(true);
      e.preventDefault();
    };

    return (
      <div
        ref={ref}
        style={{ width: `${width}px` }}
        className={cn(
          'relative flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border',
          !isResizing && 'transition-[width] duration-200',
          className,
        )}
        {...props}
      >
        {children}
        <button
          type="button"
          onMouseDown={handleMouseDown}
          className={cn(
            'absolute top-0 right-0 w-1 h-full cursor-col-resize group hover:bg-primary/50 transition-colors',
            isResizing ? 'bg-primary' : 'bg-transparent',
          )}
          aria-label="Resize sidebar"
        >
          <div className="absolute -right-2 top-0 w-4 h-full" />
        </button>
      </div>
    );
  },
);
Sidebar.displayName = 'Sidebar';

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex flex-col gap-2 p-2', className)}
      {...props}
    />
  );
});
SidebarHeader.displayName = 'SidebarHeader';

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex flex-col gap-2 p-2 mt-auto', className)}
      {...props}
    />
  );
});
SidebarFooter.displayName = 'SidebarFooter';

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex-1 overflow-y-auto py-2', className)}
      {...props}
    />
  );
});
SidebarContent.displayName = 'SidebarContent';

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex w-full min-w-0 flex-col px-2', className)}
      {...props}
    />
  );
});
SidebarGroup.displayName = 'SidebarGroup';

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'div';
  const { isIconMode } = useSidebar();

  if (isIconMode) return null;

  return (
    <Comp
      ref={ref}
      className={cn(
        'flex h-8 shrink-0 items-center px-2 text-xs font-medium text-sidebar-foreground/70',
        className,
      )}
      {...props}
    />
  );
});
SidebarGroupLabel.displayName = 'SidebarGroupLabel';

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('w-full text-sm', className)} {...props} />
));
SidebarGroupContent.displayName = 'SidebarGroupContent';

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn('flex w-full min-w-0 flex-col gap-1', className)}
    {...props}
  />
));
SidebarMenu.displayName = 'SidebarMenu';

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('relative', className)} {...props} />
));
SidebarMenuItem.displayName = 'SidebarMenuItem';

interface SidebarMenuButtonProps extends React.ComponentProps<'button'> {
  asChild?: boolean;
  isActive?: boolean;
  size?: 'default' | 'sm' | 'lg';
}

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(
  (
    {
      asChild = false,
      isActive = false,
      size = 'default',
      className,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';
    const { isIconMode } = useSidebar();

    return (
      <Comp
        ref={ref}
        data-active={isActive}
        className={cn(
          'flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-none transition-colors',
          'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
          'focus-visible:ring-2 focus-visible:ring-sidebar-ring',
          'data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground',
          isIconMode && 'justify-center',
          size === 'default' && 'h-9 text-sm',
          size === 'sm' && 'h-8 text-xs',
          size === 'lg' && 'h-12 text-sm',
          className,
        )}
        {...props}
      />
    );
  },
);
SidebarMenuButton.displayName = 'SidebarMenuButton';

const SidebarMenuButtonIcon = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<'span'>
>(({ className, ...props }, ref) => (
  <span ref={ref} className={cn('size-4 shrink-0', className)} {...props} />
));
SidebarMenuButtonIcon.displayName = 'SidebarMenuButtonIcon';

const SidebarMenuButtonLabel = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<'span'>
>(({ className, ...props }, ref) => {
  const { isIconMode } = useSidebar();

  if (isIconMode) return null;

  return <span ref={ref} className={cn('truncate', className)} {...props} />;
});
SidebarMenuButtonLabel.displayName = 'SidebarMenuButtonLabel';

const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'main'>
>(({ className, ...props }, ref) => {
  return (
    <main
      ref={ref}
      className={cn('flex-1 overflow-auto', className)}
      {...props}
    />
  );
});
SidebarInset.displayName = 'SidebarInset';

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuButtonIcon,
  SidebarMenuButtonLabel,
  SidebarMenuItem,
  SidebarProvider,
  useSidebar,
};
