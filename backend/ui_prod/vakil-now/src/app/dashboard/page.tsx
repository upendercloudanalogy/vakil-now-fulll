'use client';

import { Card } from '@/components/ui/card';
import { Icons } from '../../lib/icons/index';
import { UserGrowthChart } from '@/components/common/growthGraph';
import { PieChart } from '@/components/common/pieChart';
import { CustomDatePicker } from '@/components/common/customDatePicker';
import React, { useEffect } from 'react';
import { DataTable } from '@/components/common/customTable';
import {
  supportedIcons,
  columns,
  quickActions
} from '@/components/pages/admin/dashboard/constants/index';
import DashboardHeader from '../../components/pages/admin/dashboard/components/DashboardHeader';
import DashboardCardLists from '../../components/pages/admin/dashboard/components/DashboardCards';
import LawyerRequestLists from '../../components/pages/admin/dashboard/components/lawyerRequests';
import BookedConsultaionsLists from '../../components/pages/admin/dashboard/components/BookedConsultaions';
import SupportAndConsultaionsLists from '../../components/pages/admin/dashboard/components/supportAndCompalints';
import QuickActionsLists from '../../components/pages/admin/dashboard/components/quickActions';
import SummaryInfoLists from '../../components/pages/admin/dashboard/components/summaryLists';
import SectionHeadingWithLink from '../../components/pages/admin/dashboard/components/SectionHeading';
import { ROUTES } from '@/lib/routes';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import {
  adminDashboardCardDetails,
  adminDashboardUserLawyerGrowthData,
  fetchLawyersRequests,
  fetchOpenTickets
} from '../../../redux/slices/admin/adminThunk';
import { useSocket } from '../../../sockets/SocketContext';

const data = [
  {
    service: 'RTI',
    client: 'Raj Mehta',
    lawyer: 'Suraj Chaudhary',
    status: 'Pending',
    requestedOn: '17 Oct 2025'
  },
  {
    service: 'Service 2',
    client: 'Suraj Chaudhary',
    lawyer: 'Raj Mehta',
    status: 'In progress',
    requestedOn: '15 Oct 2025'
  }
];
const pieData = [
  {
    label: 'Admin',
    value: 64,
    color: 'rgb(79,195,247)'
  },
  {
    label: 'Advocate',
    value: 36,
    color: 'rgb(21,101,192)'
  }
];

const summaryItems = [
  {
    icon: supportedIcons.greenCheckIcon,
    name: 'Resolved',
    number: 63
  },
  {
    icon: supportedIcons.yellowCheckIcon,
    name: 'In Progress',
    number: 63
  },
  {
    icon: supportedIcons.checkIcon,
    name: 'New Requests',
    number: 63
  }
];
const lawyerRequests = [
  {
    id: 1,
    name: 'Nicola Patrics',
    image: '/image.png'
  },
  {
    id: 2,
    name: 'Nicola Patrics',
    image: '/image.png'
  }
];
const totalRevenueAmount = 50285;
const bookedConsultations = [
  {
    id: 1,
    name: 'Rupraj Banerjee',
    role: 'Lawyer',
    image: '/image.png'
  },
  {
    id: 2,
    name: 'Rupraj Banerjee',
    role: 'Lawyer',
    image: '/image.png'
  }
];

export default function Dashboard() {
  const [date, setDate] = React.useState<Date | undefined>();
  const socket = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on('new_lawyer_onboarding_request', (data) => {
        console.log("📢 Admin Notification:", data);
      });
    }
    return () => { socket?.off('new_lawyer_onboarding_alert'); };
  }, [socket]);


  const dispatch = useAppDispatch();
  const {
    dashboardCardDetails,
    graphData,
    newTickets,
    pendingTickets,
    inProgressTickets,
    resolvedTickets
  } = useAppSelector((state) => state.adminDashboardSlice);

  useEffect(() => {
    Promise.all([
      dispatch(adminDashboardCardDetails()),
      dispatch(adminDashboardUserLawyerGrowthData()),
      dispatch(fetchOpenTickets()),
      dispatch(fetchLawyersRequests())
    ]);
  }, [dispatch]);

  const supportItems = [
    {
      icon: supportedIcons.plusCircle,
      name: 'New Tickets',
      number: newTickets
    },
    {
      icon: supportedIcons.orangeCheckIcon,
      name: 'Pending',
      number: pendingTickets
    },
    {
      icon: supportedIcons.yellowCheckIcon,
      name: 'In Progress',
      number: inProgressTickets
    },
    {
      icon: supportedIcons.greenCheckIcon,
      name: 'Resolved',
      number: resolvedTickets
    }
  ];

  const dashboardCards = [
    {
      title: 'Total Lawyers',
      value: dashboardCardDetails.totalLawyers,
      icon: Icons.LawyerIcon,
      href: ROUTES.admin.dashboard.lawyers
    },
    {
      title: 'Total Users',
      value: dashboardCardDetails.totalUsers,
      icon: Icons.UserIconAdmin,
      href: ROUTES.admin.dashboard.users
    },
    {
      title: 'All Services',
      value: dashboardCardDetails.totalServices,
      icon: Icons.DocumentIcon,
      href: ROUTES.admin.dashboard.services
    },
    {
      title: 'Active Packages',
      value: dashboardCardDetails.totalActivePackages,
      icon: Icons.WalletIcon,
      href: ROUTES.admin.dashboard.packages
    }
  ];
  return (
    <div className='flex flex-col gap-6 md:gap-8 w-full h-full overflow-x-hidden justify-between'>
      <DashboardHeader />

      <DashboardCardLists dashboardCards={dashboardCards} />

      <Card className='p-0 w-full px-4 md:px-8 md:flex-row border-0 justify-betweeen'>
        {/* md:66vw // we can use here if flex-1 is crashing when name longs  */}
        <Card className='p-0 m-0 border-0 flex-1'>
          <UserGrowthChart data={graphData} className='rounded-[4px]' />
          <Card className='rounded-[4px] p-3 sm:p-4 md:p-5 w-full border-[rgb(101,202,248)] gap-4 flex-1'>
            <SectionHeadingWithLink
              title='Lawyer Request'
              className=' md:text-[rgb(89,89,89)]'
              linkName='View All Requests'
              href={ROUTES.admin.dashboard.lawyerRequests}
            />
            <LawyerRequestLists lawyerRequests={lawyerRequests} />
          </Card>
        </Card>
        <Card className='p-0 m-0 border-0 justify-between'>
          <Card className='rounded-[4px]  p-3 sm:p-4 md:p-5 w-full border-[rgb(101,202,248)] flex-1 justify-evenly md:gap-0 gap-3'>
            <Card className='flex-row justify-between p-0 m-0 gap-0  border-0'>
              <SectionHeadingWithLink
                title='Revenue'
                className='!font-semibold'
              />
              <Card
                className='
                p-0 m-0 border-0
                font-inter font-semibold
                h-full 
                text-lg          
                sm:text-lg         
                md:text-xl         
                lg:text-2xl         
                xl:text-3xl
                text-[rgb(71,176,222)] '>
                ₹{totalRevenueAmount}
              </Card>
            </Card>
            <PieChart
              data={pieData}
              pieClassName='!w-[70px] !h-[70px] md:!w-[105px] md:!h-[105px]'
            />
          </Card>
          <Card className='gap-3 rounded-[4px] p-3 sm:p-4 md:p-5 w-full border-[rgb(101,202,248)] flex-1 justify-evenly'>
            <SectionHeadingWithLink
              title='Booked Consultaions'
              className='md:text-[rgb(89,89,89)] 
                md:whitespace-nowrap flex-shrink-0'
              linkName='View All'
              href={ROUTES.admin.dashboard.bookedConsultations}
            />
            <CustomDatePicker
              height={'40px'}
              value={date}
              onChange={setDate}
              className='!p-0 m-0 border-[rgb(101,202,248)]'
            />
            <BookedConsultaionsLists
              bookedConsultations={bookedConsultations}
            />
          </Card>
        </Card>
      </Card>

      <Card className='p-0 px-4 md:px-8 md:flex-row border-0 justify-between'>
        <Card className='gap-3 rounded-[4px] p-3 sm:p-4 md:p-5  border-[rgb(101,202,248)] flex-1'>
          <Card className='justify-between p-0 m-0 border-0'>
            <SectionHeadingWithLink
              title='Support & Compalints'
              className='md:text-[rgb(89,89,89)]'
              linkName='View All'
              href={ROUTES.admin.dashboard.supportAndComplaints}
            />
          </Card>
          <SupportAndConsultaionsLists supportItems={supportItems} />
        </Card>

        <Card className='gap-3 rounded-[4px] p-3 sm:p-4 md:p-5 border-[rgb(101,202,248)]'>
          <Card className='justify-between p-0 m-0 border-0'>
            <SectionHeadingWithLink
              title='Quick Actions'
              className='
              md:text-[rgb(89,89,89)]  '
            />
          </Card>
          <QuickActionsLists quickActions={quickActions} />
        </Card>

        <Card className='gap-3 rounded-[4px] p-3 sm:p-4 md:p-5 border-[rgb(101,202,248)]'>
          <Card className='justify-between p-0 m-0 border-0'>
            <SectionHeadingWithLink
              title='Services Summary'
              className=' 
              md:text-[rgb(89,89,89)] '
            />
          </Card>
          <SummaryInfoLists summaryItems={summaryItems} />
        </Card>
      </Card>

      <Card className='w-full px-4 md:px-8 pt-0 md:flex-row border-0'>
        <DataTable
          title={'Services & Consultation Management'}
          columns={columns}
          data={data}
          linkHref={ROUTES.admin.dashboard.servicesAndConsultations}
          linkText='View Details'
          borderColor='border-[rgb(101,202,248)]'
          className='flex-1 overflow-auto'
        />
      </Card>
    </div>
  );
}
