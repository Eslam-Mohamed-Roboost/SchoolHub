export interface StudentAttendanceHistory {
  Date: string;
  ClassId: string;
  ClassName: string;
  Status: 'Present' | 'Absent' | 'Late' | 'Excused';
  IsAutomatic: boolean;
  Notes?: string;
}

export interface AttendanceStatistics {
  TotalDays: number;
  PresentDays: number;
  AbsentDays: number;
  LateDays: number;
  ExcusedDays: number;
  AttendancePercentage: number;
  CurrentStreak: number;
  LongestStreak: number;
  LastAttendanceDate?: string;
  RecentHistory: StudentAttendanceHistory[];
}

export interface AttendanceBonusResult {
  PointsEarned: number;
  BadgeIds: string[];
  Message: string;
}

export interface AttendanceBonusAwardResult {
  PointsAwarded: number;
  BadgesAwarded: string[];
  Message: string;
}

