'use client';
import { SectionHeading } from "@/components/common/sectionHeading";
import {
  mockConsultations,
  mockSubscriptions,
  mockSupportTickets,
  mockTrackServices
} from "@/components/pages/customer/dashboard/constant";
import { WalletOverview } from "@/components/pages/customer/dashboard/DashboardInfoCards";
import { Subscriptions } from "@/components/pages/customer/dashboard/subscriptions";
import SupportComplaints from "@/components/pages/customer/dashboard/supportAndComplaints";
import { TrackServices } from "@/components/pages/customer/dashboard/trackServices";
import { UpcomingConsultation } from "@/components/pages/customer/dashboard/upcomingConsultation";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hook";
import { getUserProfile } from "../../../../../redux/slices/customer/customerThunk";
import { ProfileHeaderCard } from "./profileHeader";

export default function DashboardPage () {
  const dispatch = useAppDispatch();
  const { profile, loading } = useAppSelector((state) => state.userReducer);

  useEffect(() => {
    dispatch(getUserProfile());
  }, []);
  const profileData = {
    imageUrl: profile?.profileImage || "",
    companyName: profile?.companyName || "Company Name",
    fullName: profile?.name || "User Name",
    dateLabel: profile?.createdAt || "",
    email: profile?.email || "email@gmail.com",
    phone: profile?.phone ? `+91 ${profile.phone}` : "-",
    address: profile?.address || "India",
    language: "Eng",
  };
  return (
    <>


      <div className="mb-4">

        <SectionHeading
          title='Dashboard'
          fontSize='text-[32px]'
          fontWeight='font-bold'
          color='text-[#1565C0]'
          padding='p-0'
          margin='m-0'
          font='sans'
          className='tracking-tight text-[24px] md:text-[32px]  sm:text-[#1565C0] '
        />
      </div>

      <div className="pb-4 hidden md:block rounded">
        <ProfileHeaderCard {...profileData} />
      </div>

      <div className='pb-4'>
        <WalletOverview />
      </div>

      <div className='pb-4 flex flex-col md:flex-row gap-4 items-stretch'>
        {' '}
        {/* Add items-stretch */}
        <div className='w-full md:flex-6 flex'>
          <TrackServices
            className='flex-1 sm:bg-[#EDF9FE] sm:border sm:border-[#4FC3F7]'
            services={mockTrackServices}
          />
        </div>
        <div className='w-full md:flex-4 flex'>
          <UpcomingConsultation
            consultations={mockConsultations}
            className='sm:bg-[#EDF9FE] sm:border sm:border-[#4FC3F7] flex-1' // Add flex-1
          />
        </div>
      </div>

      <div className='pb-4 grid grid-cols-1 md:grid-cols-2 gap-4'>
        <Subscriptions subscriptions={mockSubscriptions} />
        <SupportComplaints
          tickets={mockSupportTickets}
          className='sm:border border-[#4FC3F7]'
        />
      </div>
    </>
  );
}
