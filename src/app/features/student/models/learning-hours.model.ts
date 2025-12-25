export interface LearningHours {
  id: string;
  activityType: 'Mission' | 'Challenge' | 'Portfolio' | 'Completion' | 'Other';
  activityId: string;
  hoursEarned: number;
  earnedDate: Date;
}

export interface LearningHoursSummary {
  totalHours: number;
  thisWeekHours: number;
  thisMonthHours: number;
  byActivityType: ActivityHoursBreakdown[];
  recentActivities: LearningHoursEntry[];
}

export interface ActivityHoursBreakdown {
  activityType: string;
  totalHours: number;
  count: number;
}

export interface LearningHoursEntry {
  id: string;
  activityType: string;
  activityId: string;
  hoursEarned: number;
  earnedDate: Date;
}

export interface CpdHoursSummary {
  totalHours: number;
  thisYearHours: number;
  annualGoal: number;
  progressPercentage: number;
  recentActivities: CpdHoursEntry[];
}

export interface CpdHoursEntry {
  id: string;
  moduleId: string;
  hoursEarned: number;
  completedDate: Date;
}

export interface BadgeAwardNotification {
  badgeId: string;
  badgeName: string;
  badgeIcon: string;
  badgeColor: string;
  hoursEarned: number;
  activityType: 'Mission' | 'Challenge';
  activityName: string;
}

