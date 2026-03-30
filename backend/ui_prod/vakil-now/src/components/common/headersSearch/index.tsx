// 'use client';

// import { useState } from 'react';
// import { SearchBar } from '../searchBar';
// import { Icons } from '@/lib/icons';
// import { HeaderSearchProps } from './interface';
// import { Button } from '@/components/ui/button';

// const HeaderSearch = ({
//   placeholder = 'Search',
//   value,
//   onChange,
//   onSubmit,
//   className = ''
// }: HeaderSearchProps) => {
//   const [showMobileSearch, setShowMobileSearch] = useState(false);

//   return (
//    <div className={`flex items-center w-full gap-3 ${className}`}>

//       {/* SEARCH INPUT */}
//       <div
//         className={`${
//           showMobileSearch ? "flex" : "hidden"
//         } sm:flex flex-1`}
//       >
//         <SearchBar
//           placeholder={placeholder}
//           value={value}
//           onChange={onChange}
//           onSubmit={onSubmit}
//           className='w-full bg-[#E5F6FE]'
//         />
//       </div>

//       {/* ICON GROUP */}
//       <div className="flex items-center gap-3 ml-auto">
//         {/* MOBILE SEARCH BUTTON */}
//         <Button
//           onClick={() => setShowMobileSearch(!showMobileSearch)}
//           className="sm:hidden bg-[#E5F6FE] p-2 rounded flex items-center justify-center"
//         >
//           <Icons.SearchIcon className="w-6 h-6 text-[#1565C0]" />
//         </Button>

//         {/* BELL ICON */}
//         <div
//           className="
//             aspect-square
//             bg-[#1565C0]
//             flex items-center justify-center
//             p-2 cursor-pointer rounded
//           "
//         >
//           <Icons.BellIcon className="text-white w-6 h-6" />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HeaderSearch;



'use client';

import { useState, useRef, useEffect } from 'react';
import { SearchBar } from '../searchBar';
import { Icons } from '@/lib/icons';
import { HeaderSearchProps } from './interface';
import { Button } from '@/components/ui/button';

// 1. Mock Data based on your Figma screenshot
const MOCK_NOTIFS = [
  { id: 1, title: 'Document Updated', msg: 'aadhaar card is updated', date: 'Today', isRead: false },
  { id: 2, title: 'Announcement', msg: 'new offer updated', date: 'Today', isRead: false },
  { id: 3, title: 'Wallet', msg: '1256 rupees added to your wallet', date: '28 Dec 2025', isRead: true },
  { id: 4, title: 'Document Require', msg: 'aadhaar card is require', date: '20 Dec 2025', isRead: true },
  { id: 5, title: 'Announcement', msg: 'offer expired', date: 'Today', isRead: true },
];

const HeaderSearch = ({
  placeholder = 'Search',
  value,
  onChange,
  onSubmit,
  className = ''
}: HeaderSearchProps) => {
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Notification States
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFS);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  return (
    <div className={`flex items-center w-full gap-3 ${className} relative`}>

      {/* SEARCH INPUT */}
      <div
        className={`${showMobileSearch ? "flex" : "hidden"
          } sm:flex flex-1`}
      >
        <SearchBar
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onSubmit={onSubmit}
          className='w-full bg-[#E5F6FE]'
        />
      </div>

      {/* ICON GROUP */}
      <div className="flex items-center gap-3 ml-auto">
        {/* MOBILE SEARCH BUTTON */}
        <Button
          onClick={() => setShowMobileSearch(!showMobileSearch)}
          className="sm:hidden bg-[#E5F6FE] p-2 rounded flex items-center justify-center"
        >
          <Icons.SearchIcon className="w-6 h-6 text-[#1565C0]" />
        </Button>

        {/* BELL ICON WRAPPER */}
        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => {
              setShowNotifs(!showNotifs)}
            }
            className="
              aspect-square
              bg-[#1565C0]
              flex items-center justify-center
              p-2 cursor-pointer rounded
              relative
            "
          >
            {/* Using the BellIcon from your file*/}
            <Icons.BellIcon className="text-white w-6 h-6" />

            {/* Notification Badge */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white min-w-[18px] text-center">
                {unreadCount}
               </span>
            )}
          </div>

          {/* DROPDOWN MENU (Figma Design) */}
          {showNotifs && (
            <div className="absolute right-0 mt-3 w-[290px] md:w-[360px] bg-white border border-gray-100 rounded-lg shadow-2xl z-[100] overflow-hidden animate-in fade-in zoom-in duration-150">

              {/* Blue Header */}
              <div className="bg-[#1565C0] p-3 flex justify-between items-center text-white">
                <span className="text-sm font-semibold">Notifications</span>
                <button
                  onClick={markAllAsRead}
                  className="text-[11px] hover:underline opacity-90"
                >
                  Mark all as read
                </button>
              </div>

              {/* List Area */}
              <div className="max-h-[380px] overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 border-b border-gray-50 flex gap-3 transition-colors ${!n.isRead ? 'bg-[#F0F7FF]' : 'bg-white'}`}
                  >
                    {/* Rounded Icon Circle */}
                    <div className="w-10 h-10 shrink-0 rounded-full bg-[#E1F5FE] flex items-center justify-center relative">
                      <Icons.BellIcon className="w-5 h-5 text-[#0288D1]" />
                      {!n.isRead && (
                        <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#4ADE80] border-2 border-white rounded-full"></div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-[#1565C0] underline underline-offset-2 cursor-pointer">
                          {n.title}
                        </span>
                        <p className="text-[12px] text-gray-600 line-clamp-2 mt-0.5">{n.msg}</p>
                        <span className="text-[10px] text-gray-400 mt-1 font-medium">{n.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderSearch;