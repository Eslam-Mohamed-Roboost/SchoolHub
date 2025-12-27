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
    MODULE_DETAIL: (id: string) => `/Teacher/Cpd/Modules/${id}`,
    START_MODULE: (id: string) => `/Teacher/Cpd/Modules/${id}/Start`,
    COMPLETE_MODULE: (id: string) => `/Teacher/Cpd/Modules/${id}/Complete`,
    UPDATE_STATUS: (id: string) => `/Teacher/Cpd/Modules/${id}/Status`,
    UPLOAD_EVIDENCE: (id: string) => `/Teacher/Cpd/Modules/${id}/Evidence`,
    PROGRESS: '/Teacher/Cpd/Progress',
    HOURS: '/Teacher/CPD/Hours',
    HOURS_SUMMARY: '/Teacher/CPD/Hours/Summary',
  },

  // ============================================
  // PORTFOLIO
  // ============================================
  Portfolio: {
    MY_STUDENTS: '/Teacher/Portfolio/MyStudents',
    MY_SUBJECTS: '/Teacher/Portfolio/MySubjects',
    STUDENT_DETAIL: (studentId: string, subjectId: string) => 
      `/Teacher/Portfolio/Student/${studentId}/${subjectId}`,
    ADD_COMMENT: (studentId: string, subjectId: string) => 
      `/Teacher/Portfolio/Student/${studentId}/${subjectId}/Comment`,
    TOGGLE_LIKE: (studentId: string, subjectId: string) => 
      `/Teacher/Portfolio/Student/${studentId}/${subjectId}/ToggleLike`,
    REQUEST_REVISION: (studentId: string, subjectId: string) => 
      `/Teacher/Portfolio/Student/${studentId}/${subjectId}/RequestRevision`,
    AWARD_BADGE: (studentId: string, subjectId: string) => 
      `/Teacher/Portfolio/Student/${studentId}/${subjectId}/AwardBadge`,
    REVIEW: (fileId: number) => `/Teacher/Portfolio/Review/${fileId}`,
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

  // ============================================
  // MISSIONS
  // ============================================
  Missions: {
    GET_ALL: '/Teacher/Missions',
    GET_DETAIL: (missionId: string) => `/Teacher/Missions/${missionId}`,
    GET_PROGRESS: '/Teacher/Missions/Progress',
    START: (missionId: string) => `/Teacher/Missions/${missionId}/Start`,
    UPDATE_PROGRESS: (missionId: string) => `/Teacher/Missions/${missionId}/Progress`,
  },

  // ============================================
  // ATTENDANCE
  // ============================================
  Attendance: {
    GET_CLASS_ATTENDANCE: (classId: string, date: string) => 
      `/Teacher/Classes/${classId}/Attendance/${date}`,
    MARK_ATTENDANCE: (classId: string) => `/Teacher/Classes/${classId}/Attendance`,
    BULK_MARK: (classId: string) => `/Teacher/Classes/${classId}/Attendance/Bulk`,
    UPDATE: (attendanceId: string) => `/Teacher/Attendance/${attendanceId}`,
    PROCESS_AUTOMATIC: (classId: string) => `/Teacher/Classes/${classId}/Attendance/ProcessAutomatic`,
  },

  // ============================================
  // TEACHERS LOUNGE
  // ============================================
  Lounge: {
    GET: '/Teacher/Lounge',
    GET_ANNOUNCEMENTS: '/Teacher/Lounge/Announcements',
  },

  // ============================================
  // PORTFOLIO BOOK (Map Score & Exact Path)
  // ============================================
  PortfolioBook: {
    GET_STUDENT: (studentId: string, subjectId: string) =>
      `/Teacher/PortfolioBook/Student/${studentId}/${subjectId}`,
    UPDATE_MAP_SCORE: '/Teacher/PortfolioBook/MapScore',
    UPDATE_EXACT_PATH: '/Teacher/PortfolioBook/ExactPath',
  },
} as const;

