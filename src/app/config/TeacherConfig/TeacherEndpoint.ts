/**
 * Teacher API Endpoints Configuration
 * All endpoints for the Teacher module
 */
export const Teacher_API_ENDPOINTS = {
  // ============================================
  // DASHBOARD
  // ============================================
  Dashboard: '/Teacher/Dashboard',

  // ============================================
  // CPD (Continuous Professional Development)
  // ============================================
  CPD: {
    MODULES: '/Teacher/Cpd/Modules',
    MODULE_DETAIL: (id: number) => `/Teacher/Cpd/Modules/${id}`,
    START_MODULE: (id: number) => `/Teacher/Cpd/Modules/${id}/Start`,
    COMPLETE_MODULE: (id: number) => `/Teacher/Cpd/Modules/${id}/Complete`,
    PROGRESS: '/Teacher/Cpd/Progress',
    HOURS: '/Teacher/CPD/Hours',
    HOURS_SUMMARY: '/Teacher/CPD/Hours/Summary',
  },

  // ============================================
  // PORTFOLIO
  // ============================================
  Portfolio: {
    MY_STUDENTS: '/Teacher/Portfolio/MyStudents',
    STUDENT_DETAIL: (studentId: number, subjectId: number) => 
      `/Teacher/Portfolio/Student/${studentId}/Subject/${subjectId}`,
    REVIEW: (fileId: number) => `/Teacher/Portfolio/Review/${fileId}`,
    REQUEST_REVISION: (fileId: number) => `/Teacher/Portfolio/RequestRevision/${fileId}`,
    BADGES: '/Teacher/Portfolio/Badges',
  },

  // ============================================
  // CLASSES
  // ============================================
  Classes: {
    GET_MY_CLASSES: '/Teacher/Classes',
    GET_CLASS_STUDENTS: (classId: string) => `/Teacher/Classes/${classId}/Students`,
  },

  // ============================================
  // EXERCISES
  // ============================================
  Exercises: {
    GET_ALL: '/Teacher/Exercises',
    GET_BY_ID: (id: string) => `/Teacher/Exercises/${id}`,
    CREATE: '/Teacher/Exercises',
    UPDATE: (id: string) => `/Teacher/Exercises/${id}`,
    DELETE: (id: string) => `/Teacher/Exercises/${id}`,
    GET_SUBMISSIONS: (id: string) => `/Teacher/Exercises/${id}/Submissions`,
    GRADE_SUBMISSION: (id: string) => `/Teacher/Exercises/${id}/Grade`,
  },

  // ============================================
  // EXAMINATIONS
  // ============================================
  Examinations: {
    GET_ALL: '/Teacher/Examinations',
    GET_BY_ID: (id: string) => `/Teacher/Examinations/${id}`,
    CREATE: '/Teacher/Examinations',
    UPDATE: (id: string) => `/Teacher/Examinations/${id}`,
    DELETE: (id: string) => `/Teacher/Examinations/${id}`,
    GET_ATTEMPTS: (id: string) => `/Teacher/Examinations/${id}/Attempts`,
    GRADE_ATTEMPT: (id: string) => `/Teacher/Examinations/${id}/Grade`,
  },

  // ============================================
  // GRADES
  // ============================================
  Grades: {
    GET_ALL: '/Teacher/Grades',
    GET_STUDENT_GRADES: (studentId: string) => `/Teacher/Grades/Student/${studentId}`,
    CREATE: '/Teacher/Grades',
    UPDATE: (id: string) => `/Teacher/Grades/${id}`,
    APPROVE: (id: string) => `/Teacher/Grades/${id}/Approve`,
    GET_SUMMARY: '/Teacher/Grades/Summary',
  },
} as const;

