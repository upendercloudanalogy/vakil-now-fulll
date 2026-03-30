import { ROUTES } from '@/lib/routes/index';
// types.ts
export interface MenuItem {
  name: string;
  href: string;
  subItems?: { name: string; href: string }[];
}

const menuItems: MenuItem[] = [
  {
    name: 'Users',
    href: ROUTES.admin.dashboard.users
  },
  {
    name: 'Lawyers',
    href: ROUTES.admin.dashboard.lawyers
  },
  {
    name: 'Services',
    href: ROUTES.admin.dashboard.services
  },
  {
    name: 'Packages',
    href: ROUTES.admin.dashboard.packages
  },
  {
    name: 'Payments',
    href: '#'
  },
  {
    name: 'Reports',
    href: '#'
  },
  {
    name: 'Settings',
    href: '#'
  }
];

export { menuItems };
