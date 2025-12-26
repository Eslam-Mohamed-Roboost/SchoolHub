import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { GradeService } from '../../services/grade.service';
import { Grade, LetterGrade, GradeStatus } from '../../models/grade.model';
import { ToastService } from '../../../../shared/services/toast.service';
import { ClassService } from '../../services/class.service';

@Component({
  selector: 'app-student-grades',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto px-4 py-6">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-0">
            <i class="fas fa-graduation-cap me-2"></i>Student Grades
          </h2>
          <p class="text-muted mb-0">
            @if (studentName()) {
              {{ studentName() }}
            } @else {
              Loading student information...
            }
          </p>
        </div>
        <button 
          class="btn btn-outline-secondary"
          (click)="goBack()">
          <i class="fas fa-arrow-left me-1"></i>Back
        </button>
      </div>

      <!-- Filters -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-3">
              <label class="form-label small fw-bold">Subject</label>
              <select 
                class="form-select form-select-sm"
                [value]="selectedSubjectId()"
                (change)="onSubjectFilterChange($any($event.target).value)">
                <option value="">All Subjects</option>
                @for (subject of availableSubjects(); track subject.id) {
                  <option [value]="subject.id">{{ subject.name }}</option>
                }
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label small fw-bold">Term</label>
              <select 
                class="form-select form-select-sm"
                [value]="selectedTerm()"
                (change)="onTermFilterChange($any($event.target).value)">
                <option value="">All Terms</option>
                <option value="Term 1">Term 1</option>
                <option value="Term 2">Term 2</option>
                <option value="Term 3">Term 3</option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label small fw-bold">Year</label>
              <input 
                type="number"
                class="form-control form-control-sm"
                [value]="selectedYear()"
                (change)="onYearFilterChange($any($event.target).value)"
                placeholder="e.g. 2025"
                min="2020"
                max="2030" />
            </div>
            <div class="col-md-3 d-flex align-items-end">
              <button 
                class="btn btn-sm btn-outline-secondary w-100"
                (click)="clearFilters()">
                <i class="fas fa-times me-1"></i>Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Statistics -->
      @if (gradesSummary()) {
        <div class="row g-3 mb-4">
          <div class="col-md-3">
            <div class="card border-0 shadow-sm">
              <div class="card-body text-center">
                <h6 class="text-muted small mb-2">Average Score</h6>
                <h3 class="fw-bold text-primary mb-0">{{ gradesSummary()!.averageScore.toFixed(1) }}%</h3>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card border-0 shadow-sm">
              <div class="card-body text-center">
                <h6 class="text-muted small mb-2">Total Grades</h6>
                <h3 class="fw-bold text-info mb-0">{{ filteredGrades().length }}</h3>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card border-0 shadow-sm">
              <div class="card-body text-center">
                <h6 class="text-muted small mb-2">Highest Score</h6>
                <h3 class="fw-bold text-success mb-0">{{ gradesSummary()!.highestScore.toFixed(1) }}%</h3>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card border-0 shadow-sm">
              <div class="card-body text-center">
                <h6 class="text-muted small mb-2">Lowest Score</h6>
                <h3 class="fw-bold text-danger mb-0">{{ gradesSummary()!.lowestScore.toFixed(1) }}%</h3>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Grades Table -->
      @if (loading()) {
        <div class="text-center py-5">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      } @else if (filteredGrades().length === 0) {
        <div class="alert alert-info">
          <i class="fas fa-info-circle me-2"></i>
          @if (hasActiveFilters()) {
            No grades found matching the selected filters.
          } @else {
            No grades found for this student.
          }
        </div>
      } @else {
        <div class="card">
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Assessment</th>
                    <th>Type</th>
                    <th>Score</th>
                    <th>Percentage</th>
                    <th>Letter Grade</th>
                    <th>Term</th>
                    <th>Year</th>
                    <th>Status</th>
                    <th>Graded By</th>
                    <th>Graded At</th>
                  </tr>
                </thead>
                <tbody>
                  @for (grade of filteredGrades(); track grade.id) {
                    <tr>
                      <td>
                        <strong>{{ grade.subjectName }}</strong>
                      </td>
                      <td>
                        @if (grade.exerciseTitle) {
                          <span class="badge bg-info">{{ grade.exerciseTitle }}</span>
                        } @else if (grade.examinationTitle) {
                          <span class="badge bg-warning text-dark">{{ grade.examinationTitle }}</span>
                        } @else {
                          <span class="text-muted">Manual Grade</span>
                        }
                      </td>
                      <td>
                        @if (grade.exerciseId) {
                          <span class="badge bg-primary">Exercise</span>
                        } @else if (grade.examinationId) {
                          <span class="badge bg-warning text-dark">Exam</span>
                        } @else {
                          <span class="badge bg-secondary">Manual</span>
                        }
                      </td>
                      <td>
                        <strong>{{ grade.score }} / {{ grade.maxScore }}</strong>
                      </td>
                      <td>
                        <span [class]="getPercentageClass(grade.percentage)">
                          {{ grade.percentage.toFixed(1) }}%
                        </span>
                      </td>
                      <td>
                        @if (grade.letterGrade) {
                          <span [class]="getLetterGradeClass(grade.letterGrade)">
                            {{ grade.letterGrade }}
                          </span>
                        } @else {
                          <span class="text-muted">-</span>
                        }
                      </td>
                      <td>{{ grade.term || '-' }}</td>
                      <td>{{ grade.year }}</td>
                      <td>
                        <span [class]="getStatusClass(grade.status)">
                          {{ grade.status }}
                        </span>
                      </td>
                      <td>{{ grade.graderName }}</td>
                      <td>{{ formatDate(grade.gradedAt) }}</td>
                    </tr>
                    @if (grade.notes) {
                      <tr class="table-light">
                        <td colspan="11" class="small text-muted">
                          <i class="fas fa-sticky-note me-1"></i><strong>Notes:</strong> {{ grade.notes }}
                        </td>
                      </tr>
                    }
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class StudentGradesComponent implements OnInit {
  private gradeService = inject(GradeService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private classService = inject(ClassService);

  grades = signal<Grade[]>([]);
  loading = signal(true);
  studentId = signal<string | null>(null);
  classId = signal<string | null>(null);
  studentName = signal<string>('');
  
  selectedSubjectId = signal<string>('');
  selectedTerm = signal<string>('');
  selectedYear = signal<number | null>(null);

  availableSubjects = computed(() => {
    const subjects = new Map<string, { id: string; name: string }>();
    this.grades().forEach(grade => {
      if (!subjects.has(grade.subjectId)) {
        subjects.set(grade.subjectId, {
          id: grade.subjectId,
          name: grade.subjectName
        });
      }
    });
    return Array.from(subjects.values()).sort((a, b) => a.name.localeCompare(b.name));
  });

  filteredGrades = computed(() => {
    let filtered = this.grades();
    
    if (this.selectedSubjectId()) {
      filtered = filtered.filter(g => g.subjectId === this.selectedSubjectId());
    }
    
    if (this.selectedTerm()) {
      filtered = filtered.filter(g => g.term === this.selectedTerm());
    }
    
    if (this.selectedYear() !== null) {
      filtered = filtered.filter(g => g.year === this.selectedYear());
    }
    
    return filtered.sort((a, b) => {
      // Sort by year desc, then term, then graded date desc
      if (a.year !== b.year) return b.year - a.year;
      if (a.term && b.term && a.term !== b.term) return a.term.localeCompare(b.term);
      return b.gradedAt.getTime() - a.gradedAt.getTime();
    });
  });

  gradesSummary = computed(() => {
    const filtered = this.filteredGrades();
    if (filtered.length === 0) return null;
    
    const percentages = filtered.map(g => g.percentage);
    const average = percentages.reduce((a, b) => a + b, 0) / percentages.length;
    const highest = Math.max(...percentages);
    const lowest = Math.min(...percentages);
    
    return {
      averageScore: average,
      highestScore: highest,
      lowestScore: lowest,
    };
  });

  hasActiveFilters = computed(() => {
    return this.selectedSubjectId() !== '' || 
           this.selectedTerm() !== '' || 
           this.selectedYear() !== null;
  });

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const studentId = params['studentId'];
      const classId = params['classId'];
      
      if (!studentId) {
        this.toastService.showMessage('Student ID is required', 'error');
        this.goBack();
        return;
      }
      
      this.studentId.set(studentId);
      this.classId.set(classId || null);
      
      this.loadGrades();
    });
  }

  loadGrades(): void {
    const studentId = this.studentId();
    if (!studentId) return;
    
    this.loading.set(true);
    this.gradeService.getStudentGrades(
      studentId,
      this.classId() || undefined,
      this.selectedSubjectId() || undefined,
      this.selectedTerm() || undefined,
      this.selectedYear() || undefined
    ).subscribe({
      next: (grades) => {
        this.grades.set(grades);
        if (grades.length > 0) {
          this.studentName.set(grades[0].studentName);
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load grades', err);
        this.toastService.showMessage('Failed to load student grades', 'error');
        this.loading.set(false);
      },
    });
  }

  onSubjectFilterChange(subjectId: string): void {
    this.selectedSubjectId.set(subjectId);
    this.loadGrades();
  }

  onTermFilterChange(term: string): void {
    this.selectedTerm.set(term);
    this.loadGrades();
  }

  onYearFilterChange(year: string): void {
    const yearNum = year ? parseInt(year, 10) : null;
    this.selectedYear.set(isNaN(yearNum!) ? null : yearNum);
    this.loadGrades();
  }

  clearFilters(): void {
    this.selectedSubjectId.set('');
    this.selectedTerm.set('');
    this.selectedYear.set(null);
    this.loadGrades();
  }

  getPercentageClass(percentage: number): string {
    if (percentage >= 90) return 'text-success fw-bold';
    if (percentage >= 80) return 'text-primary fw-bold';
    if (percentage >= 70) return 'text-info fw-bold';
    if (percentage >= 60) return 'text-warning fw-bold';
    return 'text-danger fw-bold';
  }

  getLetterGradeClass(letterGrade: LetterGrade): string {
    const classes: Record<LetterGrade, string> = {
      'A': 'badge bg-success',
      'B': 'badge bg-primary',
      'C': 'badge bg-info',
      'D': 'badge bg-warning',
      'F': 'badge bg-danger',
    };
    return classes[letterGrade] || 'badge bg-secondary';
  }

  getStatusClass(status: GradeStatus): string {
    const classes: Record<GradeStatus, string> = {
      'Draft': 'badge bg-secondary',
      'PendingApproval': 'badge bg-warning text-dark',
      'Approved': 'badge bg-success',
      'Rejected': 'badge bg-danger',
    };
    return classes[status] || 'badge bg-secondary';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  goBack(): void {
    const classId = this.classId();
    if (classId) {
      this.router.navigate(['/teacher/class', classId, 'students']);
    } else {
      this.router.navigate(['/teacher/my-classes']);
    }
  }
}

