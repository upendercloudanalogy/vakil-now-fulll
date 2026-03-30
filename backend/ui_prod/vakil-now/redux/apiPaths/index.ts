export const API_PATHS = {
    AUTH: {
        SIGNUP: '/auth/signupByPhone',
        VERIFY_OTP: '/auth/verifyOtp',
        REFRESH_TOKEN: '/auth/refreshInPhone',
        LOGOUT: '/auth/logout',
    },
    USER: {
        ME: '/user/me',
    },
    ADMIN: {
        DASHBOARD_CARDS: '/admin/dashboard-card-details',
        GROWTH_GRAPH: '/admin/growth-graph-data',
        SUPPORT_COUNTS: '/admin/support-tickets-counts',
        LAWYER_REQUESTS: '/admin/lawyer-requests',
    },
    LAWYER_ONBOARDING: {
        IDENTITY: '/lawyer/onboarding/identity',
        PROFESSIONAL: '/lawyer/onboarding/professional',
        EXPERTISE: '/lawyer/onboarding/expertise',
        FEEDBACK: '/lawyer/onboarding/feedback',
        FULL_DATA: '/lawyer/onboarding/data',
    },
    LLP: {
        MY_LLPS: '/llp/my',
        CHECK_NAME: '/llp/check-name',
        NAME_FINALIZATION: '/llp/name-finalization',
        SAVE_PARTNERS: '/llp/create/partners',
        UPDATE_LLP: '/llp/update',
        // For dynamic paths, we use a function
        ESIGN: (llpId: string) => `/llp/${llpId}/esign`,
    },
    SUPPORT: {
        CLOSED_TICKETS: '/support-complaints/getClosedTickets',
        OPEN_TICKETS: '/support-complaints/getOpenTickets',
        RAISE_TICKET: '/support-complaints/raise-ticket',
    },
    ANNOUNCEMENTS: {
        BASE: '/announcements',
        MARK_ALL_READ: '/announcements/mark-all-read',
    },
} as const;