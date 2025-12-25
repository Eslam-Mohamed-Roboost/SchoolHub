export type LetterGrade = 'A' | 'B' | 'C' | 'D' | 'F';
export type GradeStatus = 'Draft' | 'PendingApproval' | 'Approved' | 'Rejected';

export interface Grade {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  exerciseId?: string;
  exerciseTitle?: string;
  examinationId?: string;
  examinationTitle?: string;
  score: number;
  maxScore: number;
  percentage: number;
  letterGrade?: LetterGrade;
  term?: string;
  year: number;
  gradedBy: string;
  graderName: string;
  gradedAt: Date;
  status: GradeStatus;
  approvedBy?: string;
  approverName?: string;
  approvedAt?: Date;
  notes?: string;
}

export interface CreateGradeRequest {
  studentId: string;
  classId: string;
  subjectId: string;
  exerciseId?: string;
  examinationId?: string;
  score: number;
  maxScore: number;
  term?: string;
  year: number;
  notes?: string;
}

export interface UpdateGradeRequest {
  score?: number;
  maxScore?: number;
  term?: string;
  year?: number;
  notes?: string;
}

export interface GradeApprovalRequest {
  approve: boolean;
  notes?: string;
}

export interface GradeSummary {
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  totalStudents: number;
  gradedStudents: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  gradeDistribution: Record<string, number>; // LetterGrade -> Count
  term?: string;
  year: number;
}

