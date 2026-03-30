'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  phone: string;
  email: string;
}
export function Header({ phone, email }: HeaderProps) {
  return (
    <div
      className='
    hidden sm:flex
    bg-[#11519A] text-white 
    px-4 sm:px-10 lg:px-20 xl:px-44 
    py-3 
    flex-col sm:flex-row 
    justify-between items-start sm:items-center 
    gap-3 sm:gap-0
    text-sm sm:text-base lg:text-lg
  '>
      {/* Left Section */}
      <div className='flex flex-col  text-sm sm:flex-row sm:space-x-6 space-y-1 sm:space-y-0'>
        <span>Call Us: {phone}</span>
        <span>Email Us: {email}</span>
      </div>

      {/* Right Section */}
      <div className='flex items-center space-x-3 text-sm sm:text-sm'>
        {/* <span>Hello</span>

        <Button variant='ghost' className='text-[#CC8809] px-2 sm:px-4'>
          Login Now
        </Button> */}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              className='text-white px-2 sm:px-4 bg-white text-black rounded-none'>
              Select Language ▼
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuLabel>Languages</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>English</DropdownMenuItem>
            <DropdownMenuItem>Hindi</DropdownMenuItem>
            <DropdownMenuItem>Gujarati</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
