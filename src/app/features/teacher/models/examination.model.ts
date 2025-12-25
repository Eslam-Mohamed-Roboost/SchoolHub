export type ExaminationType = 'Quiz' | 'Test' | 'Exam';
export type ExaminationStatus = 'Draft' | 'Scheduled' | 'InProgress' | 'Completed';
export type AttemptStatus = 'InProgress' | 'Submitted' | 'Graded';

export interface Examination {
  id: string;
  teacherId: string;
  teacherName: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  title: string;
  description?: string;
  type: ExaminationType;
  scheduledDate?: Date;
  duration?: number; // Duration in minutes
  maxScore: number;
  instructions?: string;
  questions?: string; // JSON string
  status: ExaminationStatus;
  createdAt: Date;
  updatedAt?: Date;
  attemptCount: number;
  gradedCount: number;
}

export interface CreateExaminationRequest {
  classId: string;
  subjectId: string;
  title: string;
  description?: string;
  type: ExaminationType;
  scheduledDate?: Date;
  duration?: number;
  maxScore: number;
  instructions?: string;
  questions?: string;
  status: ExaminationStatus;
}

export interface UpdateExaminationRequest {
  title?: string;
  description?: string;
  type?: ExaminationType;
  scheduledDate?: Date;
  duration?: number;
  maxScore?: number;
  instructions?: string;
  questions?: string;
  status?: ExaminationStatus;
}

export interface ExaminationAttempt {
  id: string;
  examinationId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  startedAt: Date;
  submittedAt?: Date;
  answers?: string; // JSON string
  score?: number;
  status: AttemptStatus;
  timeSpent?: number; // Time spent in minutes
  gradedBy?: string;
  graderName?: string;
  gradedAt?: Date;
}

export interface GradeExaminationAttemptRequest {
  score: number;
  feedback?: string;
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
  question: string;
  options?: string[]; // For multiple choice
  correctAnswer?: string | number;
  points: number;
}

