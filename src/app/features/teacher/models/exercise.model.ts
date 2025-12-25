export type ExerciseType = 'Homework' | 'Classwork' | 'Project';
export type ExerciseStatus = 'Draft' | 'Published' | 'Closed';
export type SubmissionStatus = 'Submitted' | 'Late' | 'Graded';

export interface Exercise {
  id: string;
  teacherId: string;
  teacherName: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  title: string;
  description?: string;
  type: ExerciseType;
  dueDate?: Date;
  maxScore: number;
  instructions?: string;
  attachments?: string; // JSON string
  status: ExerciseStatus;
  createdAt: Date;
  updatedAt?: Date;
  submissionCount: number;
  gradedCount: number;
}

export interface CreateExerciseRequest {
  classId: string;
  subjectId: string;
  title: string;
  description?: string;
  type: ExerciseType;
  dueDate?: Date;
  maxScore: number;
  instructions?: string;
  attachments?: string;
  status: ExerciseStatus;
}

export interface UpdateExerciseRequest {
  title?: string;
  description?: string;
  type?: ExerciseType;
  dueDate?: Date;
  maxScore?: number;
  instructions?: string;
  attachments?: string;
  status?: ExerciseStatus;
}

export interface ExerciseSubmission {
  id: string;
  exerciseId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  submittedAt?: Date;
  content?: string;
  attachments?: string; // JSON string
  status: SubmissionStatus;
  score?: number;
  feedback?: string;
  gradedBy?: string;
  graderName?: string;
  gradedAt?: Date;
  isLate: boolean;
}

export interface GradeExerciseSubmissionRequest {
  score: number;
  feedback?: string;
}

