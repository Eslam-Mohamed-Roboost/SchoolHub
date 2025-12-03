export const User_API_ENDPOINTS = {
  GET_ALL: '/User/GetUsers',
  GET_BY_ID: (id: string) => `/user/${id}`,
  CREATE: '/user/register',
  UPDATE: (id: string) => `/user/${id}`,
  DELETE: (id: string) => `/user/${id}`,
} as const;
