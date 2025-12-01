'use client';

import type { LucideIcon } from 'lucide-react';
import { LogOut } from 'lucide-react';
import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import FlowenseFullLogo from '../../atoms/Icon/FlowenseFull';
import FlowenseWave from '../../atoms/Icon/FlowenseWave';
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from '../../molecules/Dropdown/Dropdown';
import { NavItem } from '../../molecules/NavItem/NavItem';

export interface NavigationItem {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  href?: string;
  onClick?: () => void;
}

export interface SidebarProps {
  navigationItems: NavigationItem[];
  children: ReactNode;
  appName?: string;
  appLogo?: ReactNode;
  collapsedLogo?: ReactNode;
  userInfo?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onLogout?: () => void;
  minWidth?: number;
  maxWidth?: number;
  iconModeThreshold?: number;
  defaultWidth?: number;
}

export default function ResizableSidebar({
  navigationItems,
  children,
  appLogo,
  collapsedLogo,
  userInfo,
  onLogout,
  minWidth = 60,
  maxWidth = 400,
  iconModeThreshold = 120,
  defaultWidth = 240,
}: SidebarProps) {
  const [sidebarWidth, setSidebarWidth] = useState(defaultWidth);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef(null);

  const isIconMode = sidebarWidth < iconModeThreshold;

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const newWidth = e.clientX;
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setSidebarWidth(newWidth);
      }
    },
    [minWidth, maxWidth],
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  };

  useEffect(() => {
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

  return (
    <div className="flex h-screen bg-background">
      <div
        ref={sidebarRef}
        style={{ width: `${sidebarWidth}px` }}
        className={`relative bg-card border-r border-border shadow-sm flex flex-col ${!isResizing ? 'transition-all duration-200' : ''}`}
      >
        <div className="h-16 flex items-center justify-center px-4">
          {isIconMode
            ? (collapsedLogo ?? <FlowenseWave />)
            : (appLogo ?? <FlowenseFullLogo />)}
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {navigationItems.map((item) => (
              <li key={item.label}>
                <NavItem
                  icon={item.icon}
                  label={item.label}
                  active={item.active}
                  href={item.href}
                  onClick={item.onClick}
                  isIconMode={isIconMode}
                />
              </li>
            ))}
          </ul>
        </nav>

        {userInfo && (
          <div>
            <Dropdown>
              <DropdownTrigger
                asChild
                className="w-full p-1 hover:bg-hover transition-colors cursor-pointer"
              >
                <div
                  className={`flex items-center gap-3 p-2 ${isIconMode ? 'justify-center' : ''}`}
                >
                  {userInfo.avatar ? (
                    <img
                      src={userInfo.avatar}
                      alt={userInfo.name}
                      className="w-8 h-8 rounded-full shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-full shrink-0 flex items-center justify-center">
                      <span className="text-primary-foreground text-sm font-semibold">
                        {userInfo.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  {!isIconMode && (
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {userInfo.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {userInfo.email}
                      </p>
                    </div>
                  )}
                </div>
              </DropdownTrigger>
              <DropdownContent side="top" align="end" sideOffset={4}>
                <DropdownItem onClick={onLogout} destructive>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownItem>
              </DropdownContent>
            </Dropdown>
          </div>
        )}

        <button
          type="button"
          onMouseDown={handleMouseDown}
          className={`absolute top-0 right-0 w-1 h-full cursor-col-resize group hover:bg-primary transition-colors ${
            isResizing ? 'bg-primary' : 'bg-transparent'
          }`}
          aria-label="Resize sidebar"
        >
          <div className="absolute -right-2 top-0 w-4 h-full" />
        </button>
      </div>

      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}

ResizableSidebar.displayName = 'ResizableSidebar';

// Named export for convenience
export const Sidebar = ResizableSidebar;
