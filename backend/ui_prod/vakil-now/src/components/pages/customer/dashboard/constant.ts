import { SidebarItem } from '@/components/common/sidebar/interfaces/interface';
import { Icons } from '@/lib/icons';
import { ROUTES } from '@/lib/routes';
import { Clock, CreditCard, FileText, Scale } from 'lucide-react';
import { TrackService } from './interfaces';

// -------------------
// Profile Data
// -------------------
export const profileData = {
  imageUrl: '/api/placeholder/112/112',
  companyName: 'Company Name',
  fullName: 'H. User name',
  dateLabel: 'Today, 20 November 2025',
  email: 'masdasd@gmail.com',
  phone: '+91 XXXXX XXXXX',
  address: 'India',
  language: 'Eng'
};

// -------------------
// Sidebar Menu
// -------------------
export const sidebarMenu: SidebarItem[] = [
  { label: "Dashboard", icon: Clock, href: ROUTES.customer.dashboard.sidebar.dashboard },
  { label: "Services", icon: Icons.NotificationIcon, href: ROUTES.customer.service.index },
  { label: "Documents", icon: FileText, href: ROUTES.customer.dashboard.sidebar.documents },
  { label: "Wallet", icon: CreditCard, href: ROUTES.customer.dashboard.sidebar.wallet },
  { label: "Announcement", icon: CreditCard, href: ROUTES.customer.dashboard.sidebar.announcements },
  { label: "Consulatation", icon: Scale, href: ROUTES.customer.dashboard.sidebar.consultations },
  { label: "Subcriptions", icon: CreditCard, href: ROUTES.customer.dashboard.sidebar.subscriptions },
  { label: "Support", icon: CreditCard, href: ROUTES.customer.dashboard.sidebar.support },
];

// -------------------
// Track Services
// -------------------

export const mockTrackServices: TrackService[] = [
  {
    date: '14/10/2025',
    title: 'Trademark Registration',
    currentStep: 2,
    totalSteps: 4,
    activeColor: 'bg-green-500',
    pendingColor: 'bg-gray-300'
  },
  {
    date: '10/09/2025',
    title: 'Company Incorporation',
    currentStep: 3,
    totalSteps: 5,
    activeColor: 'bg-blue-500',
    pendingColor: 'bg-gray-300'
  }
];

// -------------------
// Subscriptions
// -------------------
export const mockSubscriptions = [
  {
    title: 'Trademark Registration',
    status: 'Completed',
    price: 1999,
    badge: { text: 'New', variant: 'destructive' as const }
  },
  {
    title: 'Trademark Registration',
    status: 'Completed',
    price: 1999,
    badge: { text: 'Active', variant: 'default' as const }
  }
];

// -------------------
// Upcoming Consultations
// -------------------
export const mockConsultations = [
  {
    name: 'Nicholas Patrick',
    date: '22/12/2025 11:00 AM',
    avatarUrl: '/placeholder-avatar.jpg',
    initials: 'NP'
  },
  {
    name: 'John',
    date: '17/12/2025 11:00 AM',
    avatarUrl: '/placeholder-avatar.jpg',
    initials: 'NP'
  },
  {
    name: 'Sophia Lee',
    date: '23/11/2025 02:30 PM',
    avatarUrl: '/placeholder-avatar2.jpg',
    initials: 'SL'
  }
];

// -------------------
// Support & Complaints
// -------------------
export const mockSupportTickets = [
  { variant: 'pending' as const, label: 'Pending', count: 63 },
  { variant: 'resolved' as const, label: 'Resolved', count: 12 },
  { variant: 'inProgress' as const, label: 'In Progress', count: 42 },
  { variant: 'new' as const, label: 'New Tickets' }
];
