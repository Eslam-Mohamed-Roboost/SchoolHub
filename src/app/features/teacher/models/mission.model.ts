export interface TeacherMission {
  Id: string;
  Title: string;
  Description: string;
  Icon: string;
  Status: 'completed' | 'in-progress' | 'locked' | 'not-started';
  Progress: number; // 0-100
  Badge: string;
  Duration: string;
  Requirements: string[];
}

export interface TeacherMissionActivity {
  Id: string;
  Type: string;
  Title: string;
  Content: string;
  Completed: boolean;
  Order: number;
}

export interface TeacherMissionDetail {
  Id: string;
  Title: string;
  Description: string;
  Icon: string;
  Status: string;
  Progress: number;
  Badge: string;
  Activities: TeacherMissionActivity[];
  Resources: any[];
}

export interface TeacherMissionProgress {
  MissionId: string;
  MissionTitle: string;
  Status: string;
  Progress: number;
  CompletedActivities: number;
  TotalActivities: number;
  StartedAt?: string;
  CompletedAt?: string;
}

export interface TeacherMissionsProgressSummary {
  TotalMissions: number;
  CompletedMissions: number;
  InProgressMissions: number;
  NotStartedMissions: number;
  Missions: TeacherMissionProgress[];
}

export interface UpdateTeacherMissionProgressRequest {
  MissionId: string;
  ActivityId: string;
  Completed: boolean;
  ActivityData?: Record<string, any>;
}

export interface TeacherMissionProgressResponse {
  MissionId: string;
  NewProgress: number;
  Status: string;
  BadgeEarned?: any;
}

