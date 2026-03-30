export type SidebarChild = {
  label: string;
  href: string;
};

export type SidebarItem = {
  label: string;
  icon?: React.ElementType;
  href?: string;
  children?: SidebarChild[];
};

export interface SidebarProps {
  menu: SidebarItem[];
  itemClassName?: string;
  subItemClassName?: string;
  sidebarClassName?: string; // 👈 NEW
}

export interface ItemRowProps {
  label: string;
  icon?: React.ElementType;
  active?: boolean;
  open?: boolean;
  hasChildren?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  itemClassName?: string;
}
