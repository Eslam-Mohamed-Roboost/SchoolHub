/**
 * Teacher Assignment Models
 * Matches backend DTOs for teacher-class-subject assignments
 */

export interface ClassSubjectAssignment {
  ClassId: string; // Backend: long -> Frontend: string
  SubjectId: string; // Backend: long -> Frontend: string
}

export interface TeacherAssignmentInfo {
  Id: string; // Backend: long -> Frontend: string
  ClassId: string; // Backend: long -> Frontend: string
  ClassName: string;
  Grade: number;
  SubjectId: string; // Backend: long -> Frontend: string
  SubjectName: string;
  AssignedAt: string; // ISO date string
}

export interface TeacherAssignmentResponse {
  AssignmentsCreated: number;
  Errors: string[];
}

export interface TeacherAssignmentRequest {
  Assignments: ClassSubjectAssignment[];
}

