/**
 * Admin API Endpoints Configuration
 * All endpoints for the Admin module
 */
export const Admin_API_ENDPOINTS = {
  // ============================================
  // DASHBOARD
  // ============================================
  AdminKpi: '/Admin/AdminKpi',
  Dashboard: '/Admin/Dashboard',
  DashboardStats: '/Admin/Dashboard/Stats',

  // ============================================
  // USER MANAGEMENT
  // ============================================
  Users: {
    GET_ALL: '/Admin/Users',
    UPDATE_STATUS: '/Admin/Users/Status',
  },

  // ============================================
  // BADGE MANAGEMENT
  // ============================================
  Badges: {
    GET_ALL: '/Admin/Badges',
    GET_BY_ID: (id: string) => `/Admin/Badges/${id}`,
    CREATE: '/Admin/Badges',
    UPDATE: (id: string) => `/Admin/Badges/${id}`,
    DELETE: (id: string) => `/Admin/Badges/${id}`,
  },

  BadgeSubmissions: {
    GET_ALL: '/Admin/BadgeSubmissions',
    GET_PENDING: '/Admin/BadgeSubmissions/Pending',
    GET_BY_ID: (id: string) => `/Admin/BadgeSubmissions/${id}`,
    APPROVE: (id: string) => `/Admin/BadgeSubmissions/${id}/Approve`,
    REJECT: (id: string) => `/Admin/BadgeSubmissions/${id}/Reject`,
  },

  BadgeStatistics: '/Admin/BadgeStatistics',

  // ============================================
  // ACTIVITY LOGS
  // ============================================
  ActivityLogs: {
    GET_ALL: '/Admin/ActivityLogs',
    TODAY_COUNT: '/Admin/ActivityLogs/TodayCount',
    WEEK_COUNT: '/Admin/ActivityLogs/WeekCount',
  },

  // ============================================
  // PORTFOLIO ANALYTICS
  // ============================================
  Portfolio: {
    COMPLETION_STATS: '/Admin/Portfolio/CompletionStats',
    STATS_BY_CLASS: '/Admin/Portfolio/StatsByClass',
    STATS_BY_SUBJECT: '/Admin/Portfolio/StatsBySubject',
    RECENT_UPDATES: '/Admin/Portfolio/RecentUpdates',
  },

  // ============================================
  // TEACHER-SUBJECT ANALYTICS
  // ============================================
  TeacherSubjects: {
    MATRIX: '/Admin/TeacherSubjects/Matrix',
    ANALYTICS: '/Admin/TeacherSubjects/Analytics',
    BY_SUBJECT: '/Admin/TeacherSubjects/BySubject',
  },

  // ============================================
  // CPD MANAGEMENT
  // ============================================
  CPD: {
    STATISTICS: '/Admin/CPD/Statistics',
    TEACHER_PROGRESS: '/Admin/CPD/TeacherProgress',
    BY_MONTH: '/Admin/CPD/ByMonth',
    CATEGORIES: '/Admin/CPD/Categories',
    EXPORT: '/Admin/CPD/Export',
  },

  // ============================================
  // REPORTS
  // ============================================
  Reports: {
    GENERATE: '/Admin/Reports/Generate',
    EXPORT: '/Admin/Reports/Export',
    SCHEDULE: '/Admin/Reports/Schedule',
  },

  // ============================================
  // EVIDENCE COLLECTION (ADEK)
  // ============================================
  Evidence: {
    STATS: '/Admin/Evidence/Stats',
    EXPORT: '/Admin/Evidence/Export',
    GET_EXPORT_STATUS: (exportId: string) => `/Admin/Evidence/Export/${exportId}`,
  },

  // ============================================
  // ANNOUNCEMENTS
  // ============================================
  Announcements: {
    GET_ALL: '/Admin/Announcements',
    GET_BY_ID: (id: string) => `/Admin/Announcements/${id}`,
    CREATE: '/Admin/Announcements',
    UPDATE: (id: string) => `/Admin/Announcements/${id}`,
    DELETE: (id: string) => `/Admin/Announcements/${id}`,
  },

  // ============================================
  // WEEKLY CHALLENGES
  // ============================================
  WeeklyChallenges: {
    GET_ALL: '/Admin/WeeklyChallenges',
    GET_BY_ID: (id: string) => `/Admin/WeeklyChallenges/${id}`,
    CREATE: '/Admin/WeeklyChallenges',
    UPDATE: (id: string) => `/Admin/WeeklyChallenges/${id}`,
    DELETE: (id: string) => `/Admin/WeeklyChallenges/${id}`,
    PUBLISH: (id: string) => `/Admin/WeeklyChallenges/${id}/Publish`,
  },

  // ============================================
  // SYSTEM SETTINGS
  // ============================================
  Settings: {
    GET_ALL: '/Admin/Settings',
    UPDATE: '/Admin/Settings',
  },

  SystemLogs: '/Admin/SystemLogs',
} as const;
