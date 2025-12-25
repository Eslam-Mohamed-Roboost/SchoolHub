export interface EnhancedDashboardDto {
  studentAchievement: StudentAchievementMetrics;
  teacherCPD: TeacherCPDMetrics;
  adekCompliance: ADEKComplianceMetrics;
  platformEngagement: PlatformEngagementMetrics;
  aiInsights: AIInsightDto[];
}

export interface StudentAchievementMetrics {
  totalStudents: number;
  grade6Count: number;
  grade7Count: number;
  digitalCitizenshipProgress: number; // percentage
  portfolioQualityScore: number; // 1-10 scale
  atRiskCount: number;
  topPerformersCount: number;
}

export interface TeacherCPDMetrics {
  totalTeachers: number;
  activeTeachers: number;
  cpdHoursThisMonth: number;
  targetHoursThisMonth: number;
  badgeCompletionRate: number; // percentage
  resourceDownloads: number;
  topPerformerName: string;
  topPerformerHours: number;
}

export interface ADEKComplianceMetrics {
  totalEvidenceItems: number;
  portfolioCompletionPercentage: number;
  cpdDocumentationPercentage: number;
  pendingReviewCount: number;
  nextDeadline: string; // ISO date string
  daysUntilDeadline: number;
}

export interface PlatformEngagementMetrics {
  dailyActiveUsers: number;
  totalUsers: number;
  engagementPercentage: number;
  peakUsageTime: string;
  mostAccessedResource: string;
  oneNoteAdoptionRate: number; // percentage
  badgeAdoptionRate: number; // percentage
  weeklyTrendPercentage: number; // positive or negative
}

export interface AIInsightDto {
  type: string; // "warning", "info", "success", "alert"
  icon: string;
  message: string;
  count?: number;
  actionLink?: string;
}

// Display card interface for component
export interface MetricCard {
  title: string;
  icon: string;
  iconColor: string;
  mainValue: string | number;
  subtitle: string;
  details: MetricDetail[];
}

export interface MetricDetail {
  label: string;
  value: string;
  icon?: string;
}

