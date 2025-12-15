/**
 * Student API Endpoints Configuration
 * All endpoints for the Student Portal module
 */
export const Student_API_ENDPOINTS = {
  // ============================================
  // PORTFOLIO MANAGEMENT
  // ============================================
  Portfolio: {
    OVERVIEW: '/Student/Portfolio/Overview',
    SUBJECT: (subjectId: string) => `/Student/Portfolio/Subject/${subjectId}`,
    UPLOAD: '/Student/Portfolio/Upload',
    DELETE_FILE: (fileId: string) => `/Student/Portfolio/File/${fileId}`,
    SAVE_REFLECTION: '/Student/Portfolio/Reflection',
    FEEDBACK: (subjectId: string) => `/Student/Portfolio/Feedback/${subjectId}`,
  },

  // ============================================
  // MISSIONS
  // ============================================
  Missions: {
    GET_ALL: '/Student/Missions',
    // Accept both string and number to support large IDs safely
    GET_BY_ID: (missionId: string | number) => `/Student/Missions/${missionId}`,
    UPDATE_PROGRESS: (missionId: string | number) => `/Student/Missions/${missionId}/Progress`,
  },

  // ============================================
  // BADGES
  // ============================================
  Badges: {
    GET_ALL: '/Student/Badges',
    AWARD: '/Student/Badges/Award',
  },

  // ============================================
  // CHALLENGE ZONE
  // ============================================
  Challenges: {
    GET_ACTIVE: '/Student/Challenges/Active',
    JOIN: (challengeId: number) => `/Student/Challenges/${challengeId}/Join`,
    SUBMIT: (challengeId: number) => `/Student/Challenges/${challengeId}/Submit`,
  },

  // ============================================
  // PROGRESS TRACKING
  // ============================================
  Progress: {
    GET: '/Student/Progress',
  },

  // ============================================
  // DIGITAL NOTEBOOK
  // ============================================
  Notebook: {
    GET_ALL: '/Student/Notebook',
    SAVE: '/Student/Notebook',
    DELETE: (entryId: string) => `/Student/Notebook/${entryId}`,
  },

  // ============================================
  // DASHBOARD
  // ============================================
  Dashboard: {
    GET: '/Student/Dashboard',
  },

  // ============================================
  // NOTIFICATIONS
  // ============================================
  Notifications: {
    GET_ALL: '/Student/Notifications',
    MARK_READ: (notificationId: number) => `/Student/Notifications/${notificationId}/Read`,
  },

  // ============================================
  // GOAL MANAGEMENT
  // ============================================
  Goals: {
    GET_ALL: '/Student/Goals',
    CREATE: '/Student/Goals',
    UPDATE_PROGRESS: (goalId: number) => `/Student/Goals/${goalId}/Progress`,
  },

  // ============================================
  // ACTIVITY & POINTS
  // ============================================
  Activity: {
    GET_STREAK: '/Student/Activity/Streak',
  },

  Points: {
    GET_SUMMARY: '/Student/Points',
    AWARD: '/Student/Points/Award',
  },
} as const;
