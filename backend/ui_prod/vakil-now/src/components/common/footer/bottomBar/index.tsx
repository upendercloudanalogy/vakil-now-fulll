import { Icons } from '@/lib/icons';

const BottomBar = () => {
  return (
    <div className='w-full bg-[#11519A] mt-8 sm:mt-12'>
      <div className='w-full max-w-full mx-0'>
        <div
          className='
            flex flex-col sm:flex-row
            items-center
            justify-center sm:justify-between
            gap-3 sm:gap-0
            px-4 sm:px-6 md:px-8
            py-4 sm:py-0
          '>
          {/* Copyright */}
          <div className='text-white text-md text-center sm:text-left'>
            Copyright © VakilNow
          </div>

          {/* Social Links */}
          <div className='flex items-center'>
            <a className='h-12 w-12 sm:h-14 sm:w-14 flex items-center justify-center bg-white border-l border-blue-200'>
              <Icons.InstagramIcon className='w-5 h-5 sm:w-4 sm:h-4' />
            </a>

            <a className='h-12 w-12 sm:h-14 sm:w-14 flex items-center justify-center bg-white border-l border-blue-200'>
              <Icons.LinkedInIcon className='w-5 h-5 sm:w-4 sm:h-4' />
            </a>

            <a className='h-12 w-12 sm:h-14 sm:w-14 flex items-center justify-center bg-white border-l border-blue-200'>
              <Icons.TwitterIcon className='w-5 h-5 sm:w-4 sm:h-4' />
            </a>

            <a className='h-12 w-12 sm:h-14 sm:w-14 flex items-center justify-center bg-white border-l border-r border-blue-200'>
              <Icons.FacebookIcon className='w-5 h-5 sm:w-4 sm:h-4' />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomBar;
