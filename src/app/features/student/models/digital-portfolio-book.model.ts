// Digital Portfolio Book Models

export interface StudentProfile {
  fullName: string;
  gradeSection: string;
  favoriteThings: string;
  uniqueness: string;
  futureDream: string;
}

export interface LearningGoals {
  academicGoal: string;
  behavioralGoal: string;
  personalGrowthGoal: string;
  achievementSteps: string;
  targetDate: Date | null;
}

export interface LearningStyle {
  learnsBestBy: string;
  bestTimeToStudy: string;
  focusConditions: string;
  helpfulTools: string;
  distractions: string;
}

// Teacher-filled (read-only for students)
export interface MapScore {
  id: string;
  term: 'Fall' | 'Winter' | 'Spring';
  year: number;
  score: number | null;
  dateTaken: Date | null;
  percentile: number | null;
  growth: number | null;
  goalScore: number | null;
}

// Teacher-filled (read-only for students)
export interface ExactPathProgress {
  reading: {
    currentLevel: string;
    lessonsCompleted: number;
    totalLessons: number;
    minutesThisWeek: number;
    targetCompletion: string;
  };
  vocabulary: {
    currentLevel: string;
    wordsMastered: number;
    accuracyRate: number;
  };
  grammar: {
    currentLevel: string;
    lessonsCompleted: number;
    totalLessons: number;
    focusAreas: string[];
  };
}

export interface Assignment {
  id: string;
  name: string;
  dueDate: Date;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Submitted' | 'Graded';
  notes: string;
  grade?: string;
}

export interface WeeklyReflection {
  id: string;
  weekOf: Date;
  whatLearned: string;
  biggestAchievement: string;
  challengesFaced: string;
  helpNeeded: string;
  mood: 'Excellent' | 'Good' | 'Okay' | 'Challenging' | 'Difficult';
}

export interface LearningJourneyEntry {
  id: string;
  date: Date;
  skillsWorking: string;
  evidenceOfLearning: string;
  howGrown: string;
  nextSteps: string;
}

export interface JourneyMilestone {
  id: string;
  description: string;
  date: Date;
}

export interface Project {
  id: string;
  title: string;
  type:
    | 'Writing Project'
    | 'Research Report'
    | 'Creative Project'
    | 'Group Project'
    | 'Digital Creation'
    | 'Presentation';
  description: string;
  skillsUsed: string;
  whatLearned: string;
  files: ProjectFile[];
  grade?: string;
  completedDate?: Date;
}

export interface ProjectFile {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadDate: Date;
  url: string;
}

export interface PortfolioBookProgress {
  completionPercentage: number;
  pagesCompleted: number;
  totalPages: number;
  reflectionsThisTerm: number;
  projectsUploaded: number;
}

export interface DigitalPortfolioBook {
  subjectId: string;
  subjectName: string;
  studentName: string;
  academicYear: string;
  isProfileSubmitted?: boolean;
  isGoalsSubmitted?: boolean;
  isLearningStyleSubmitted?: boolean;
  profile: StudentProfile;
  goals: LearningGoals;
  learningStyle: LearningStyle;
  mapScores: MapScore[];
  exactPathProgress: ExactPathProgress;
  assignments: Assignment[];
  reflections: WeeklyReflection[];
  journeyEntries: LearningJourneyEntry[];
  milestones: JourneyMilestone[];
  projects: Project[];
  progress: PortfolioBookProgress;
}
