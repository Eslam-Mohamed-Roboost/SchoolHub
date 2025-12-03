export const APP_CONSTANTS = {
  APP_NAME: 'School Hub',
  DEFAULT_PAGE_SIZE: 10,
  MAX_FILE_SIZE: 5242880, // 5MB
  DEBOUNCE_TIME: 300,
  DATE_FORMAT: 'yyyy-MM-dd',
  DATETIME_FORMAT: 'yyyy-MM-dd HH:mm:ss',
} as const;

export const ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
  },
  DASHBOARD: '/dashboard',
  CUSTOMERS: {
    LIST: '/customers',
    DETAILS: (id: string | number) => `/customers/${id}`,
    CREATE: '/customers/create',
    EDIT: (id: string | number) => `/customers/${id}/edit`,
  },
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
  CUSTOMERS: {
    BASE: '/customers',
    BY_ID: (id: string | number) => `/customers/${id}`,
  },
} as const;
