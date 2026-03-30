'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { SidebarMenuCard } from '../SidebarMenuCard';
import { menuItems } from './constants/index';
import { ROUTES } from '@/lib/routes';
import { LogOutIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logOut } from '../../../../redux/slices/auth/authThunks';
import { useAppDispatch } from '../../../../redux/hook';
import { useRouter } from 'next/navigation';

export const AppSidebar = ({
  defaultOpen = true,
  widthOfSidebar = '267px',
  paddingOfSidebar = '20px',
  bgColor = 'rgb(10,35,66)' // must be in rgb
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await dispatch(logOut()).unwrap();
      router.replace(ROUTES.auth.login);
    } catch (error) {
      console.error('Logout failed');
    }
  };

  return (
    //  <SidebarProvider defaultOpen width={widthOfSidebar}>
    <Sidebar
      className='h-screen [padding:var(--sidebar-padding)] border-none '
      style={{ '--sidebar-padding': paddingOfSidebar } as React.CSSProperties}
      bgColor={bgColor}>
      <SidebarHeader className='flex flex-row items-center justify-center p-0 mt-[20px] w-full'>
        <Image
          src='/logo.svg'
          alt='Dashboard Icon'
          width={122}
          height={88}
          className='object-contain'
        />
      </SidebarHeader>
      <SidebarMenuCard
        name='Dashboard'
        image='/logo.svg'
        iconHeight={24}
        iconWidth={24}
        padding={10}
        marginTop={70}
        textColor='white'
        marginBottom={20}
        bgColor='rgb(21,101,192)'
        gap={3}
        fontSize='Medium'
        href={ROUTES.admin.dashboard.index}
      />
      <SidebarContent className='w-full !scrollbar-thin !scrollbar-thumb-transparent !scrollbar-track-transparent'>
        <SidebarGroup className='p-0 m-0'>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item, index) => (
                <SidebarMenuItem key={index}>
                  {item.subItems ? (
                    <Collapsible
                      open={openIndex === index}
                      onOpenChange={() =>
                        setOpenIndex(openIndex === index ? null : index)
                      }>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          asChild
                          className='group
                                       hover:bg-transparent
                                       focus:bg-transparent
                                       active:bg-transparent
                                       focus-visible:ring-0
                                       ring-0
                                       border-none outline-none
                                      transition-none'>
                          <SidebarMenuCard
                            href='#'
                            name={item.name}
                            fontSize='Medium'
                            leftIcon={true}
                            bgColor='rgb(10,35,66)'
                            className='cursor-pointer'
                          />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className='!border-none before:hidden after:hidden [&>*]:!border-none [&>*]:before:hidden [&>*]:after:hidden'>
                          {item.subItems.map((sub, i) => (
                            <SidebarMenuSubItem key={i}>
                              <SidebarMenuSubButton asChild>
                                <Link
                                  href={sub.href}
                                  className='!text-[rgb(177,179,181)] pl-[50px] !bg-transparent'>
                                  {sub.name}
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton
                      asChild
                      className='hover:bg-transparent
                          active:bg-transparent
                          focus:bg-transparent'>
                      <SidebarMenuCard
                        href={item.href}
                        name={item.name}
                        fontSize='Medium'
                        leftIcon={true}
                        bgColor='rgb(10,35,66)'
                        className='cursor-pointer'
                      />
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuCard
          name='Vakil Admin'
          image='/image.png'
          iconHeight={40}
          iconWidth={40}
          fontweight={500}
          fontSize='Medium'
          marginTop={0}
          marginBottom={0}
          padding={0}
          textColor='white'
          gap={3}
          bgColor='rgb(10,35,66)'
          href='#'
        />

        <Button
          className='bg-transparent hover:bg-transparent ga-3 font-medium !mt-[10px] !p-0 items-start mb-10 shadcn-logout-btn'
          onClick={handleLogout}>
          <LogOutIcon />
          Log Out
        </Button>
      </SidebarFooter>
    </Sidebar>
    // </SidebarProvider>
  );
};
