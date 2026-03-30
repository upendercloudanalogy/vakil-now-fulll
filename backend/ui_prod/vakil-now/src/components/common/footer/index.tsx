'use client';
import { Icons } from '@/lib/icons';
import { CustomButton } from '@/components/common/button';
import Image from 'next/image';
import FooterConsultBanner from './fotterConsultBanner';
import BottomBar from './bottomBar';

const services = [
  'Domestic Violence',
  'Family Matters',
  'Trademark Registration',
  'Startup Consultancy',
  'Property Disputes',
  'Cheque Bounce Matters'
];

const links = [
  'About Us',
  'Terms & Condition',
  'Privacy Policy',
  'Cash Terms',
  'Contact Us'
];

const contact = {
  email: 'vakilnow@gmail.com',
  address: '116, Maheshwari Nagar, Ujjain, M.P.',
  hours: 'Monday-Saturday 9AM-9PM',
  phone: '+91 982 698 819'
};

export function Footer() {
  return (
    <footer className='bg-[#0A2342] text-white pb-0 relative'>
      {/* Consult Banner */}
      <div className='relative -top-10 left-1/2 transform -translate-x-1/2 w-full max-w-4xl lg:max-w-6xl px-3 sm:px-4 z-30 '>
        <FooterConsultBanner />
      </div>

      {/* Main Footer — FULL WIDTH LIKE NAVBAR */}
      <div className='w-full px-4 sm:px-6 md:px-10 lg:px-20 pt-6 md:pt-24'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8'>
          {/* Logo + Description */}
          <div className='space-y-4 sm:col-span-2 lg:col-span-1'>
            <div className='flex flex-col items-start space-y-2 mb-10'>
              <Image
                src='/logo.svg'
                alt='VakilNow Logo'
                height={60}
                width={60}
                className='w-30 h-20 object-contain'
              />
            </div>

            <p className='text-md sm:text-md opacity-90 leading-relaxed'>
              VakilNow gives people the chance to confidently and quickly handle
              legal matters from the comfort of their own homes by combining
              convenience, expertise, and reliability.
            </p>

            <CustomButton
              text='Connect With Us'
              className='bg-[#CC8809] cursor-pointer  hover:bg-[#b37708] text-xl mt-10 px-6 py-8 rounded-none'
            />
          </div>

          {/* Services */}
          <div className='sm:col-span-1'>
            <h3 className='text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2'>
              Services
              <div className='flex flex-col gap-1'>
                <div className='w-6 sm:w-8 h-px bg-[#CC8809]' />
                <div className='w-4 sm:w-6 h-px bg-white' />
              </div>
            </h3>

            <ul className='space-y-1 sm:space-y-2 text-md'>
              {services.map((item) => (
                <li
                  key={item}
                  className='flex items-center gap-2 cursor-pointer py-1'>
                  <Icons.BarIcon className='w-3 h-3 sm:w-4 sm:h-4' />
                  <span className='break-words text-md'>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div className='sm:col-span-1'>
            <h3 className='text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2'>
              Links
              <div className='flex flex-col gap-1'>
                <div className='w-6 sm:w-8 h-px bg-[#CC8809]' />
                <div className='w-4 sm:w-6 h-px bg-white' />
              </div>
            </h3>

            <ul className='space-y-1 sm:space-y-2 text-md'>
              {links.map((item) => (
                <li
                  key={item}
                  className='flex items-center gap-2 cursor-pointer py-1'>
                  <Icons.BarIcon className='w-3 h-3 sm:w-4 sm:h-4' />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className='sm:col-span-2 lg:col-span-1'>
            <h3 className='text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2'>
              Contact Now
              <div className='flex flex-col gap-1'>
                <div className='w-6 sm:w-8 h-px bg-[#CC8809]' />
                <div className='w-4 sm:w-6 h-px bg-white' />
              </div>
            </h3>

            <div className='space-y-10 text-sm'>
              <div className='flex items-start gap-2 sm:gap-3'>
                <Icons.EnvelopeIcon className='w-10 h-10 mt-0.5' />
                <div>
                  <span className='break-all'>{contact.email}</span>
                  <p className='text-[#CC8809] text-xl mt-0.5'>Mail to us</p>
                </div>
              </div>

              <div className='flex items-start gap-2 sm:gap-3'>
                <Icons.NavPinIcon className='w-10 h-10 mt-0.5' />
                <div>
                  <span className='break-words'>{contact.address}</span>
                  <p className='text-[#CC8809] text-xl mt-0.5'>Address</p>
                </div>
              </div>

              <div className='flex items-start gap-2 sm:gap-3'>
                <Icons.ClockIcon className='w-10 h-10 mt-0.5' />
                <div>
                  <span>{contact.hours}</span>
                  <p className='text-[#CC8809] text-xl mt-0.5'>Opening Hours</p>
                </div>
              </div>

              <div className='flex items-start gap-2 sm:gap-3'>
                <Icons.PhoneIcon className='w-10 h-10 mt-0.5' />
                <div>
                  <span>{contact.phone}</span>
                  <p className='text-[#CC8809] text-xl mt-0.5'>Call For Help</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <BottomBar />
    </footer>
  );
}
