import { Icons } from '@/lib/icons';
import { CustomButton } from '../../button';
import Image from 'next/image';

const FooterConsultBanner = () => {
  return (
    <div className='w-full bg-white rounded-none relative py-6 shadow-[0px_0px_12.28px_0px_#00000029]'>
      {/* Top-LEFT image - CORRECTED */}
      <Image
        src='/footer-consult-banner-corner-top-right.svg'
        alt='top left design'
        width={80}
        height={80}
        className='absolute top-0 left-0 pointer-events-none select-none'
      />

      {/* Bottom-RIGHT image - CORRECTED */}
      <Image
        src='/footer-consult-banner-corner-bottom-left.svg' // Make sure this filename matches
        alt='bottom right design'
        width={80}
        height={80}
        className='absolute bottom-0 right-0 pointer-events-none select-none'
      />

      {/* Banner Content */}
      <div className='relative flex flex-col sm:flex-row items-center justify-between px-6 sm:px-15 h-full z-10'>
        {/* Left content - centered vertically */}
        <div className='flex flex-col sm:flex-row items-center gap-3 sm:gap-4 flex-1'>
          <div className='p-2 sm:p-3 flex-shrink-0'>
            <Icons.LegalIcon className='w-15 h-15 text-orange-500' />
          </div>

          <div className='space-y-3'>
            <h3 className='text-lg sm:text-2xl font-bold text-gray-900 leading-tight'>
              Consult Our Legal Experts Today
            </h3>
            <p className='text-xs sm:text-sm text-gray-600'>
              Online Legal Consultation Easy with VakilNow
            </p>
          </div>
        </div>

        {/* Button - centered vertically with proper spacing */}
        <div className='flex-shrink-0'>
          <CustomButton
            text='Talk To Lawyer'
            className='bg-[#CC8809] hover:bg-[#b37708] text-white
             px-6 py-3 rounded-none font-semibold
             text-sm sm:text-base
             h-10 sm:h-12
             w-full sm:w-auto
             mt-2 sm:mt-0
             flex items-center justify-center'
          />
        </div>
      </div>
    </div>
  );
};

export default FooterConsultBanner;
