'use client';

import { Footer } from "@/components/common/footer";
import HeaderSearch from "@/components/common/headersSearch";
import { Navbar } from "@/components/common/navbar";
import Sidebar from "@/components/common/sidebar";
import { Header } from "@/components/common/topBar";
import { sidebarMenu } from "@/components/pages/customer/dashboard/constant";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/hook";
import { getUser } from "../../../../redux/slices/auth/authThunks";
import { ProfileHeaderCard } from "@/components/pages/customer/dashboard/profileHeader";

export default function CustomerLayout ({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  const { profile } = useAppSelector((state) => state.userReducer);

  const profileData = {
    imageUrl: profile?.profileImage || "",
    companyName: profile?.companyName || "Company Name",
    fullName: profile?.name || "User Name",
    dateLabel: profile?.createdAt || "",
    email: profile?.email || "",
    phone: profile?.phone ? `+91 ${profile.phone}` : "",
    address: profile?.address || "India",
    language: "Eng",
  };


  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  // return (

  //   <div className="min-h-screen bg-white">

  //     {/* STICKY HEADER */}
  //     <div className="sticky top-0 z-50">
  //       <Header phone="92XXXXXXXXX" email="vakil-now@gmail.com" />
  //       <Navbar />
  //     </div>

  //     {/* PAGE BODY */}
  //     <div className="flex">

  //       {/* SIDEBAR */}
  //       <aside className="hidden md:block fixed left-0 top-[112px] h-[calc(100vh-112px)] w-72 bg-[#0A3A73] z-40">
  //         <Sidebar
  //           menu={sidebarMenu}
  //           sidebarClassName="w-72 bg-[#0A3A73]"
  //           itemClassName="text-md"
  //         />
  //       </aside>

  //       {/* MAIN CONTENT */}
  //       <main className="md:ml-72 w-full bg-white min-h-screen pt-8 mb-15 px-4">
  //         {/* Search bar */}
  //         <div className="mb-6">
  //           <HeaderSearch
  //             placeholder="Search"
  //             value=""
  //             className="w-full"
  //           />
  //         </div>

  //         {children}
  //       </main>


  //     </div>

  //     {/* FULL-WIDTH FOOTER */}
  //     <footer className="w-full bg-[#0B2A4A] relative z-50">
  //       <Footer />
  //     </footer>

  //   </div>


  // );



  return (
    <div className="min-h-screen bg-gray-50">

      {/* ================= FIXED HEADER ================= */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white">
        <Header phone="92XXXXXXXXX" email="vakil-now@gmail.com" />
        <Navbar />
      </div>

      {/* 🔹 HEADER SPACER (CRITICAL FIX) */}
      <div className="pt-20 sm:pt-40" />

      {/* ================= SIDEBAR ================= */}
      <aside
        className="
            hidden md:block
            fixed
            left-0
            top-[160px]
            h-[calc(100vh-160px)]
            w-72
            bg-[#0A3A73]
            overflow-y-auto
            z-40
          "
      >
        <Sidebar
          menu={sidebarMenu}
          sidebarClassName='w-72 bg-[#0A3A73]'
          itemClassName='text-md'
        />
      </aside>
      {/* 🔹 MOBILE HEADER (ALL PAGES) */}
      <div className="md:hidden">
        <ProfileHeaderCard {...profileData} />
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <main className="min-h-screen bg-white pb-20 md:ml-72">
        <div className="px-3 sm:px-4 md:px-6 lg:px-8">

          <div className="my-6 hidden sm:block">
            <HeaderSearch
              placeholder="Search"
              value=""
              className="w-full"
            />
          </div>


          {children}
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="w-full bg-white border-t relative z-50">
        <Footer />
      </footer>

    </div>
  );


}
