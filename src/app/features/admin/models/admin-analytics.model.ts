export interface PortfolioCompletionStats {
  totalStudents: number;
  activePortfolios: number;
  completionRate: number;
  byClass: ClassPortfolioStats[];
  bySubject: SubjectPortfolioStats[];
  recentUpdates: PortfolioUpdate[];
}

export interface ClassPortfolioStats {
  className: string;
  totalStudents: number;
  activePortfolios: number;
  completionRate: number;
  grade: number;
}

export interface SubjectPortfolioStats {
  subjectName: string;
  totalSubmissions: number;
  activeStudents: number;
  recentActivity: number; // last 7 days
}

export interface PortfolioUpdate {
  studentId: string;
  studentName: string;
  className: string;
  subject: string;
  updateType: 'upload' | 'reflection' | 'feedback';
  timestamp: Date;
  itemCount: number;
}

export interface TeacherSubjectMatrix {
  teacherId: string;
  teacherName: string;
  email: string;
  subjects: string[];
  grades: string[];
  cpdBadgesEarned: number;
  portfolioActivity: number; // student portfolio items reviewed
  lastActive: Date;
}

export interface SubjectAnalytics {
  subject: string;
  teacherCount: number;
  studentCount: number;
  portfolioCompletionRate: number;
  cpdBadgeCompletionRate: number;
  resourceUsage: ResourceUsageStats;
  topTeachers: TeacherPerformance[];
}

export interface ResourceUsageStats {
  totalResources: number;
  downloadsThisMonth: number;
  uploadsThisMonth: number;
  mostPopularResource: string;
}

export interface TeacherPerformance {
  teacherName: string;
  subject: string;
  cpdBadges: number;
  studentEngagement: number; // percentage
  portfolioReviews: number;
}

export interface EvidenceExportRequest {
  dateRange: {
    start: Date;
    end: Date;
  };
  subjects: string[];
  evidenceTypes: ('portfolios' | 'cpd' | 'badges')[];
  format: 'zip' | 'pdf' | 'excel';
}

export interface EvidenceCollectionStats {
  totalEvidenceItems: number;
  thisMonth: number;
  byType: {
    portfolios: number;
    cpd: number;
    badges: number;
  };
  pendingReview: number;
}
