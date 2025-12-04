// Student Portfolio Models

export interface PortfolioFile {
  id: string;
  fileName: string;
  fileType: 'pdf' | 'docx' | 'pptx' | 'jpg' | 'png' | 'mp4';
  fileSize: number; // in bytes
  uploadDate: Date;
  subjectId: string;
  thumbnailUrl?: string;
  previewUrl?: string;
  downloadUrl: string;
}

export interface TeacherFeedback {
  id: string;
  teacherName: string;
  date: Date;
  comment: string;
  relatedFileId?: string;
}

export interface Reflection {
  id: string;
  content: string; // HTML from rich text editor
  date: Date;
  prompt?: string;
  subjectId: string;
  autoSaved: boolean;
}

export interface PortfolioBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earnedDate: Date;
  relatedWorkId?: string; // PortfolioFile id
  category: 'portfolio' | 'subject';
}

export interface SubjectPortfolio {
  subjectId: string;
  subjectName: string;
  subjectIcon: string;
  files: PortfolioFile[];
  feedback: TeacherFeedback[];
  reflections: Reflection[];
  badges: PortfolioBadge[];
  stats: PortfolioStats;
}

export interface PortfolioStats {
  filesCount: number;
  latestUploadDate: Date | null;
  feedbackCount: number;
  badgesCount: number;
}

export interface PortfolioOverview {
  totalFiles: number;
  totalFeedback: number;
  totalBadges: number;
  subjectPortfolios: SubjectPortfolio[];
  recentUploads: PortfolioFile[]; // 3 most recent across all subjects
}
