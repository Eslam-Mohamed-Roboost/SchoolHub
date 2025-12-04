export interface Student {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  latestSubmission?: Submission;
  portfolioStatus: 'pending' | 'reviewed' | 'needs-revision';
}

export interface Portfolio {
  id: string;
  studentId: string;
  studentName: string;
  subjectId: string;
  subjectName: string;
  submissions: Submission[];
  feedback: Comment[];
  badges: Badge[];
  likes: number;
  isLiked: boolean;
  lastUpdated: Date;
}

export interface Submission {
  id: string;
  title: string;
  content: string; // HTML content or file description
  submittedAt: Date;
  type: 'onenote' | 'file-upload';
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
}

export interface Comment {
  id: string;
  teacherId: string;
  teacherName: string;
  content: string;
  createdAt: Date;
  type: 'comment' | 'revision-request';
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  category: 'subject' | 'skill' | 'achievement';
  awardedAt?: Date;
}
