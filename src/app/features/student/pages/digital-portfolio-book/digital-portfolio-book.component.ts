import {
  Component,
  inject,
  signal,
  ChangeDetectionStrategy,
  OnInit,
  effect,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  DigitalPortfolioBook,
  StudentProfile,
  LearningGoals,
  LearningStyle,
  Assignment,
  WeeklyReflection,
  LearningJourneyEntry,
  Project,
} from '../../models/digital-portfolio-book.model';
import { DigitalPortfolioBookService } from '../../services/digital-portfolio-book.service';

interface BookPage {
  id: number;
  title: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-digital-portfolio-book',
  templateUrl: './digital-portfolio-book.component.html',
  styleUrl: './digital-portfolio-book.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
})
export class DigitalPortfolioBookComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private portfolioBookService = inject(DigitalPortfolioBookService);

  currentPage = signal(1);
  readonly totalPages = 9;
  private subjectId = '';
  selectedFiles: File[] = [];
  isSaving = signal(false);
  isLoading = signal(false);

  // Get portfolioBook from service
  portfolioBook = computed(() => {
    const book = this.portfolioBookService.getPortfolioBook()();
    return book || this.getEmptyBook();
  });

  // Check if today's entries already exist
  hasTodayReflection = computed(() => {
    const reflections = this.portfolioBook().reflections;
    const today = new Date().toDateString();
    return reflections.some((r) => new Date(r.weekOf).toDateString() === today);
  });

  hasTodayJourney = computed(() => {
    const entries = this.portfolioBook().journeyEntries;
    const today = new Date().toDateString();
    return entries.some((e) => new Date(e.date).toDateString() === today);
  });

  readonly bookPages: BookPage[] = [
    { id: 1, title: 'All About Me', icon: '📖', description: 'Student profile' },
    { id: 2, title: 'Goal Setting', icon: '🎯', description: 'Learning goals' },
    { id: 3, title: 'Learning Style', icon: '🧠', description: 'Study preferences' },
    { id: 4, title: 'MAP Scores', icon: '📊', description: 'Assessment tracker' },
    { id: 5, title: 'Exact Path', icon: '🎮', description: 'Progress tracker' },
    { id: 6, title: 'Assignments', icon: '📝', description: 'Assignment tracker' },
    { id: 7, title: 'Daily Reflection', icon: '🤔', description: 'Daily learning reflections' },
    { id: 8, title: 'Learning Journey', icon: '🚀', description: 'Growth documentation' },
    { id: 9, title: 'My Projects', icon: '🎨', description: 'Project showcase' },
  ];

  // Form data models
  profile: StudentProfile = {
    fullName: '',
    gradeSection: '',
    favoriteThings: '',
    uniqueness: '',
    futureDream: '',
  };

  goals: LearningGoals = {
    academicGoal: '',
    behavioralGoal: '',
    personalGrowthGoal: '',
    achievementSteps: '',
    targetDate: null,
  };

  learningStyle: LearningStyle = {
    learnsBestBy: '',
    bestTimeToStudy: 'morning',
    focusConditions: '',
    helpfulTools: '',
    distractions: '',
  };

  newAssignment: Assignment = {
    id: '',
    name: '',
    dueDate: new Date(),
    status: 'Not Started',
    notes: '',
  };

  newReflection: WeeklyReflection = {
    id: '',
    weekOf: new Date(),
    whatLearned: '',
    biggestAchievement: '',
    challengesFaced: '',
    helpNeeded: '',
    mood: 'Good',
  };

  newJourneyEntry: LearningJourneyEntry = {
    id: '',
    date: new Date(),
    skillsWorking: '',
    evidenceOfLearning: '',
    howGrown: '',
    nextSteps: '',
  };

  newProject: Project = {
    id: '',
    title: '',
    type: 'Writing Project',
    description: '',
    skillsUsed: '',
    whatLearned: '',
    files: [],
  };

  constructor() {
    // Sync form data with loaded portfolioBook
    effect(() => {
      const book = this.portfolioBookService.getPortfolioBook()();
      if (book) {
        this.profile = { ...book.profile };
        this.goals = { ...book.goals };
        this.learningStyle = { ...book.learningStyle };
      }
    });
  }

  ngOnInit(): void {
    this.subjectId = this.route.snapshot.paramMap.get('subjectId') || '';
    if (this.subjectId) {
      this.isLoading.set(true);
      this.portfolioBookService.loadPortfolioBook(this.subjectId);
      // Loading state will be cleared by the effect when data arrives
      setTimeout(() => this.isLoading.set(false), 1500);
    }
  }

  private getEmptyBook(): DigitalPortfolioBook {
    return {
      subjectId: this.subjectId,
      subjectName: 'Loading...',
      studentName: '',
      academicYear: '2024-25',
      profile: this.profile,
      goals: this.goals,
      learningStyle: this.learningStyle,
      mapScores: [],
      exactPathProgress: {
        reading: {
          currentLevel: '',
          lessonsCompleted: 0,
          totalLessons: 0,
          minutesThisWeek: 0,
          targetCompletion: '',
        },
        vocabulary: { currentLevel: '', wordsMastered: 0, accuracyRate: 0 },
        grammar: { currentLevel: '', lessonsCompleted: 0, totalLessons: 0, focusAreas: [] },
      },
      assignments: [],
      reflections: [],
      journeyEntries: [],
      milestones: [],
      projects: [],
      progress: {
        completionPercentage: 0,
        pagesCompleted: 0,
        totalPages: 9,
        reflectionsThisTerm: 0,
        projectsUploaded: 0,
      },
    };
  }

  // ============================================
  // Navigation
  // ============================================

  changePage(direction: number): void {
    const newPage = this.currentPage() + direction;
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage.set(newPage);
    }
  }

  goToPage(pageNum: number): void {
    if (pageNum >= 1 && pageNum <= this.totalPages) {
      this.currentPage.set(pageNum);
    }
  }

  // ============================================
  // Save Operations
  // ============================================

  saveProfile(): void {
    this.isSaving.set(true);
    this.portfolioBookService.saveProfile(this.subjectId, this.profile).subscribe({
      next: (success) => {
        this.isSaving.set(false);
        if (success) {
          console.log('Profile saved successfully');
        }
      },
      error: () => this.isSaving.set(false),
    });
  }

  saveGoals(): void {
    this.isSaving.set(true);
    this.portfolioBookService.saveGoals(this.subjectId, this.goals).subscribe({
      next: (success) => {
        this.isSaving.set(false);
        if (success) {
          console.log('Goals saved successfully');
        }
      },
      error: () => this.isSaving.set(false),
    });
  }

  saveLearningStyle(): void {
    this.isSaving.set(true);
    this.portfolioBookService.saveLearningStyle(this.subjectId, this.learningStyle).subscribe({
      next: (success) => {
        this.isSaving.set(false);
        if (success) {
          console.log('Learning style saved successfully');
        }
      },
      error: () => this.isSaving.set(false),
    });
  }

  addAssignment(): void {
    this.isSaving.set(true);
    this.portfolioBookService.saveAssignment(this.subjectId, this.newAssignment).subscribe({
      next: (saved) => {
        this.isSaving.set(false);
        if (saved) {
          this.newAssignment = {
            id: '',
            name: '',
            dueDate: new Date(),
            status: 'Not Started',
            notes: '',
          };
          console.log('Assignment saved successfully');
        }
      },
      error: () => this.isSaving.set(false),
    });
  }

  saveReflection(): void {
    if (this.hasTodayReflection()) {
      console.warn('Reflection already submitted for today');
      return;
    }
    this.isSaving.set(true);
    this.portfolioBookService.saveReflection(this.subjectId, this.newReflection).subscribe({
      next: (saved) => {
        this.isSaving.set(false);
        if (saved) {
          this.newReflection = {
            id: '',
            weekOf: new Date(),
            whatLearned: '',
            biggestAchievement: '',
            challengesFaced: '',
            helpNeeded: '',
            mood: 'Good',
          };
          console.log('Reflection saved successfully');
        }
      },
      error: () => this.isSaving.set(false),
    });
  }

  saveJourneyEntry(): void {
    if (this.hasTodayJourney()) {
      console.warn('Journey entry already submitted for today');
      return;
    }
    this.isSaving.set(true);
    this.portfolioBookService.saveJourneyEntry(this.subjectId, this.newJourneyEntry).subscribe({
      next: (saved) => {
        this.isSaving.set(false);
        if (saved) {
          this.newJourneyEntry = {
            id: '',
            date: new Date(),
            skillsWorking: '',
            evidenceOfLearning: '',
            howGrown: '',
            nextSteps: '',
          };
          console.log('Journey entry saved successfully');
        }
      },
      error: () => this.isSaving.set(false),
    });
  }

  saveProject(): void {
    this.isSaving.set(true);
    this.portfolioBookService
      .saveProject(this.subjectId, this.newProject, this.selectedFiles)
      .subscribe({
        next: (saved) => {
          this.isSaving.set(false);
          if (saved) {
            this.newProject = {
              id: '',
              title: '',
              type: 'Writing Project',
              description: '',
              skillsUsed: '',
              whatLearned: '',
              files: [],
            };
            this.selectedFiles = [];
            console.log('Project saved successfully');
          }
        },
        error: () => this.isSaving.set(false),
      });
  }

  // ============================================
  // Event Handlers
  // ============================================

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
    }
  }

  // Date input handling (Angular templates cannot use `new Date()`)
  onTargetDateChange(dateString: string): void {
    this.goals.targetDate = dateString ? new Date(dateString) : null;
  }

  onAssignmentDueDateChange(dateString: string): void {
    this.newAssignment.dueDate = new Date(dateString);
  }

  onReflectionWeekOfChange(dateString: string): void {
    this.newReflection.weekOf = new Date(dateString);
  }

  onJourneyDateChange(dateString: string): void {
    this.newJourneyEntry.date = new Date(dateString);
  }

  // ============================================
  // Helper Methods
  // ============================================

  getProjectIcon(type: string): string {
    const icons: Record<string, string> = {
      'Writing Project': '📖',
      'Research Report': '📝',
      'Creative Project': '🎨',
      'Group Project': '👥',
      'Digital Creation': '💻',
      Presentation: '🎭',
    };
    return icons[type] || '📁';
  }

  getStatusIcon(status: string): string {
    const icons: Record<string, string> = {
      Completed: '✅',
      Submitted: '📤',
      Graded: '⭐',
      'In Progress': '⏳',
      'Not Started': '📋',
    };
    return icons[status] || '📝';
  }
}
