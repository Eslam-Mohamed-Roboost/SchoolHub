export interface Attendance {
  Id: string;
  StudentId: string;
  StudentName: string;
  ClassId: string;
  ClassName: string;
  AttendanceDate: string;
  Status: 'Present' | 'Absent' | 'Late' | 'Excused';
  MarkedBy?: string;
  MarkedByName?: string;
  MarkedAt?: string;
  IsAutomatic: boolean;
  Notes?: string;
}

export interface ClassAttendance {
  Date: string;
  ClassId: string;
  ClassName: string;
  Students: Attendance[];
  PresentCount: number;
  AbsentCount: number;
  LateCount: number;
  ExcusedCount: number;
  TotalStudents: number;
}

export interface StudentAttendanceEntry {
  StudentId: string;
  Status: 'Present' | 'Absent' | 'Late' | 'Excused';
  Notes?: string;
}

export interface MarkAttendanceRequest {
  AttendanceDate: string;
  Students: StudentAttendanceEntry[];
}

export interface BulkMarkAttendanceRequest {
  AttendanceDate: string;
  ClassId: string;
  Status: 'Present' | 'Absent' | 'Late' | 'Excused';
  StudentIds: string[];
  Notes?: string;
}

export interface UpdateAttendanceRequest {
  Status: 'Present' | 'Absent' | 'Late' | 'Excused';
  Notes?: string;
}

