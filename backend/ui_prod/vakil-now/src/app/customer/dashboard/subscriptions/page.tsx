import React from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SubscriptionsPage = () => {
  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
      <div className='bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center'>
        <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
          <Calendar className='w-8 h-8 text-blue-600' />
        </div>

        <h1 className='text-2xl font-bold text-gray-800 mb-2'>Coming Soon</h1>

        <p className='text-gray-600 mb-6'>
          We&apos;re working hard to bring you the best subscription experience.
          Stay tuned for updates!
        </p>

        <Button className='bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded transition duration-200 cursor-pointer'>
          Get Notified
        </Button>
      </div>
    </div>
  );
};

export default SubscriptionsPage;
