'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Phone } from 'lucide-react';
import { FancyButton } from '../navbarbtn/page.';
import { Icons } from '@/lib/icons';
import { DesktopNavbarProps } from '../interfaces/interface';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useAppDispatch } from '../../../../../redux/hook';
import { logOut } from '../../../../../redux/slices/auth/authThunks';
import { ROUTES } from '@/lib/routes';

export function DesktopNavbar({
  menuItems,
  showIcons = true,
  showButton = true,
  buttonLabel = 'Talk To Lawyer',
  onMenuClick
}: DesktopNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const getHref = (label: string) =>
    `/${label === 'Home' ? '' : label.toLowerCase().replace(' ', '')}`;

  const handleLogout = async () => {

    try {
      await dispatch(logOut()).unwrap();
      router.replace(ROUTES.auth.login);
    } catch (error) {
      console.error('Logout failed');
    }
  };

  return (
    <div className='hidden md:flex items-center space-x-10 relative'>
      {/* ================= NAV MENU ITEMS ================= */}
      {menuItems.map((label, i) => {
        const href = getHref(label);
        const isActive =
          pathname === href || (label === 'Home' && pathname === '/');

        return (
          <Link
            key={i}
            href={href}
            className='group relative flex flex-col items-center text-white hover:text-orange-300'>
            <span className='relative z-10'>{label}</span>

            {/* Active / Hover lines */}
            <div
              className={`
                absolute top-full mt-1 flex gap-1 items-center
                opacity-0 group-hover:opacity-100 transition-opacity duration-200
                ${isActive ? 'opacity-100' : ''}
              `}>
              <div className='w-0.5 h-6 bg-white' />
              <div className='w-1 h-6 bg-[#CC8809]' />
            </div>
          </Link>
        );
      })}

      {/* ================= USER ICON DROPDOWN ================= */}
      {showIcons && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className='relative group flex flex-col items-center cursor-pointer text-white hover:text-orange-300'>
              <Icons.UserIcon className='h-5 w-5' />

              {/* Hover lines */}
              <div
                className='
                  absolute top-full mt-1 flex gap-1 items-center
                  opacity-0 group-hover:opacity-100 transition-opacity duration-200
                '>
                <div className='w-0.5 h-6 bg-white' />
                <div className='w-1 h-6 bg-[#CC8809]' />
              </div>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align='end' sideOffset={10} className='w-44'>
            <DropdownMenuItem
              className='cursor-pointer'
              onClick={() => router.push('/profile')}>
              Profile
            </DropdownMenuItem>

            {/* <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => router.push("/settings")}
            >
              Settings
            </DropdownMenuItem> */}

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className='cursor-pointer text-red-500 focus:text-red-500'
              onClick={handleLogout}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* ================= MENU ICON ================= */}
      {showIcons && (
        <div className='relative group flex flex-col items-center'>
          <Icons.MenuIcon
            className='h-5 w-5 cursor-pointer text-white hover:text-orange-300'
            onClick={onMenuClick}
          />

          <div
            className='
              absolute top-full mt-1 flex items-center gap-1
              opacity-0 group-hover:opacity-100 transition-opacity duration-200
            '>
            <div className='w-0.5 h-6 bg-white' />
            <div className='w-1 h-6 bg-[#CC8809]' />
          </div>
        </div>
      )}

      {/* ================= CTA BUTTON ================= */}
      {showButton && (
        <FancyButton height='h-15' width='w-46' fontSize='text-xl'>
          <Phone className='h-4 w-4' />
          {buttonLabel}
        </FancyButton>
      )}
    </div>
  );
}
