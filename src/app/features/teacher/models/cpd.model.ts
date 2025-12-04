export interface CPDModule {
  id: string;
  title: string;
  duration: number; // in minutes
  status: 'not-started' | 'in-progress' | 'completed';
  icon: string;
  color: string;
  bgColor: string;
  videoUrl: string;
  videoProvider: 'youtube' | 'vimeo' | 'self-hosted';
  guideContent: string; // HTML content
  formUrl: string;
  evidenceFiles: string[];
  completedAt?: Date;
  startedAt?: Date;
  lastAccessedAt?: Date;
}

export interface CPDProgress {
  hoursCompleted: number;
  targetHours: number;
  completedModules: number;
  totalModules: number;
  lastActivityDate: Date;
  streak: number; // consecutive days
}

export interface TeacherStats {
  cpdHours: number;
  badgesEarned: number;
  activeStudents: number;
  currentStreak: number;
}
