export interface PortfolioCompletionStats {
  TotalStudents: number;
  ActivePortfolios: number;
  CompletionRate: number;
  ByClass: ClassPortfolioStats[];
  BySubject: SubjectPortfolioStats[];
  RecentUpdates: PortfolioUpdate[];
}

export interface ClassPortfolioStats {
  ClassName: string;
  TotalStudents: number;
  ActivePortfolios: number;
  CompletionRate: number;
  Grade: number;
}

export interface SubjectPortfolioStats {
  SubjectName: string;
  TotalSubmissions: number;
  ActiveStudents: number;
  RecentActivity: number; // last 7 days
}

export interface PortfolioUpdate {
  StudentId: string;
  StudentName: string;
  ClassName: string;
  Subject: string;
  UpdateType: 'upload' | 'reflection' | 'feedback';
  Timestamp: Date;
  ItemCount: number;
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
