import { Injectable, signal } from '@angular/core';
import { Observable, of, catchError, map, tap } from 'rxjs';
import { BaseHttpService } from '../../../core/services/base-http.service';
import { Teacher_API_ENDPOINTS } from '../../../config/TeacherConfig/TeacherEndpoint';

// ============================================
// DTOs (PascalCase from backend)
// ============================================

interface PortfolioBookDto {
  SubjectId: string;
  SubjectName: string;
  StudentName: string;
  AcademicYear: string;
  IsProfileSubmitted: boolean;
  IsGoalsSubmitted: boolean;
  IsLearningStyleSubmitted: boolean;
  Profile: PortfolioProfileDto | null;
  Goals: PortfolioGoalsDto | null;
  LearningStyle: PortfolioLearningStyleDto | null;
  MapScores: MapScoreDto[];
  ExactPathProgress: ExactPathProgressDto | null;
  Assignments: PortfolioAssignmentDto[];
  Reflections: PortfolioReflectionDto[];
  JourneyEntries: PortfolioJourneyEntryDto[];
  Milestones: PortfolioMilestoneDto[];
  Projects: PortfolioProjectDto[];
  Progress: PortfolioProgressDto | null;
}

interface PortfolioProfileDto {
  FullName: string;
  GradeSection: string;
  FavoriteThings: string;
  Uniqueness: string;
  FutureDream: string;
}

interface PortfolioGoalsDto {
  AcademicGoal: string;
  BehavioralGoal: string;
  PersonalGrowthGoal: string;
  AchievementSteps: string;
  TargetDate: string | null;
}

interface PortfolioLearningStyleDto {
  LearnsBestBy: string;
  BestTimeToStudy: string;
  FocusConditions: string;
  HelpfulTools: string;
  Distractions: string;
}

interface MapScoreDto {
  Id: string;
  Term: string;
  Year: number;
  Score: number;
  DateTaken: string;
  Percentile: number | null;
  Growth: number | null;
  GoalScore: number | null;
}

interface ExactPathProgressDto {
  Reading: ReadingProgressDto | null;
  Vocabulary: VocabularyProgressDto | null;
  Grammar: GrammarProgressDto | null;
}

interface ReadingProgressDto {
  CurrentLevel: string;
  LessonsCompleted: number;
  TotalLessons: number;
  MinutesThisWeek: number;
  TargetCompletion: string;
}

interface VocabularyProgressDto {
  CurrentLevel: string;
  WordsMastered: number;
  AccuracyRate: number;
}

interface GrammarProgressDto {
  CurrentLevel: string;
  LessonsCompleted: number;
  TotalLessons: number;
  FocusAreas: string[];
}

interface PortfolioAssignmentDto {
  Id: string;
  Name: string;
  DueDate: string | null;
  Status: string;
  Grade: string | null;
}

interface PortfolioReflectionDto {
  Id: string;
  Week: number;
  WhatLearned: string;
  Challenges: string;
  NextWeekGoal: string;
  CreatedDate: string;
}

interface PortfolioJourneyEntryDto {
  Id: string;
  Date: string;
  Topic: string;
  KeyLearning: string;
  Evidence: string;
}

interface PortfolioMilestoneDto {
  Id: string;
  Title: string;
  Description: string;
  DateAchieved: string;
  Icon: string;
}

interface PortfolioProjectDto {
  Id: string;
  Title: string;
  Type: string;
  Description: string;
  SkillsUsed: string;
  WhatLearned: string;
  FileUrls: string[];
  CreatedDate: string;
}

interface PortfolioProgressDto {
  CompletionPercentage: number;
  PagesCompleted: number;
  TotalPages: number;
  AssignmentsTracked: number;
  ReflectionsWritten: number;
  JourneyEntriesLogged: number;
  ProjectsUploaded: number;
}

// ============================================
// Frontend Models
// ============================================

export interface StudentPortfolioBook {
  subjectId: string;
  subjectName: string;
  studentName: string;
  academicYear: string;
  isProfileSubmitted: boolean;
  isGoalsSubmitted: boolean;
  isLearningStyleSubmitted: boolean;
  profile: StudentProfile | null;
  goals: LearningGoals | null;
  learningStyle: LearningStyle | null;
  mapScores: MapScore[];
  exactPathProgress: ExactPathProgress | null;
  assignments: Assignment[];
  reflections: Reflection[];
  journeyEntries: JourneyEntry[];
  projects: Project[];
  progress: PortfolioProgress | null;
}

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

export interface MapScore {
  id: string;
  term: 'Fall' | 'Winter' | 'Spring';
  year: number;
  score: number;
  dateTaken: Date;
  percentile: number | null;
  growth: number | null;
  goalScore: number | null;
}

export interface ExactPathProgress {
  reading: ReadingProgress | null;
  vocabulary: VocabularyProgress | null;
  grammar: GrammarProgress | null;
}

export interface ReadingProgress {
  currentLevel: string;
  lessonsCompleted: number;
  totalLessons: number;
  minutesThisWeek: number;
  targetCompletion: string;
}

export interface VocabularyProgress {
  currentLevel: string;
  wordsMastered: number;
  accuracyRate: number;
}

export interface GrammarProgress {
  currentLevel: string;
  lessonsCompleted: number;
  totalLessons: number;
  focusAreas: string[];
}

export interface Assignment {
  id: string;
  name: string;
  dueDate: Date | null;
  status: string;
  grade: string | null;
}

export interface Reflection {
  id: string;
  week: number;
  whatLearned: string;
  challenges: string;
  nextWeekGoal: string;
  createdDate: Date;
}

export interface JourneyEntry {
  id: string;
  date: Date;
  topic: string;
  keyLearning: string;
  evidence: string;
}

export interface Project {
  id: string;
  title: string;
  type: string;
  description: string;
  skillsUsed: string;
  whatLearned: string;
  fileUrls: string[];
  createdDate: Date;
}

export interface PortfolioProgress {
  completionPercentage: number;
  pagesCompleted: number;
  totalPages: number;
  assignmentsTracked: number;
  reflectionsWritten: number;
  journeyEntriesLogged: number;
  projectsUploaded: number;
}

// Request Models
export interface UpdateMapScoreRequest {
  studentId: string;
  subjectId: string;
  term: 'Fall' | 'Winter' | 'Spring';
  year: number;
  score: number;
  dateTaken: Date;
  percentile: number | null;
}

export interface UpdateExactPathRequest {
  studentId: string;
  subjectId: string;
  reading: ReadingProgress | null;
  vocabulary: VocabularyProgress | null;
  grammar: GrammarProgress | null;
}

@Injectable({
  providedIn: 'root',
})
export class PortfolioBookService extends BaseHttpService {
  private currentPortfolioBook = signal<StudentPortfolioBook | null>(null);
  private isLoading = signal(false);
  private isSaving = signal(false);

  // ============================================
  // Public Signals
  // ============================================

  getPortfolioBook() {
    return this.currentPortfolioBook.asReadonly();
  }

  getIsLoading() {
    return this.isLoading.asReadonly();
  }

  getIsSaving() {
    return this.isSaving.asReadonly();
  }

  // ============================================
  // API Methods
  // ============================================

  loadStudentPortfolioBook(studentId: string, subjectId: string): void {
    this.isLoading.set(true);
    this.get<PortfolioBookDto>(
      Teacher_API_ENDPOINTS.PortfolioBook.GET_STUDENT(studentId, subjectId)
    ).subscribe({
      next: (dto) => {
        const mapped = this.mapPortfolioBookDto(dto);
        this.currentPortfolioBook.set(mapped);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load student portfolio book:', err);
        this.currentPortfolioBook.set(null);
        this.isLoading.set(false);
      },
    });
  }

  updateMapScore(request: UpdateMapScoreRequest): Observable<MapScore | null> {
    this.isSaving.set(true);
    
    const payload = {
      StudentId: request.studentId,
      SubjectId: request.subjectId,
      Term: request.term,
      Year: request.year,
      Score: request.score,
      DateTaken: request.dateTaken.toISOString(),
      Percentile: request.percentile,
    };

    return this.put<typeof payload, MapScoreDto>(
      Teacher_API_ENDPOINTS.PortfolioBook.UPDATE_MAP_SCORE,
      payload
    ).pipe(
      map((dto) => this.mapMapScoreDto(dto)),
      tap((score) => {
        this.currentPortfolioBook.update((book) => {
          if (!book) return null;
          const scores = [...book.mapScores];
          const existingIndex = scores.findIndex(
            (s) => s.term === score.term && s.year === score.year
          );
          if (existingIndex >= 0) {
            scores[existingIndex] = score;
          } else {
            scores.push(score);
          }
          return { ...book, mapScores: scores };
        });
        this.isSaving.set(false);
      }),
      catchError((err) => {
        console.error('Failed to update MAP score:', err);
        this.isSaving.set(false);
        return of(null);
      })
    );
  }

  updateExactPath(request: UpdateExactPathRequest): Observable<ExactPathProgress | null> {
    this.isSaving.set(true);

    const payload = {
      StudentId: request.studentId,
      SubjectId: request.subjectId,
      Reading: request.reading
        ? {
            CurrentLevel: request.reading.currentLevel,
            LessonsCompleted: request.reading.lessonsCompleted,
            TotalLessons: request.reading.totalLessons,
            MinutesThisWeek: request.reading.minutesThisWeek,
            TargetCompletion: request.reading.targetCompletion,
          }
        : null,
      Vocabulary: request.vocabulary
        ? {
            CurrentLevel: request.vocabulary.currentLevel,
            WordsMastered: request.vocabulary.wordsMastered,
            AccuracyRate: request.vocabulary.accuracyRate,
          }
        : null,
      Grammar: request.grammar
        ? {
            CurrentLevel: request.grammar.currentLevel,
            LessonsCompleted: request.grammar.lessonsCompleted,
            TotalLessons: request.grammar.totalLessons,
            FocusAreas: request.grammar.focusAreas,
          }
        : null,
    };

    return this.put<typeof payload, ExactPathProgressDto>(
      Teacher_API_ENDPOINTS.PortfolioBook.UPDATE_EXACT_PATH,
      payload
    ).pipe(
      map((dto) => this.mapExactPathDto(dto)),
      tap((progress) => {
        this.currentPortfolioBook.update((book) => {
          if (!book) return null;
          return { ...book, exactPathProgress: progress };
        });
        this.isSaving.set(false);
      }),
      catchError((err) => {
        console.error('Failed to update Exact Path progress:', err);
        this.isSaving.set(false);
        return of(null);
      })
    );
  }

  // ============================================
  // Mappers
  // ============================================

  private mapPortfolioBookDto(dto: PortfolioBookDto): StudentPortfolioBook {
    return {
      subjectId: dto.SubjectId,
      subjectName: dto.SubjectName,
      studentName: dto.StudentName,
      academicYear: dto.AcademicYear,
      isProfileSubmitted: dto.IsProfileSubmitted,
      isGoalsSubmitted: dto.IsGoalsSubmitted,
      isLearningStyleSubmitted: dto.IsLearningStyleSubmitted,
      profile: dto.Profile
        ? {
            fullName: dto.Profile.FullName,
            gradeSection: dto.Profile.GradeSection,
            favoriteThings: dto.Profile.FavoriteThings,
            uniqueness: dto.Profile.Uniqueness,
            futureDream: dto.Profile.FutureDream,
          }
        : null,
      goals: dto.Goals
        ? {
            academicGoal: dto.Goals.AcademicGoal,
            behavioralGoal: dto.Goals.BehavioralGoal,
            personalGrowthGoal: dto.Goals.PersonalGrowthGoal,
            achievementSteps: dto.Goals.AchievementSteps,
            targetDate: dto.Goals.TargetDate ? new Date(dto.Goals.TargetDate) : null,
          }
        : null,
      learningStyle: dto.LearningStyle
        ? {
            learnsBestBy: dto.LearningStyle.LearnsBestBy,
            bestTimeToStudy: dto.LearningStyle.BestTimeToStudy,
            focusConditions: dto.LearningStyle.FocusConditions,
            helpfulTools: dto.LearningStyle.HelpfulTools,
            distractions: dto.LearningStyle.Distractions,
          }
        : null,
      mapScores: dto.MapScores.map((s) => this.mapMapScoreDto(s)),
      exactPathProgress: dto.ExactPathProgress
        ? this.mapExactPathDto(dto.ExactPathProgress)
        : null,
      assignments: dto.Assignments.map((a) => ({
        id: a.Id,
        name: a.Name,
        dueDate: a.DueDate ? new Date(a.DueDate) : null,
        status: a.Status,
        grade: a.Grade,
      })),
      reflections: dto.Reflections.map((r) => ({
        id: r.Id,
        week: r.Week,
        whatLearned: r.WhatLearned,
        challenges: r.Challenges,
        nextWeekGoal: r.NextWeekGoal,
        createdDate: new Date(r.CreatedDate),
      })),
      journeyEntries: dto.JourneyEntries.map((j) => ({
        id: j.Id,
        date: new Date(j.Date),
        topic: j.Topic,
        keyLearning: j.KeyLearning,
        evidence: j.Evidence,
      })),
      projects: dto.Projects.map((p) => ({
        id: p.Id,
        title: p.Title,
        type: p.Type,
        description: p.Description,
        skillsUsed: p.SkillsUsed,
        whatLearned: p.WhatLearned,
        fileUrls: p.FileUrls || [],
        createdDate: new Date(p.CreatedDate),
      })),
      progress: dto.Progress
        ? {
            completionPercentage: dto.Progress.CompletionPercentage,
            pagesCompleted: dto.Progress.PagesCompleted,
            totalPages: dto.Progress.TotalPages,
            assignmentsTracked: dto.Progress.AssignmentsTracked,
            reflectionsWritten: dto.Progress.ReflectionsWritten,
            journeyEntriesLogged: dto.Progress.JourneyEntriesLogged,
            projectsUploaded: dto.Progress.ProjectsUploaded,
          }
        : null,
    };
  }

  private mapMapScoreDto(dto: MapScoreDto): MapScore {
    return {
      id: dto.Id,
      term: dto.Term as 'Fall' | 'Winter' | 'Spring',
      year: dto.Year,
      score: dto.Score,
      dateTaken: new Date(dto.DateTaken),
      percentile: dto.Percentile,
      growth: dto.Growth,
      goalScore: dto.GoalScore,
    };
  }

  private mapExactPathDto(dto: ExactPathProgressDto): ExactPathProgress {
    return {
      reading: dto.Reading
        ? {
            currentLevel: dto.Reading.CurrentLevel,
            lessonsCompleted: dto.Reading.LessonsCompleted,
            totalLessons: dto.Reading.TotalLessons,
            minutesThisWeek: dto.Reading.MinutesThisWeek,
            targetCompletion: dto.Reading.TargetCompletion,
          }
        : null,
      vocabulary: dto.Vocabulary
        ? {
            currentLevel: dto.Vocabulary.CurrentLevel,
            wordsMastered: dto.Vocabulary.WordsMastered,
            accuracyRate: dto.Vocabulary.AccuracyRate,
          }
        : null,
      grammar: dto.Grammar
        ? {
            currentLevel: dto.Grammar.CurrentLevel,
            lessonsCompleted: dto.Grammar.LessonsCompleted,
            totalLessons: dto.Grammar.TotalLessons,
            focusAreas: dto.Grammar.FocusAreas || [],
          }
        : null,
    };
  }
}
