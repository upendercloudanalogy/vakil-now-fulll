'use client';
import React from 'react';
import { CustomButton } from '@/components/common/button';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { LawyerRequest } from './interfaces/index';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/routes';

const LawyerRequestItem = ({ name, image }: LawyerRequest) => {
  const router = useRouter();
  const handleClick = () => {
    router.push(ROUTES.admin.dashboard.lawyerRequestDetails);
  };

  return (
    <Card className='p-0 m-0 shadow-none rounded-none bg-transparent border-0 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2 min-w-0 w-full'>
      <Card className='p-0 m-0 shadow-none rounded-none bg-transparent border-0 flex-row  min-w-0 overflow-hidden gap-2'>
        <Image
          src={image}
          width={32}
          height={32}
          alt={name}
          className='object-contain rounded-full flex-shrink-0'
        />
        <Card className='p-0 m-0 shadow-none rounded-none bg-transparent  border-0 text-[rgb(121,125,140)] font-medium items-center justify-center flex-1 min-w-0 overflow-hidden'>
          <span className='truncate block w-full' title={name}>
            {name}
          </span>
        </Card>
      </Card>
      <Card className='p-0 m-0 shadow-none rounded-none bg-transparent  border-0 flex-row gap-2 min-w-0 justify-end'>
        <CustomButton
          text={'Accept'}
          className='bg-[rgb(67,160,71)] hover:bg-[rgb(67,160,71)]  text-white font-medium font-inter flex-1'
        />
        <CustomButton
          text={'View Details'}
          className='bg-[rgb(21,101,192)] hover:bg-[rgb(21,101,192)] text-white font-medium font-inter flex-1'
          onClick={handleClick}
        />
      </Card>
    </Card>
  );
};

export default React.memo(LawyerRequestItem);
