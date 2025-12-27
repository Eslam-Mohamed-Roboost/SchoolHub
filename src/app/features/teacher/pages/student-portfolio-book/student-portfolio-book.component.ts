import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  PortfolioBookService,
  MapScore,
  ExactPathProgress,
  ReadingProgress,
  VocabularyProgress,
  GrammarProgress,
} from '../../services/portfolio-book.service';

@Component({
  selector: 'app-student-portfolio-book',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-portfolio-book.component.html',
  styleUrl: './student-portfolio-book.component.scss',
})
export class StudentPortfolioBookComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private portfolioBookService = inject(PortfolioBookService);

  // Route params
  studentId = signal('');
  subjectId = signal('');

  // State
  portfolioBook = this.portfolioBookService.getPortfolioBook();
  isLoading = this.portfolioBookService.getIsLoading();
  isSaving = this.portfolioBookService.getIsSaving();

  // Active tab
  activeTab = signal<'map-score' | 'exact-path' | 'overview'>('overview');

  // Map Score Form
  newMapScore = signal<{
    term: 'Fall' | 'Winter' | 'Spring';
    year: number;
    score: number;
    dateTaken: string;
    percentile: number | null;
  }>({
    term: 'Fall',
    year: new Date().getFullYear(),
    score: 0,
    dateTaken: new Date().toISOString().split('T')[0],
    percentile: null,
  });

  // Exact Path Form
  exactPathForm = signal<{
    reading: ReadingProgress;
    vocabulary: VocabularyProgress;
    grammar: GrammarProgress;
  }>({
    reading: {
      currentLevel: '',
      lessonsCompleted: 0,
      totalLessons: 0,
      minutesThisWeek: 0,
      targetCompletion: '',
    },
    vocabulary: {
      currentLevel: '',
      wordsMastered: 0,
      accuracyRate: 0,
    },
    grammar: {
      currentLevel: '',
      lessonsCompleted: 0,
      totalLessons: 0,
      focusAreas: [],
    },
  });

  grammarFocusAreasInput = signal('');

  // Computed
  hasMapScores = computed(() => (this.portfolioBook()?.mapScores.length ?? 0) > 0);
  hasExactPath = computed(() => this.portfolioBook()?.exactPathProgress !== null);

  currentYear = new Date().getFullYear();
  yearOptions = [this.currentYear - 1, this.currentYear, this.currentYear + 1];

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const studentId = params['studentId'];
      const subjectId = params['subjectId'];
      if (studentId && subjectId) {
        this.studentId.set(studentId);
        this.subjectId.set(subjectId);
        this.portfolioBookService.loadStudentPortfolioBook(studentId, subjectId);
      }
    });
  }

  setActiveTab(tab: 'map-score' | 'exact-path' | 'overview'): void {
    this.activeTab.set(tab);

    // Pre-fill Exact Path form if data exists
    if (tab === 'exact-path') {
      const book = this.portfolioBook();
      if (book?.exactPathProgress) {
        this.exactPathForm.set({
          reading: book.exactPathProgress.reading ?? {
            currentLevel: '',
            lessonsCompleted: 0,
            totalLessons: 0,
            minutesThisWeek: 0,
            targetCompletion: '',
          },
          vocabulary: book.exactPathProgress.vocabulary ?? {
            currentLevel: '',
            wordsMastered: 0,
            accuracyRate: 0,
          },
          grammar: book.exactPathProgress.grammar ?? {
            currentLevel: '',
            lessonsCompleted: 0,
            totalLessons: 0,
            focusAreas: [],
          },
        });
        this.grammarFocusAreasInput.set(
          book.exactPathProgress.grammar?.focusAreas.join(', ') ?? ''
        );
      }
    }
  }

  // Map Score Methods
  updateMapScoreTerm(value: string): void {
    this.newMapScore.update((current) => ({ ...current, term: value as 'Fall' | 'Winter' | 'Spring' }));
  }

  updateMapScoreYear(value: number): void {
    this.newMapScore.update((current) => ({ ...current, year: value }));
  }

  updateMapScoreScore(value: number): void {
    this.newMapScore.update((current) => ({ ...current, score: value }));
  }

  updateMapScorePercentile(value: number | null): void {
    this.newMapScore.update((current) => ({ ...current, percentile: value }));
  }

  updateMapScoreDateTaken(value: string): void {
    this.newMapScore.update((current) => ({ ...current, dateTaken: value }));
  }

  saveMapScore(): void {
    const form = this.newMapScore();
    this.portfolioBookService
      .updateMapScore({
        studentId: this.studentId(),
        subjectId: this.subjectId(),
        term: form.term,
        year: form.year,
        score: form.score,
        dateTaken: new Date(form.dateTaken),
        percentile: form.percentile,
      })
      .subscribe({
        next: (result) => {
          if (result) {
            // Reset form
            this.newMapScore.set({
              term: 'Fall',
              year: this.currentYear,
              score: 0,
              dateTaken: new Date().toISOString().split('T')[0],
              percentile: null,
            });
          }
        },
      });
  }

  // Exact Path Methods
  updateReadingField<K extends keyof ReadingProgress>(field: K, value: string | number): void {
    this.exactPathForm.update((current) => ({
      ...current,
      reading: { ...current.reading, [field]: value },
    }));
  }

  updateVocabularyField<K extends keyof VocabularyProgress>(field: K, value: string | number): void {
    this.exactPathForm.update((current) => ({
      ...current,
      vocabulary: { ...current.vocabulary, [field]: value },
    }));
  }

  updateGrammarField<K extends keyof GrammarProgress>(field: K, value: string | number): void {
    this.exactPathForm.update((current) => ({
      ...current,
      grammar: { ...current.grammar, [field]: value },
    }));
  }

  updateGrammarFocusAreas(value: string): void {
    this.grammarFocusAreasInput.set(value);
    const areas = value
      .split(',')
      .map((a) => a.trim())
      .filter((a) => a.length > 0);
    this.exactPathForm.update((current) => ({
      ...current,
      grammar: { ...current.grammar, focusAreas: areas },
    }));
  }

  saveExactPath(): void {
    const form = this.exactPathForm();
    this.portfolioBookService
      .updateExactPath({
        studentId: this.studentId(),
        subjectId: this.subjectId(),
        reading: form.reading,
        vocabulary: form.vocabulary,
        grammar: form.grammar,
      })
      .subscribe();
  }

  goBack(): void {
    this.router.navigate(['/teacher/portfolio']);
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
