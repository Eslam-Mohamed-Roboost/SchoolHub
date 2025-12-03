import { ApplicationRole } from '../../../core/enums/application-role.enum';

export interface User {
  id: string;
  name: string;
  email: string;
  role: ApplicationRole;
  status: UserStatus;
  class?: string;
  badgeCount: number;
  lastLogin: Date;
  joinDate: Date;
  notes?: string;
  avatar?: string;
}

export interface CreateUserRequest {
  Name: string;
  UserName: string;
  Email: string;
  Password: string;
  PhoneNumber: string;
  RoleID: ApplicationRole;
}

export type UserStatus = 'Active' | 'Inactive';

export interface Badge {
  id: string;
  name: string;
  category: string;
  icon: string;
  cpdHours?: number;
  description: string;
}

export interface BadgeSubmission {
  id: string;
  userId: string;
  userName: string;
  userRole: ApplicationRole;
  userAvatar?: string;
  badgeId: string;
  badgeName: string;
  badgeIcon: string;
  badgeCategory: string;
  cpdHours?: number;
  evidenceLink: string;
  submitterNotes?: string;
  submissionDate: Date;
  status: BadgeStatus;
  reviewedBy?: string;
  reviewDate?: Date;
  reviewNotes?: string;
}

export type BadgeStatus = 'Pending' | 'Approved' | 'Rejected';

export interface ActivityLog {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  userAvatar?: string;
  action: string;
  type: ActivityType;
  details?: string;
}

export type ActivityType = 'Login' | 'Badge' | 'Upload' | 'Completion' | 'Update';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  publishDate: Date;
  targetAudience: string[];
  priority: 'Normal' | 'Important' | 'Urgent';
  viewCount: number;
  isPinned: boolean;
  showAsPopup: boolean;
  sendEmail: boolean;
}

export interface WeeklyChallenge {
  id: string;
  weekNumber: number;
  title: string;
  description: string;
  resourceLinks: string[];
  tutorialVideo?: string;
  submissionFormLink?: string;
  publishDate?: Date;
  status: 'Draft' | 'Published' | 'Scheduled';
  autoNotify: boolean;
}

export interface Settings {
  schoolName: string;
  schoolLogo?: string;
  academicYear: string;
  adminEmail: string;
  supportEmail: string;
  itSupport: string;
  timezone: string;
  badgeCategories: BadgeCategory[];
  cpdTiers: CpdTier[];
  missions: Mission[];
  emailTemplates: EmailTemplates;
  notificationFrequency: NotificationFrequency;
  backupSettings: BackupSettings;
}

export interface BadgeCategory {
  id: string;
  name: string;
  badgeCount: number;
}

export interface CpdTier {
  tier: number;
  name: string;
  badgeRange: string;
}

export interface Mission {
  id: string;
  name: string;
  order: number;
  enabled: boolean;
}

export interface EmailTemplates {
  badgeApprovedTeacher: string;
  badgeRejectedTeacher: string;
  badgeEarnedStudent: string;
  levelUpStudent: string;
  weeklyChallenge: string;
}

export interface NotificationFrequency {
  badgeSubmissions: 'Immediate' | 'Daily' | 'Off';
  activitySummary: 'Daily' | 'Weekly' | 'Off';
}

export interface BackupSettings {
  enabled: boolean;
  frequency: 'Daily' | 'Weekly' | 'Monthly';
  time: string;
  lastBackup?: Date;
  storageLocation: string;
}

export interface StatsCard {
  title: string;
  value: string | number;
  breakdown?: string;
  comparison?: string;
  icon: string;
  trend?: 'up' | 'down' | 'neutral';
}

export interface AdminKpiResponse {
  TotalUsers: number;
  BadgesEarned: number;
  ThisWeekActivity: number;
}

export interface ReportData {
  id: string;
  name: string;
  description: string;
  icon: string;
  exportFormats: ('Excel' | 'PDF')[];
}

export interface SystemLog {
  id: string;
  timestamp: Date;
  level: 'Info' | 'Warning' | 'Error';
  user: string;
  action: string;
  details: string;
  ipAddress: string;
  stackTrace?: string;
}
