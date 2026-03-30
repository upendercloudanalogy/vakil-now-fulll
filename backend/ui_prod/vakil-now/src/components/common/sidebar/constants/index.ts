// types.ts
export interface MenuItem {
  name: string;
  href?: string;
  subItems?: { name: string; href: string }[];
}

const menuItems: MenuItem[] = [
  {
    name: 'Users',
    subItems: [
      { name: 'User List', href: '#' },
      { name: 'Create User', href: '#' }
    ]
  },
  {
    name: 'Lawyers',
    subItems: [
      { name: 'User List', href: '#' },
      { name: 'Create User', href: '#' }
    ]
  },
  {
    name: 'Services'
  },
  {
    name: 'Packages'
  },
  {
    name: 'Payments'
  },
  {
    name: 'Reports'
  },
  {
    name: 'Settings'
  }
];

export { menuItems };
