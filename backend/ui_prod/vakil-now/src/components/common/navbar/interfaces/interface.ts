export interface MobileSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
  menuItems: string[];
}

export interface FancyButtonProps {
  height?: string;
  width?: string;
  borderRadius?: string;
  fontSize?: string;
  children: React.ReactNode;
  className?: string;
}

export interface DesktopNavbarProps {
  menuItems: string[];
  showIcons?: boolean;
  showButton?: boolean;
  buttonLabel?: string;
  onUserClick?: () => void;
  onMenuClick?: () => void;
}
