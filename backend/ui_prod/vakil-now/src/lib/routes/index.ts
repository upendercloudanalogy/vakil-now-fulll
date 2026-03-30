export const ROUTES = {
  customer: {
    dashboard: {
      index: '/customer/dashboard',
      trackServices: 'dashboard/track-services',
      consultations: 'dashboard/consultations',
      subscriptions: 'dashboard/subscriptions',
      supportComplaints: 'dashboard/support-complaints',
      profile: 'dashboard/profile',
      settings: 'dashboard/settings',

      // ----------------------------------------
      // SIDEBAR ROUTES (Left Sidebar)
      // ----------------------------------------
      sidebar: {
        dashboard: "/customer/dashboard",
        services: "/customer/dashboard/track-services",
        documents: "/customer/dashboard/documents",
        wallet: "/customer/dashboard/wallet",
        cases: "/customer/dashboard/cases",
        announcements:"/customer/dashboard/announcement",
        consultations:"/customer/dashboard/consultations",
        subscriptions:"/customer/dashboard/subscriptions",
        support:"/customer/dashboard/support-complaints",
      },

      // ----------------------------------------
      // NAVBAR ROUTES (Top Navigation)
      // ----------------------------------------
      navbar: {
        dashboard: '/dashboard',
        services: '/services',
        pricing: '/pricing',
        contact: '/contact'
      }
    },
    service: {
      index: '/customer/services'
    }
  },

  auth: {
    login: '/login',
    register: '/register',
    forgotPassword: '/forgot-password'
  },

  admin: {
    dashboard: {
      index: '/dashboard',
      lawyers: '/dashboard/lawyers',
      users: '/dashboard/users',
      services: '/dashboard/services',
      packages: '/dashboard/packages',
      lawyerRequests: '/dashboard/lawyer-requests',
      bookedConsultations: '/dashboard/booked-consultaions',
      supportAndComplaints: '/dashboard/support-and-compalints',
      servicesAndConsultations: '/dashboard/services-consultation',
      lawyerRequestDetails: '/dashboard/lawyer-requests/details'
    }
  },


  lawer:{
    onboarding:{
      index:"/lawyer/onboarding"
    }
  },

  // Public pages
  services: '/services',
  pricing: '/pricing',
  about: '/about',
  contact: '/contact'
} as const;

// ----------------------------------------
// Generate deep type for all route strings
// ----------------------------------------
type RoutesObject = typeof ROUTES;

export type RouteString<T> = T extends string
  ? T
  : T extends object
    ? { [K in keyof T]: RouteString<T[K]> }[keyof T]
    : never;

export type AllRoutes = RouteString<RoutesObject>;

// Optional helper
export const navigateTo = (route: AllRoutes) => route;
