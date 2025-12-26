export interface LeaderboardEntry {
  TeacherId: string;
  Name: string;
  Value: string;
  Subtitle: string;
  Rank: number;
}

export interface CurrentUserRank {
  Rank: number;
  Value: string;
}

export interface TeachersLoungeStats {
  TotalCpdHours: number;
  CpdHoursChangePercent: number;
  BadgesAwarded: number;
  BadgesChangePercent: number;
  ActiveTeachers: number;
  ActiveTeachersChangePercent: number;
  EngagementRate: number;
  EngagementChangePercent: number;
}

export interface TeachersLounge {
  CpdLeaders: LeaderboardEntry[];
  CurrentUserCpdRank?: CurrentUserRank;
  BadgeLeaders: LeaderboardEntry[];
  CurrentUserBadgeRank?: CurrentUserRank;
  Stats: TeachersLoungeStats;
}

export interface Announcement {
  Id: string;
  Title: string;
  Content: string;
  Priority: number;
  PriorityName: string;
  IsPinned: boolean;
  ShowAsPopup: boolean;
  SendEmail: boolean;
  PublishedAt?: string;
  ViewCount: number;
  CreatedAt: string;
}

