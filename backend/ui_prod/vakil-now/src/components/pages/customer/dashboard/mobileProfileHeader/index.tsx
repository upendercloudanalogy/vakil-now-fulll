'use client';

import { CustomProfileAvatar } from '@/components/common/Avatar';
import { SearchBar } from '@/components/common/searchBar';
import { Button } from '@/components/ui/button';
import { Icons } from '@/lib/icons';
import { useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ROUTES } from '@/lib/routes';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '../../../../../../redux/hook';
import { logOut } from '../../../../../../redux/slices/auth/authThunks';

export default function MobileProfileHeader () {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleSearchClick = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleLogout = async () => {
    try {
      await dispatch(logOut()).unwrap();
      router.replace(ROUTES.auth.login);
    } catch (error) {
      console.error('Logout failed');
    }
  };

  return (
    <header className="sm:hidden sticky top-0 z-50 bg-white border-b">
      <div className="flex h-16 items-center justify-between px-4">

        <CustomProfileAvatar
          height="auto"
          width="auto"
          name="Company name"
          title="User full name"
          fallbackInitial="ID"
          fontSize="text-sm"
          borderRadius="rounded-lg"
          border="border-0"
        />

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="bg-[#EDF9FE]"
            onClick={handleSearchClick}
          >
            <Icons.SearchIcon className="h-5 w-5 text-[#1565C0]" />
          </Button>

          <Button size="icon" className="bg-[#EDF9FE]">
            <Icons.BellIcon className="h-5 w-5 text-[#1565C0]" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Icons.VerticalDotsIcon className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {isSearchVisible && (
        <div className="px-4 py-3 bg-white">
          <SearchBar className="w-full bg-[#EDF9FE]" />
        </div>
      )}
    </header>

  );
}
