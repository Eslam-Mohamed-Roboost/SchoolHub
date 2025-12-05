/**
 * User API Endpoints Configuration
 */
export const User_API_ENDPOINTS = {
  // ============================================
  // USER CRUD
  // ============================================
  GET_ALL: '/User/GetUsers',
  GET_BY_ID: (id: string) => `/User/${id}`,
  CREATE: '/User/Register',
  UPDATE: (id: string) => `/User/${id}`,
  DELETE: (id: string) => `/User/${id}`,

  // ============================================
  // BULK OPERATIONS
  // ============================================
  BULK_IMPORT: '/User/BulkImport',
  EXPORT: '/User/Export',

  // ============================================
  // SEARCH & FILTER
  // ============================================
  SEARCH: '/User/Search',
} as const;
