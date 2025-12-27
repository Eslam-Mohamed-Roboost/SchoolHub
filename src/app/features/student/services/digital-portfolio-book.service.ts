import { Injectable, signal } from '@angular/core';
import { Observable, of, catchError, map, tap } from 'rxjs';
import { BaseHttpService } from '../../../core/services/base-http.service';
import { Student_API_ENDPOINTS } from '../../../config/StudentConfig/StudentEndpoints';
import {
  DigitalPortfolioBook,
  StudentProfile,
  LearningGoals,
  LearningStyle,
  Assignment,
  WeeklyReflection,
  LearningJourneyEntry,
  Project,
  ProjectFile,
  MapScore,
  ExactPathProgress,
  JourneyMilestone,
  PortfolioBookProgress,
} from '../models/digital-portfolio-book.model';

// ============================================
// API DTOs (PascalCase from backend)
// ============================================

interface DigitalPortfolioBookDto {
  SubjectId: string;
  SubjectName: string;
  StudentName: string;
  AcademicYear: string;
  IsProfileSubmitted: boolean;
  IsGoalsSubmitted: boolean;
  IsLearningStyleSubmitted: boolean;
  Profile: StudentProfileDto;
  Goals: LearningGoalsDto;
  LearningStyle: LearningStyleDto;
  MapScores: MapScoreDto[];
  ExactPathProgress: ExactPathProgressDto;
  Assignments: AssignmentDto[];
  Reflections: WeeklyReflectionDto[];
  JourneyEntries: LearningJourneyEntryDto[];
  Milestones: JourneyMilestoneDto[];
  Projects: ProjectDto[];
  Progress: PortfolioBookProgressDto;
}

interface StudentProfileDto {
  FullName: string;
  GradeSection: string;
  FavoriteThings: string;
  Uniqueness: string;
  FutureDream: string;
}

interface LearningGoalsDto {
  AcademicGoal: string;
  BehavioralGoal: string;
  PersonalGrowthGoal: string;
  AchievementSteps: string;
  TargetDate: string | null;
}

interface LearningStyleDto {
  LearnsBestBy: string;
  BestTimeToStudy: string;
  FocusConditions: string;
  HelpfulTools: string;
  Distractions: string;
}

interface MapScoreDto {
  Id: string;
  Term: 'Fall' | 'Winter' | 'Spring';
  Year: number;
  Score: number | null;
  DateTaken: string | null;
  Percentile: number | null;
  Growth: number | null;
  GoalScore: number | null;
}

interface ExactPathProgressDto {
  Reading: {
    CurrentLevel: string;
    LessonsCompleted: number;
    TotalLessons: number;
    MinutesThisWeek: number;
    TargetCompletion: string;
  };
  Vocabulary: {
    CurrentLevel: string;
    WordsMastered: number;
    AccuracyRate: number;
  };
  Grammar: {
    CurrentLevel: string;
    LessonsCompleted: number;
    TotalLessons: number;
    FocusAreas: string[];
  };
}

interface AssignmentDto {
  Id: string;
  Name: string;
  DueDate: string;
  Status: string;
  Notes: string;
  Grade?: string;
}

interface WeeklyReflectionDto {
  Id: string;
  WeekOf: string;
  WhatLearned: string;
  BiggestAchievement: string;
  ChallengesFaced: string;
  HelpNeeded: string;
  Mood: string;
}

interface LearningJourneyEntryDto {
  Id: string;
  Date: string;
  SkillsWorking: string;
  EvidenceOfLearning: string;
  HowGrown: string;
  NextSteps: string;
}

interface JourneyMilestoneDto {
  Id: string;
  Description: string;
  Date: string;
}

interface ProjectDto {
  Id: string;
  Title: string;
  Type: string;
  Description: string;
  SkillsUsed: string;
  WhatLearned: string;
  Files?: ProjectFileDto[];
  FileUrls?: string[];
  CreatedDate?: string;
  Grade?: string;
  CompletedDate?: string;
}

interface ProjectFileDto {
  Id: string;
  FileName: string;
  FileType: string;
  FileSize: number;
  UploadDate: string;
  Url: string;
}

interface PortfolioBookProgressDto {
  CompletionPercentage: number;
  PagesCompleted: number;
  TotalPages: number;
  ReflectionsThisTerm: number;
  ProjectsUploaded: number;
}

@Injectable({
  providedIn: 'root',
})
export class DigitalPortfolioBookService extends BaseHttpService {
  private portfolioBook = signal<DigitalPortfolioBook | null>(null);
  private isLoading = signal(false);
  private error = signal<string | null>(null);

  constructor() {
    super();
  }

  // ============================================
  // GETTERS
  // ============================================

  getPortfolioBook() {
    return this.portfolioBook;
  }

  getIsLoading() {
    return this.isLoading;
  }

  getError() {
    return this.error;
  }

  // ============================================
  // API CALLS
  // ============================================

  loadPortfolioBook(subjectId: string): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.get<DigitalPortfolioBookDto>(Student_API_ENDPOINTS.PortfolioBook.GET(subjectId))
      .pipe(
        map((dto) => this.mapPortfolioBookDto(dto)),
        catchError((err) => {
          console.error('Failed to load portfolio book, using mock data:', err);
          return of(this.getMockPortfolioBook(subjectId));
        })
      )
      .subscribe({
        next: (book) => {
          this.portfolioBook.set(book);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.error.set('Failed to load portfolio book');
          this.isLoading.set(false);
        },
      });
  }

  saveProfile(subjectId: string, profile: StudentProfile): Observable<boolean> {
    const dto = {
      SubjectId: subjectId,
      FullName: profile.fullName,
      GradeSection: profile.gradeSection,
      FavoriteThings: profile.favoriteThings,
      Uniqueness: profile.uniqueness,
      FutureDream: profile.futureDream,
    };

    return this.put<typeof dto, void>(Student_API_ENDPOINTS.PortfolioBook.SAVE_PROFILE, dto).pipe(
      tap(() => {
        this.portfolioBook.update((book) =>
          book ? { ...book, profile, isProfileSubmitted: true } : null
        );
      }),
      map(() => true),
      catchError((err) => {
        console.error('Failed to save profile:', err);
        return of(false);
      })
    );
  }

  saveGoals(subjectId: string, goals: LearningGoals): Observable<boolean> {
    const dto = {
      SubjectId: subjectId,
      AcademicGoal: goals.academicGoal,
      BehavioralGoal: goals.behavioralGoal,
      PersonalGrowthGoal: goals.personalGrowthGoal,
      AchievementSteps: goals.achievementSteps,
      TargetDate: goals.targetDate?.toISOString() || null,
    };

    return this.put<typeof dto, void>(Student_API_ENDPOINTS.PortfolioBook.SAVE_GOALS, dto).pipe(
      tap(() => {
        this.portfolioBook.update((book) =>
          book ? { ...book, goals, isGoalsSubmitted: true } : null
        );
      }),
      map(() => true),
      catchError((err) => {
        console.error('Failed to save goals:', err);
        return of(false);
      })
    );
  }

  saveLearningStyle(subjectId: string, style: LearningStyle): Observable<boolean> {
    const dto = {
      SubjectId: subjectId,
      LearnsBestBy: style.learnsBestBy,
      BestTimeToStudy: style.bestTimeToStudy,
      FocusConditions: style.focusConditions,
      HelpfulTools: style.helpfulTools,
      Distractions: style.distractions,
    };

    return this.put<typeof dto, void>(
      Student_API_ENDPOINTS.PortfolioBook.SAVE_LEARNING_STYLE,
      dto
    ).pipe(
      tap(() => {
        this.portfolioBook.update((book) =>
          book ? { ...book, learningStyle: style, isLearningStyleSubmitted: true } : null
        );
      }),
      map(() => true),
      catchError((err) => {
        console.error('Failed to save learning style:', err);
        return of(false);
      })
    );
  }

  saveAssignment(subjectId: string, assignment: Assignment): Observable<Assignment | null> {
    const dto = {
      SubjectId: subjectId,
      Id: assignment.id || null,
      Name: assignment.name,
      DueDate: assignment.dueDate.toISOString(),
      Status: assignment.status,
      Notes: assignment.notes,
    };

    return this.post<typeof dto, AssignmentDto>(
      Student_API_ENDPOINTS.PortfolioBook.SAVE_ASSIGNMENT,
      dto
    ).pipe(
      map((response) => this.mapAssignmentDto(response)),
      tap((saved) => {
        this.portfolioBook.update((book) => {
          if (!book) return null;
          const existingIndex = book.assignments.findIndex((a) => a.id === saved.id);
          if (existingIndex >= 0) {
            book.assignments[existingIndex] = saved;
          } else {
            book.assignments.push(saved);
          }
          return { ...book };
        });
      }),
      catchError((err) => {
        console.error('Failed to save assignment:', err);
        return of(null);
      })
    );
  }

  saveReflection(
    subjectId: string,
    reflection: WeeklyReflection
  ): Observable<WeeklyReflection | null> {
    const dto = {
      SubjectId: subjectId,
      WeekOf: reflection.weekOf.toISOString(),
      WhatLearned: reflection.whatLearned,
      BiggestAchievement: reflection.biggestAchievement,
      ChallengesFaced: reflection.challengesFaced,
      HelpNeeded: reflection.helpNeeded,
      Mood: reflection.mood,
    };

    return this.post<typeof dto, WeeklyReflectionDto>(
      Student_API_ENDPOINTS.PortfolioBook.SAVE_REFLECTION,
      dto
    ).pipe(
      map((response) => this.mapWeeklyReflectionDto(response)),
      tap((saved) => {
        this.portfolioBook.update((book) => {
          if (!book) return null;
          book.reflections.push(saved);
          book.progress.reflectionsThisTerm++;
          return { ...book };
        });
      }),
      catchError((err) => {
        console.error('Failed to save reflection:', err);
        return of(null);
      })
    );
  }

  saveJourneyEntry(
    subjectId: string,
    entry: LearningJourneyEntry
  ): Observable<LearningJourneyEntry | null> {
    const dto = {
      SubjectId: subjectId,
      Date: entry.date.toISOString(),
      SkillsWorking: entry.skillsWorking,
      EvidenceOfLearning: entry.evidenceOfLearning,
      HowGrown: entry.howGrown,
      NextSteps: entry.nextSteps,
    };

    return this.post<typeof dto, LearningJourneyEntryDto>(
      Student_API_ENDPOINTS.PortfolioBook.SAVE_JOURNEY,
      dto
    ).pipe(
      map((response) => this.mapLearningJourneyEntryDto(response)),
      tap((saved) => {
        this.portfolioBook.update((book) => {
          if (!book) return null;
          book.journeyEntries.push(saved);
          return { ...book };
        });
      }),
      catchError((err) => {
        console.error('Failed to save journey entry:', err);
        return of(null);
      })
    );
  }

  saveProject(subjectId: string, project: Project, files: File[]): Observable<Project | null> {
    const formData = new FormData();
    formData.append('SubjectId', subjectId);
    formData.append('Title', project.title);
    formData.append('Type', project.type);
    formData.append('Description', project.description);
    formData.append('SkillsUsed', project.skillsUsed);
    formData.append('WhatLearned', project.whatLearned);

    files.forEach((file) => {
      formData.append('Files', file);
    });

    return this.post<FormData, ProjectDto>(
      Student_API_ENDPOINTS.PortfolioBook.SAVE_PROJECT,
      formData
    ).pipe(
      map((response) => this.mapProjectDto(response)),
      tap((saved) => {
        this.portfolioBook.update((book) => {
          if (!book) return null;
          book.projects.push(saved);
          book.progress.projectsUploaded++;
          return { ...book };
        });
      }),
      catchError((err) => {
        console.error('Failed to save project:', err);
        return of(null);
      })
    );
  }

  // ============================================
  // MAPPERS
  // ============================================

  private mapPortfolioBookDto(dto: DigitalPortfolioBookDto): DigitalPortfolioBook {
    return {
      subjectId: dto.SubjectId,
      subjectName: dto.SubjectName,
      studentName: dto.StudentName,
      academicYear: dto.AcademicYear,
      isProfileSubmitted: dto.IsProfileSubmitted,
      isGoalsSubmitted: dto.IsGoalsSubmitted,
      isLearningStyleSubmitted: dto.IsLearningStyleSubmitted,
      profile: {
        fullName: dto.Profile?.FullName || '',
        gradeSection: dto.Profile?.GradeSection || '',
        favoriteThings: dto.Profile?.FavoriteThings || '',
        uniqueness: dto.Profile?.Uniqueness || '',
        futureDream: dto.Profile?.FutureDream || '',
      },
      goals: {
        academicGoal: dto.Goals?.AcademicGoal || '',
        behavioralGoal: dto.Goals?.BehavioralGoal || '',
        personalGrowthGoal: dto.Goals?.PersonalGrowthGoal || '',
        achievementSteps: dto.Goals?.AchievementSteps || '',
        targetDate: dto.Goals?.TargetDate ? new Date(dto.Goals.TargetDate) : null,
      },
      learningStyle: {
        learnsBestBy: dto.LearningStyle?.LearnsBestBy || '',
        bestTimeToStudy: dto.LearningStyle?.BestTimeToStudy || '',
        focusConditions: dto.LearningStyle?.FocusConditions || '',
        helpfulTools: dto.LearningStyle?.HelpfulTools || '',
        distractions: dto.LearningStyle?.Distractions || '',
      },
      mapScores: (dto.MapScores || []).map((s) => this.mapMapScoreDto(s)),
      exactPathProgress: this.mapExactPathProgressDto(dto.ExactPathProgress),
      assignments: (dto.Assignments || []).map((a) => this.mapAssignmentDto(a)),
      reflections: (dto.Reflections || []).map((r) => this.mapWeeklyReflectionDto(r)),
      journeyEntries: (dto.JourneyEntries || []).map((j) => this.mapLearningJourneyEntryDto(j)),
      milestones: (dto.Milestones || []).map((m) => this.mapMilestoneDto(m)),
      projects: (dto.Projects || []).map((p) => this.mapProjectDto(p)),
      progress: {
        completionPercentage: dto.Progress?.CompletionPercentage ?? 0,
        pagesCompleted: dto.Progress?.PagesCompleted ?? 0,
        totalPages: dto.Progress?.TotalPages ?? 9,
        reflectionsThisTerm: dto.Progress?.ReflectionsThisTerm ?? 0,
        projectsUploaded: dto.Progress?.ProjectsUploaded ?? 0,
      },
    };
  }

  private mapMapScoreDto(dto: MapScoreDto): MapScore {
    return {
      id: dto.Id,
      term: dto.Term,
      year: dto.Year,
      score: dto.Score,
      dateTaken: dto.DateTaken ? new Date(dto.DateTaken) : null,
      percentile: dto.Percentile,
      growth: dto.Growth,
      goalScore: dto.GoalScore,
    };
  }

  private mapExactPathProgressDto(dto: ExactPathProgressDto): ExactPathProgress {
    return {
      reading: {
        currentLevel: dto.Reading.CurrentLevel,
        lessonsCompleted: dto.Reading.LessonsCompleted,
        totalLessons: dto.Reading.TotalLessons,
        minutesThisWeek: dto.Reading.MinutesThisWeek,
        targetCompletion: dto.Reading.TargetCompletion,
      },
      vocabulary: {
        currentLevel: dto.Vocabulary.CurrentLevel,
        wordsMastered: dto.Vocabulary.WordsMastered,
        accuracyRate: dto.Vocabulary.AccuracyRate,
      },
      grammar: {
        currentLevel: dto.Grammar.CurrentLevel,
        lessonsCompleted: dto.Grammar.LessonsCompleted,
        totalLessons: dto.Grammar.TotalLessons,
        focusAreas: dto.Grammar.FocusAreas,
      },
    };
  }

  private mapAssignmentDto(dto: AssignmentDto): Assignment {
    return {
      id: dto.Id,
      name: dto.Name,
      dueDate: new Date(dto.DueDate),
      status: dto.Status as Assignment['status'],
      notes: dto.Notes,
      grade: dto.Grade,
    };
  }

  private mapWeeklyReflectionDto(dto: WeeklyReflectionDto): WeeklyReflection {
    return {
      id: dto.Id,
      weekOf: new Date(dto.WeekOf),
      whatLearned: dto.WhatLearned,
      biggestAchievement: dto.BiggestAchievement,
      challengesFaced: dto.ChallengesFaced,
      helpNeeded: dto.HelpNeeded,
      mood: dto.Mood as WeeklyReflection['mood'],
    };
  }

  private mapLearningJourneyEntryDto(dto: LearningJourneyEntryDto): LearningJourneyEntry {
    return {
      id: dto.Id,
      date: new Date(dto.Date),
      skillsWorking: dto.SkillsWorking,
      evidenceOfLearning: dto.EvidenceOfLearning,
      howGrown: dto.HowGrown,
      nextSteps: dto.NextSteps,
    };
  }

  private mapMilestoneDto(dto: JourneyMilestoneDto): JourneyMilestone {
    return {
      id: dto.Id,
      description: dto.Description,
      date: new Date(dto.Date),
    };
  }

  private mapProjectDto(dto: ProjectDto): Project {
    const files: ProjectFile[] = (dto.Files || []).map((f) => ({
      id: f.Id,
      fileName: f.FileName,
      fileType: f.FileType,
      fileSize: f.FileSize,
      uploadDate: new Date(f.UploadDate),
      url: f.Url,
    }));

    const fileUrls = dto.FileUrls || [];
    for (const url of fileUrls) {
      files.push({
        id: url,
        fileName: url.split('/').pop() || url,
        fileType: '',
        fileSize: 0,
        uploadDate: dto.CreatedDate ? new Date(dto.CreatedDate) : new Date(),
        url,
      });
    }

    return {
      id: dto.Id,
      title: dto.Title,
      type: dto.Type as Project['type'],
      description: dto.Description,
      skillsUsed: dto.SkillsUsed,
      whatLearned: dto.WhatLearned,
      files,
      grade: dto.Grade,
      completedDate: dto.CompletedDate
        ? new Date(dto.CompletedDate)
        : dto.CreatedDate
          ? new Date(dto.CreatedDate)
          : undefined,
    };
  }

  // ============================================
  // MOCK DATA (fallback when API unavailable)
  // ============================================

  private getMockPortfolioBook(subjectId: string): DigitalPortfolioBook {
    return {
      subjectId,
      subjectName: 'ELA Subject',
      studentName: 'Ahmed Al Mansoori',
      academicYear: '2024-25',
      profile: {
        fullName: '',
        gradeSection: '',
        favoriteThings: '',
        uniqueness: '',
        futureDream: '',
      },
      goals: {
        academicGoal: '',
        behavioralGoal: '',
        personalGrowthGoal: '',
        achievementSteps: '',
        targetDate: null,
      },
      learningStyle: {
        learnsBestBy: '',
        bestTimeToStudy: 'morning',
        focusConditions: '',
        helpfulTools: '',
        distractions: '',
      },
      mapScores: [
        {
          id: '1',
          term: 'Fall',
          year: 2024,
          score: 185,
          dateTaken: new Date('2024-09-15'),
          percentile: 65,
          growth: null,
          goalScore: null,
        },
        {
          id: '2',
          term: 'Winter',
          year: 2025,
          score: 192,
          dateTaken: new Date('2025-01-10'),
          percentile: 72,
          growth: 7,
          goalScore: null,
        },
        {
          id: '3',
          term: 'Spring',
          year: 2025,
          score: null,
          dateTaken: null,
          percentile: null,
          growth: null,
          goalScore: 200,
        },
      ],
      exactPathProgress: {
        reading: {
          currentLevel: '6.2',
          lessonsCompleted: 24,
          totalLessons: 40,
          minutesThisWeek: 120,
          targetCompletion: 'End of Term 2',
        },
        vocabulary: { currentLevel: '6.5', wordsMastered: 156, accuracyRate: 82 },
        grammar: {
          currentLevel: '6.0',
          lessonsCompleted: 18,
          totalLessons: 35,
          focusAreas: ['Punctuation', 'Sentence Structure'],
        },
      },
      assignments: [
        {
          id: '1',
          name: 'Reading Response #3',
          dueDate: new Date('2024-12-01'),
          status: 'Submitted',
          notes: '',
        },
        {
          id: '2',
          name: 'Poetry Analysis',
          dueDate: new Date('2024-11-28'),
          status: 'Graded',
          notes: '',
          grade: '88%',
        },
        {
          id: '3',
          name: 'Book Report',
          dueDate: new Date('2024-12-15'),
          status: 'In Progress',
          notes: '',
        },
        {
          id: '4',
          name: 'Vocabulary Quiz',
          dueDate: new Date('2024-12-18'),
          status: 'Not Started',
          notes: '',
        },
      ],
      reflections: [],
      journeyEntries: [],
      milestones: [
        { id: '1', description: 'Completed first book report', date: new Date('2024-10-01') },
        { id: '2', description: 'Improved writing score by 10%', date: new Date('2024-11-01') },
        { id: '3', description: 'Read 5 books this term', date: new Date('2024-12-01') },
        { id: '4', description: 'Earned "Reading Champion" badge', date: new Date('2024-12-01') },
      ],
      projects: [
        {
          id: '1',
          title: 'My Favorite Book',
          type: 'Writing Project',
          description: 'Book Report',
          skillsUsed: '',
          whatLearned: '',
          files: [],
          grade: 'A',
          completedDate: new Date('2024-10-01'),
        },
        {
          id: '2',
          title: 'Poetry Collection',
          type: 'Creative Project',
          description: '',
          skillsUsed: '',
          whatLearned: '',
          files: [],
          grade: 'B+',
          completedDate: new Date('2024-11-01'),
        },
        {
          id: '3',
          title: 'Character Analysis Presentation',
          type: 'Presentation',
          description: '',
          skillsUsed: '',
          whatLearned: '',
          files: [],
          grade: 'A-',
          completedDate: new Date('2024-12-01'),
        },
      ],
      progress: {
        completionPercentage: 78,
        pagesCompleted: 7,
        totalPages: 9,
        reflectionsThisTerm: 12,
        projectsUploaded: 3,
      },
    };
  }
}
