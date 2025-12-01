// Sidebar primitives (context-based)
export * from './SidebarPrimitives';

// AppSidebar composition - explicit exports to avoid conflicts
export {
  AppSidebar,
  type SidebarNavItem,
  type AppSidebarUser,
  type NavItemPermissionResult,
  type AppSidebarProps,
} from './AppSidebar';

// ResizableSidebar (standalone variant)
export {
  default as ResizableSidebar,
  Sidebar as ResizableSidebarAlias,
  type NavigationItem,
  type SidebarProps as ResizableSidebarProps,
} from './ResizableSidebar';
