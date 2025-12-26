/**
 * Student API Models
 * Complete type definitions for all Student Portal API endpoints
 */

// ============================================
// SHARED MODELS
// ============================================

export interface ApiResponse<T> {
  Data: T;
  IsSuccess: boolean;
  Message: string;
  ErrorCode: string;
  IsAuthorized: boolean;
}

export interface LearningResourceDto {
  Id: string;
  Title: string;
  Type: 'video' | 'article' | 'interactive' | 'pdf';
  Url: string;
  Duration?: string;
  IsRequired?: boolean;
}

// ============================================
// DASHBOARD MODELS
// ============================================

export interface StudentDashboardDto {
  StudentInfo: StudentInfoDto;
  QuickStats: QuickStatsDto;
  SubjectHubs: SubjectCardDto[];
  InProgressMissions: MissionDto[];
  Notifications: NotificationDto[];
  RecentBadges: BadgeDto[];
}

export interface StudentInfoDto {
  Id: number;
  Name: string;
  Email: string;
  Class: string;
  AvatarUrl: string;
  Level: string;
}

export interface QuickStatsDto {
  TotalBadges: number;
  CompletedMissions: number;
  PortfolioFiles: number;
  Points: number;
}

export interface SubjectCardDto {
  SubjectId: string;
  SubjectName: string;
  Icon: string;
  NewFeedbackCount: number;
  PendingTasksCount: number;
}

// ============================================
// MISSION MODELS
// ============================================

export interface MissionDto {
  Id: string;
  Title: string;
  Description: string;
  Icon: string;
  Status: 'completed' | 'in-progress' | 'locked';
  Progress: number;
  Badge: string;
  Duration: string;
  Requirements: string[];
}

export interface MissionDetailDto {
  Id: string;
  Title: string;
  Description: string;
  Icon: string;
  Status: 'completed' | 'in-progress' | 'locked';
  Progress: number;
  Badge: string;
  Activities: MissionActivityDto[];
  Resources: LearningResourceDto[];
}

export interface MissionActivityDto {
  Id: number;
  Type: 'video' | 'quiz' | 'reading' | 'interactive';
  Title: string;
  Content: string;
  Completed: boolean;
  Order: number;
}

export interface UpdateMissionProgressRequest {
  MissionId: number;
  ActivityId: number;
  Completed: boolean;
  ActivityData?: Record<string, any>;
}

export interface MissionProgressResponse {
  MissionId: string;
  NewProgress: number;
  Status: 'in-progress' | 'completed';
  BadgeEarned?: PortfolioBadgeDto;
}

export interface PortfolioBadgeDto {
  Id: string;
  Name: string;
  Description: string;
  Icon: string;
  Color: string;
  EarnedDate?: string;
  RelatedWorkId?: string;
  Category: string;
}

// ============================================
// BADGE MODELS
// ============================================

export interface StudentBadgesSummaryDto {
  TotalBadges: number;
  EarnedBadges: number;
  LockedBadges: number;
  CurrentLevel: string;
  NextLevel: string;
  BadgesUntilNextLevel: number;
  Badges: BadgeDto[];
  PortfolioBadges: PortfolioBadgeDto[];
}

export interface BadgeDto {
  Id: number;
  Name: string;
  Icon: string;
  Earned: boolean;
  EarnDate?: string;
  Requirement: string;
  Category: 'mission' | 'portfolio' | 'challenge';
}

export interface AwardBadgeRequest {
  StudentId: number;
  BadgeId: string;
  Reason: string;
  RelatedEntityId?: string;
}

// ============================================
// CHALLENGE MODELS
// ============================================

export interface ChallengeDto {
  Id: number;
  Title: string;
  Description: string;
  Icon: string;
  StartDate: string;
  EndDate: string;
  Difficulty: 'easy' | 'medium' | 'hard';
  Points: number;
  Completed: boolean;
  ParticipantCount: number;
  Tags: string[];
}

export interface SubmitChallengeRequest {
  ChallengeId: number;
  Answer: string;
  Attachments?: File[];
}

export interface ChallengeSubmissionResponse {
  Success: boolean;
  PointsEarned: number;
  BadgeEarned: boolean;
  Feedback: string;
}

// ============================================
// PROGRESS MODELS
// ============================================

export interface StudentProgressDto {
  TotalPoints: number;
  CurrentLevel: string;
  LevelProgress: number;
  SubjectProgress: SubjectProgressDto[];
  MissionProgress: MissionProgressSummaryDto;
  BadgeProgress: BadgeProgressDto;
  RecentActivity: ActivityLogDto[];
}

export interface SubjectProgressDto {
  SubjectId: string;
  SubjectName: string;
  FilesUploaded: number;
  FeedbackReceived: number;
  BadgesEarned: number;
  CompletionPercentage: number;
}

export interface MissionProgressSummaryDto {
  TotalMissions: number;
  CompletedMissions: number;
  InProgressMissions: number;
  LockedMissions: number;
}

export interface BadgeProgressDto {
  TotalBadges: number;
  EarnedBadges: number;
  Percentage: number;
  // Optional fields for future use
  PortfolioBadges?: number;
  MissionBadges?: number;
  ChallengeBadges?: number;
}

export interface ActivityLogDto {
  Date: string;
  ActivityType: 'upload' | 'badge_earned' | 'mission_completed' | 'challenge_completed';
  Description: string;
  Icon: string;
}

// ============================================
// NOTEBOOK MODELS
// ============================================

export interface NotebookEntryDto {
  Id: string;
  Title: string;
  Content: string;
  CreatedDate: string;
  LastModifiedDate: string;
  SubjectId: string;
  Tags: string[];
  IsFavorite: boolean;
}

export interface SaveNotebookEntryRequest {
  Id?: string;
  Title: string;
  Content: string;
  SubjectId: string;
  Tags: string[];
  IsFavorite: boolean;
}

export interface NotebookFilters {
  subjectId?: string;
  dateFrom?: string;
  dateTo?: string;
}

// ============================================
// GOAL MODELS
// ============================================

export interface StudentGoalDto {
  Id: number;
  Title: string;
  Description: string;
  Type: 'daily' | 'weekly' | 'monthly' | 'custom';
  StartDate: string;
  EndDate: string;
  Status: 'active' | 'completed' | 'expired';
  CurrentProgress: number;
  TargetProgress: number;
  PercentageComplete: number;
  Category: 'missions' | 'badges' | 'portfolio' | 'challenges';
}

export interface CreateGoalRequest {
  Title: string;
  Description: string;
  Type: 'daily' | 'weekly' | 'monthly' | 'custom';
  EndDate: string;
  TargetProgress: number;
  Category: 'missions' | 'badges' | 'portfolio' | 'challenges';
}

// ============================================
// ACTIVITY & POINTS MODELS
// ============================================

export interface ActivityStreakDto {
  CurrentStreak: number;
  LongestStreak: number;
  LastActivityDate: string;
  IsActiveToday: boolean;
  ActivityCalendar: string[];
}

export interface PointsSummaryDto {
  TotalPoints: number;
  PointsThisWeek: number;
  PointsThisMonth: number;
  CurrentLevel: string;
  PointsToNextLevel: number;
  RecentEarnings: PointsHistoryDto[];
  Breakdown: PointsBreakdownDto;
}

export interface PointsHistoryDto {
  Date: string;
  Points: number;
  Source: string;
  Description: string;
}

export interface PointsBreakdownDto {
  FromMissions: number;
  FromChallenges: number;
  FromBadges: number;
  FromPortfolio: number;
  FromStreak: number;
}

export interface AwardPointsRequest {
  StudentId: number;
  Points: number;
  Source: string;
  Description: string;
  RelatedEntityId?: string;
}

// ============================================
// NOTIFICATION MODELS
// ============================================

export interface NotificationDto {
  Id: number;
  Type: 'feedback' | 'badge' | 'mission' | 'challenge';
  Title: string;
  Message: string;
  Date: string;
  Read: boolean;
  ActionUrl: string;
}
