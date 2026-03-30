// 'use client';

// import { CustomProfileAvatar } from "@/components/common/Avatar";
// import { SearchBar } from "@/components/common/searchBar";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Icons } from "@/lib/icons";
// import { ROUTES } from "@/lib/routes";
// import { usePathname, useRouter } from "next/navigation";
// import { useState } from "react";
// import { useAppDispatch } from "../../../../../../redux/hook";
// import { logOut } from "../../../../../../redux/slices/auth/authThunks";
// import { formatDate } from "./helpers";


// interface ProfileHeaderProps {
//   imageUrl: string;
//   companyName: string;
//   fullName: string;
//   dateLabel: string;
//   email: string;
//   phone: string;
//   address: string;
//   language: string;
//   onEdit?: () => void;
// }

// export function ProfileHeaderCard ({
//   imageUrl,
//   companyName,
//   fullName,
//   dateLabel,
//   email,
//   phone,
//   address,
//   language,
//   onEdit,
// }: ProfileHeaderProps) {

//   const [showMobileSearch, setShowMobileSearch] = useState(false);
//   const pathname = usePathname();
//   const isDashboard = pathname === "/customer/dashboard";

//   const dispatch = useAppDispatch();
//   const router = useRouter();
//   const handleLogout = async () => {

//     try {
//       await dispatch(logOut()).unwrap();
//       router.replace(ROUTES.auth.login);
//     } catch (error) {
//       console.error('Logout failed');
//     }
//   };

//   return (
//     <section className="w-full rounded">

//       {/* ================= MOBILE VIEW ================= */}
//       <div className="flex items-center justify-between px-4 pt-8 md:hidden  bg-white">

//         {isDashboard && (
//           <CustomProfileAvatar
//             src={imageUrl || ""}
//             name={companyName}
//             title={fullName}
//             fallbackInitial={fullName?.charAt(0) || "U"}
//             border="border-0"
//             fontSize="text-sm"
//           />
//         )}


//         <div className="flex items-center gap-2 ml-auto">
//           <Button
//             variant="ghost"
//             className="bg-[#EDF9FE] p-2 w-12 h-12"
//             onClick={() => setShowMobileSearch((prev) => !prev)}
//           >
//             <Icons.SearchIcon size={48} className="text-[#1565C0]" />
//           </Button>


//           <Button
//             type="button"
//             variant="ghost"
//             className="
//     aspect-square
//     bg-[#EDF9FE]
//     flex items-center justify-center
//     p-2 w-12 h-12 rounded
//     hover:bg-[#1565C0]
//   "
//           >
//             <Icons.BellIcon className="text-[#1565C0] w-6 h-6" />
//           </Button>


//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <button
//                 type="button"
//                 className="inline-flex h-12 w-12 items-center justify-center rounded-md hover:bg-gray-100"
//               >
//                 <Icons.VerticalDotsIcon className="h-6 w-6 text-gray-700" />
//               </button>
//             </DropdownMenuTrigger>

//             <DropdownMenuContent
//               align="end"
//               side="bottom"
//               sideOffset={8}
//               className="z-[9999]"
//             >
//               <DropdownMenuItem onClick={() => console.log("Profile")}>
//                 Profile
//               </DropdownMenuItem>

//               <DropdownMenuItem
//                 className="text-red-600"
//                 onClick={handleLogout}
//               >
//                 Logout
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>

//         </div>
//       </div>
//       {showMobileSearch && (
//         <div className="px-4 py-5 bg-white md:hidden">

//           <SearchBar
//             placeholder="Search..."
//             className="w-full bg-[#EDF9FE]"
//           />
//         </div>
//       )}



//       {/* DESKTOP VIEW */}
//       <div className="hidden md:block bg-[#0D3D73] p-5 rounded">
//         {/* SECOND CONTAINER — layout only (NO padding, NO gap) */}
//         <div className="bg-[#11519A] rounded-lg flex relative">

//           {!onEdit && (
//             <Button
//               onClick={onEdit}
//               className="absolute top-3 right-3 bg-transparent cursor-pointer text-white hover:bg-[#1565C0]"
//             >
//               <Icons.EditIcon className="size-6 cursor-pointer" />
//             </Button>
//           )}
//           {/* LEFT HALF — Image + Company (50%) */}
//           <div className="flex flex-1">

//             {/* IMAGE — flush to 2nd container */}
//             <div className="w-36 flex-shrink-0 rounded-lg">
//               <div className="h-full rounded-l-lg overflow-hidden rounded-lg">
//                 <img
//                   src={imageUrl || "https://cyber.comolho.com/static/img/avatar.png"}
//                   alt="Profile"
//                   className="w-full h-full object-cover rounded-lg"
//                 />
//               </div>
//             </div>

//             {/* COMPANY INFO — padded content */}
//             <div className="flex flex-1 p-5 pl-0">
//               <div className="flex-1 bg-gradient-to-l from-[#1480B1] to-[#215EA3] p-4 rounded-lg flex items-center">
//                 <div className="text-white flex flex-col">
//                   <h2 className="text-2xl md:text-[32px] font-bold">
//                     {companyName}
//                   </h2>
//                   <p className="text-md">Hi, {fullName}</p>

//                   <span className="inline-flex w-fit mt-3 text-sm bg-[#0D3D73] px-3 py-1 rounded">
//                     {formatDate(Date())}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT HALF — Email / Phone (50%) */}
//           <div className="flex flex-1 p-5 text-[#EDF9FE] text-md opacity-90 leading-6 flex flex-col justify-center">
//             <p>Email: {email}</p>
//             <p>Phone: {phone}</p>
//             <p>Address: {address}</p>
//             <p>Language: {language}</p>
//           </div>

//         </div>
//       </div>






//     </section>
//   );
// }




'use client';

import { CustomProfileAvatar } from "@/components/common/Avatar";
import { SearchBar } from "@/components/common/searchBar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/lib/icons";
import { ROUTES } from "@/lib/routes";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useAppDispatch } from "../../../../../../redux/hook";
import { logOut } from "../../../../../../redux/slices/auth/authThunks";
import { formatDate } from "./helpers";

interface ProfileHeaderProps {
  imageUrl: string;
  companyName: string;
  fullName: string;
  dateLabel: string;
  email: string;
  phone: string;
  address: string;
  language: string;
  onEdit?: () => void;
}

// Mock Data for Notifications
const MOCK_NOTIFS = [
  { id: 1, title: 'Document Updated', msg: 'aadhaar card is updated', date: 'Today', isRead: false },
  { id: 2, title: 'Announcement', msg: 'new offer updated', date: 'Today', isRead: false },
  { id: 3, title: 'Wallet', msg: '1256 rupees added to your wallet', date: '28 Dec 2025', isRead: true },
  { id: 4, title: 'Document Require', msg: 'aadhaar card is require', date: '20 Dec 2025', isRead: true },
  { id: 5, title: 'Announcement', msg: 'offer expired', date: 'Today', isRead: true },
];

export function ProfileHeaderCard ({
  imageUrl,
  companyName,
  fullName,
  dateLabel,
  email,
  phone,
  address,
  language,
  onEdit,
}: ProfileHeaderProps) {
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Notification States
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFS);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const pathname = usePathname();
  const isDashboard = pathname === "/customer/dashboard";

  const dispatch = useAppDispatch();
  const router = useRouter();

  // Handle Outside Click for Notifications
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await dispatch(logOut()).unwrap();
      router.replace(ROUTES.auth.login);
    } catch (error) {
      console.error('Logout failed');
    }
  };

  const markAllAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  return (
    <section className="w-full rounded relative overflow-visible">
      {/* ================= MOBILE VIEW ================= */}
      <div className="flex items-center justify-between px-4 pt-8 md:hidden bg-white">
        {isDashboard && (
          <CustomProfileAvatar
            src={imageUrl || ""}
            name={companyName}
            title={fullName}
            fallbackInitial={fullName?.charAt(0) || "U"}
            border="border-0"
            fontSize="text-sm"
          />
        )}

        <div className="flex items-center gap-2 ml-auto relative">
          {/* SEARCH TOGGLE */}
          <Button
            variant="ghost"
            className="bg-[#EDF9FE] p-2 w-12 h-12"
            onClick={() => setShowMobileSearch((prev) => !prev)}
          >
            <Icons.SearchIcon className="text-[#1565C0] w-6 h-6" />
          </Button>

          {/* NOTIFICATION BELL WITH DROPDOWN */}
          <div className="relative" ref={dropdownRef}>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowNotifs(!showNotifs)}
              className={`
                aspect-square
                flex items-center justify-center
                p-2 w-12 h-12 rounded relative
                ${showNotifs ? "bg-[#1565C0] text-white" : "bg-[#EDF9FE] text-[#1565C0]"}
                hover:bg-[#1565C0] hover:text-white
              `}
            >
              <Icons.BellIcon className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-1 py-0.5 rounded-full border-2 border-white min-w-[18px] text-center">
                  {unreadCount}
                </span>
              )}
            </Button>

            {/* NOTIFICATION DROPDOWN */}
            {showNotifs && (
              <div className="absolute right-0 mt-3 w-[290px] bg-white border border-gray-100 rounded-lg shadow-2xl z-[9999] overflow-hidden animate-in fade-in zoom-in duration-150">
                <div className="bg-[#1565C0] p-3 flex justify-between items-center text-white">
                  <span className="text-sm font-semibold">Notifications</span>
                  <button onClick={markAllAsRead} className="text-[11px] hover:underline opacity-90">
                    Mark all as read
                  </button>
                </div>
                <div className="max-h-[350px] overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className={`p-3 border-b border-gray-50 flex gap-3 ${!n.isRead ? 'bg-[#F0F7FF]' : 'bg-white'}`}>
                      <div className="w-10 h-10 shrink-0 rounded-full bg-[#E1F5FE] flex items-center justify-center relative">
                        <Icons.BellIcon className="w-5 h-5 text-[#0288D1]" />
                        {!n.isRead && <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#4ADE80] border-2 border-white rounded-full" />}
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <span className="text-[13px] font-bold text-[#1565C0] underline block">{n.title}</span>
                        <p className="text-[12px] text-gray-600 line-clamp-2">{n.msg}</p>
                        <span className="text-[10px] text-gray-400 mt-1 block">{n.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* VERTICAL DOTS MENU */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex h-12 w-12 items-center justify-center rounded-md hover:bg-gray-100"
              >
                <Icons.VerticalDotsIcon className="h-6 w-6 text-gray-700" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={8} className="z-[9999]">
              <DropdownMenuItem onClick={() => router.push('/customer/profile')}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* MOBILE SEARCH BAR */}
      {showMobileSearch && (
        <div className="px-4 py-5 bg-white md:hidden animate-in slide-in-from-top duration-200">
          <SearchBar placeholder="Search..." className="w-full bg-[#EDF9FE]" />
        </div>
      )}

      {/* ================= DESKTOP VIEW ================= */}
      <div className="hidden md:block bg-[#0D3D73] p-5 rounded mt-4">
        <div className="bg-[#11519A] rounded-lg flex relative">
          {!onEdit && (
            <Button
              onClick={onEdit}
              className="absolute top-3 right-3 bg-transparent cursor-pointer text-white hover:bg-[#1565C0]"
            >
              <Icons.EditIcon className="size-6" />
            </Button>
          )}
          <div className="flex flex-1">
            <div className="w-36 flex-shrink-0">
              <img
                src={imageUrl || "https://cyber.comolho.com/static/img/avatar.png"}
                alt="Profile"
                className="w-full h-full object-cover rounded-l-lg"
              />
            </div>
            <div className="flex flex-1 p-5 pl-0">
              <div className="flex-1 bg-gradient-to-l from-[#1480B1] to-[#215EA3] p-4 rounded-lg flex items-center">
                <div className="text-white flex flex-col">
                  <h2 className="text-2xl md:text-[32px] font-bold">{companyName}</h2>
                  <p className="text-md">Hi, {fullName}</p>
                  <span className="inline-flex w-fit mt-3 text-sm bg-[#0D3D73] px-3 py-1 rounded">
                    {formatDate(new Date().toISOString())}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-1 p-5 text-[#EDF9FE] text-md opacity-90 leading-6 flex flex-col justify-center">
            <p>Email: {email}</p>
            <p>Phone: {phone}</p>
            <p>Address: {address}</p>
            <p>Language: {language}</p>
          </div>
        </div>
      </div>
    </section>
  );
}