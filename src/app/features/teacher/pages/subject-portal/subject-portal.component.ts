import { Component, signal, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PortfolioService } from '../../services/portfolio.service';
import { HttpClient } from '@angular/common/http';
import { Teacher_API_ENDPOINTS } from '../../../../config/TeacherConfig/TeacherEndpoint';
import { environment } from '../../../../config/environment';

@Component({
  selector: 'app-subject-portal',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="subject-portal">
      <!-- Header -->
      <div class="bg-white border-bottom shadow-sm sticky top-0 z-10">
        <div class="container mx-auto px-4 py-4">
          <div class="d-flex align-items-center gap-3">
            <button
              class="btn btn-light rounded-circle p-2"
              (click)="goBack()"
              type="button"
            >
              <i class="fas fa-arrow-left"></i>
            </button>
            <div class="d-flex align-items-center gap-3 flex-grow-1">
              <div class="rounded p-2 bg-indigo-100 text-indigo-600">
                <i class="fas fa-folder-open fs-4"></i>
              </div>
              <div class="flex-grow-1">
                <h4 class="fw-bold mb-1">Student Portfolio Hub</h4>
                <p class="mb-0 text-muted small">
                  @if (selectedSubjectId()) {
                    Reviewing portfolios for <strong>{{ subjectName() }}</strong>
                  } @else {
                    Viewing all students
                  }
                </p>
              </div>
              <div>
                @if (subjects().length === 0) {
                <div class="text-muted small">
                  <i class="fas fa-spinner fa-spin me-1"></i>Loading subjects...
                </div>
                } @else {
                <select 
                  class="form-select form-select-sm" 
                  style="min-width: 200px; display: block;"
                  [ngModel]="selectedSubjectId()"
                  (ngModelChange)="onSubjectChange($event)">
                  <option [value]="null">All Students</option>
                  @for (subject of subjects(); track subject.Id) {
                    <option [value]="subject.Id">{{ subject.Name }}</option>
                  }
                </select>
                <small class="text-muted d-block mt-1">
                  {{ subjects().length }} subject{{ subjects().length !== 1 ? 's' : '' }} available
                </small>
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="container mx-auto px-4 py-4">
        <!-- Tabs -->
        <ul class="nav nav-pills mb-4">
          @for (tab of tabs; track tab.id) {
          <li class="nav-item">
            <button
              [class]="
                activeTab() === tab.id
                  ? 'nav-link active'
                  : 'nav-link'
              "
              (click)="activeTab.set(tab.id)"
              type="button"
            >
              {{ tab.label }}
            </button>
          </li>
          }
        </ul>

        <!-- Tab Content -->
        @if (activeTab() === 'lesson-plans') {
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white border-bottom py-3 px-4 d-flex justify-content-between align-items-center">
            <h5 class="fw-bold mb-0">📂 Term 1 Resources</h5>
            <button class="btn btn-primary btn-sm" type="button">
              <i class="fas fa-plus me-1"></i> Upload
            </button>
          </div>
          <div class="list-group list-group-flush">
            <div class="list-group-item py-3 px-4 d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center gap-3">
                <i class="fas fa-folder text-warning fs-4"></i>
                <div>
                  <h6 class="mb-0 fw-bold">Unit 1: Algebra Basics</h6>
                  <small class="text-muted">Updated 2 days ago</small>
                </div>
              </div>
              <i class="fas fa-chevron-right text-muted"></i>
            </div>
          </div>
        </div>
        } @if (activeTab() === 'assessments') {
        <div class="text-center p-5">
          <i class="fas fa-clipboard-list fs-1 text-muted mb-3"></i>
          <h3 class="fw-bold">Assessments</h3>
          <p class="text-muted">Quizzes and exams will appear here</p>
        </div>
        } @if (activeTab() === 'ai-tools') {
        <div class="text-center p-5">
          <i class="fas fa-robot fs-1 text-muted mb-3"></i>
          <h3 class="fw-bold">AI Tools</h3>
          <p class="text-muted">Recommended AI tools for this subject</p>
        </div>
        } @if (activeTab() === 'student-work') {
        <div class="card border-0 shadow-sm">
          <div
            class="card-header bg-white border-bottom py-3 px-4 d-flex justify-content-between align-items-center"
          >
            <div>
              <h5 class="fw-bold mb-0">
                <i class="fas fa-folder-open text-primary me-2"></i>Student Portfolios
              </h5>
              <p class="text-muted small mb-0">
                {{ students().length }} student{{ students().length !== 1 ? 's' : '' }}
                @if (selectedSubjectId()) {
                  in {{ subjectName() }}
                } @else {
                  across all subjects
                }
              </p>
            </div>
            <div class="d-flex gap-2">
              <span class="badge bg-success">{{ getStatusCount('reviewed') }} Reviewed</span>
              <span class="badge bg-warning text-dark"
                >{{ getStatusCount('pending') }} Pending</span
              >
              <span class="badge bg-danger"
                >{{ getStatusCount('needs-revision') }} Needs Revision</span
              >
            </div>
          </div>
          @if (!selectedSubjectId()) {
          <div class="alert alert-info m-4">
            <i class="fas fa-info-circle me-2"></i>
            Please select a subject from the dropdown above to view student portfolios.
          </div>
          }
          <div class="list-group list-group-flush">
            @if (students().length === 0) {
            <div class="list-group-item text-center py-5">
              <i class="fas fa-users fs-1 text-muted mb-3"></i>
              <p class="text-muted mb-0">No students found</p>
            </div>
            } @else {
            @for (student of students(); track student.id) {
            <a
              [routerLink]="selectedSubjectId() && selectedSubjectId() !== 'null' ? ['/teacher/portfolio', student.id, selectedSubjectId()] : null"
              [class.disabled]="!selectedSubjectId() || selectedSubjectId() === 'null'"
              class="list-group-item list-group-item-action py-3"
              (click)="(!selectedSubjectId() || selectedSubjectId() === 'null') && $event.preventDefault()"
              [title]="(!selectedSubjectId() || selectedSubjectId() === 'null') ? 'Please select a subject first' : 'View portfolio'"
            >
              <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center gap-3">
                  <div
                    class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                    style="width: 45px; height: 45px; font-weight: bold; font-size: 0.875rem;"
                  >
                    {{ getInitials(student.name) }}
                  </div>
                  <div>
                    <h6 class="mb-1 fw-bold">{{ student.name }}</h6>
                    <small class="text-muted d-block mb-1">
                      <i class="fas fa-users me-1"></i>{{ student.className || 'No class assigned' }}
                    </small>
                    @if (student.latestSubmission) {
                    <small class="text-muted">
                      <i class="fas fa-file-alt me-1"></i>
                      {{ student.latestSubmission.title }} •
                      {{ formatDate(student.latestSubmission.submittedAt) }}
                    </small>
                    } @else {
                    <small class="text-muted">
                      <i class="fas fa-inbox me-1"></i>No submissions yet
                    </small>
                    }
                  </div>
                </div>
                <div class="d-flex align-items-center gap-3">
                  @if (student.portfolioStatus === 'reviewed') {
                  <span class="badge bg-success">
                    <i class="fas fa-check-circle me-1"></i>Reviewed
                  </span>
                  } @else if (student.portfolioStatus === 'pending') {
                  <span class="badge bg-warning text-dark">
                    <i class="fas fa-clock me-1"></i>Pending
                  </span>
                  } @else if (student.portfolioStatus === 'needs-revision') {
                  <span class="badge bg-danger">
                    <i class="fas fa-exclamation-circle me-1"></i>Needs Revision
                  </span>
                  }
                  <i class="fas fa-chevron-right text-muted"></i>
                </div>
              </div>
            </a>
            }
            }
          </div>
        </div>
        }
      </div>
    </div>
  `,
  styleUrls: ['../../teacher.css'],
})
export class SubjectPortalComponent implements OnInit {
  private portfolioService = inject(PortfolioService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);

  activeTab = signal('lesson-plans');
  subjectName = signal('All Students');
  subjectId = '';
  selectedSubjectId = signal<string | null>(null);
  students = this.portfolioService.getStudentsSignal();
  subjects = signal<Array<{ Id: string; Name: string; Icon?: string }>>([]);

  tabs = [
    { id: 'lesson-plans', label: 'Lesson Plans' },
    { id: 'assessments', label: 'Assessments' },
    { id: 'ai-tools', label: 'AI Tools' },
    { id: 'student-work', label: 'Student Work' },
  ];

  constructor() {
    // Load students when subject filter changes
    effect(() => {
      const subjectId = this.selectedSubjectId();
      this.loadStudents(subjectId || undefined);
    });
  }

  ngOnInit(): void {
    // Subscribe to route params to handle navigation changes
    this.route.params.subscribe(params => {
      this.subjectId = params['id'] || '';
      if (this.subjectId) {
        // If subject ID provided in route, use it
        this.selectedSubjectId.set(this.subjectId);
      } else {
        // Otherwise, show all students
        this.selectedSubjectId.set(null);
      }
    });
    this.loadSubjects();
    // Initial load will be handled by the effect in constructor
  }

  loadSubjects(): void {
    // Load only subjects assigned to this teacher
    const url = `${environment.apiUrl}/${Teacher_API_ENDPOINTS.Portfolio.MY_SUBJECTS}`.replace(/\/+/g, '/').replace(':/', '://');
    console.log('Loading teacher subjects from:', url);
    this.http.get<any>(url).subscribe({
      next: (response) => {
        console.log('Teacher subjects API response:', response);
        let subjectsData: any[] = [];
        // Handle API response wrapper
        if (response && typeof response === 'object') {
          if ('IsSuccess' in response && response.IsSuccess && response.Data) {
            subjectsData = Array.isArray(response.Data) ? response.Data : [];
          } else if ('isSuccess' in response && response.isSuccess && response.data) {
            subjectsData = Array.isArray(response.data) ? response.data : [];
          } else if (Array.isArray(response)) {
            subjectsData = response;
          } else if (response?.Data && Array.isArray(response.Data)) {
            subjectsData = response.Data;
          }
        }

        console.log('Extracted subjects data:', subjectsData);
        const mappedSubjects = subjectsData.map((s) => ({
          Id: String(s.SubjectId || s.subjectId || s.Id || s.id || ''),
          Name: s.SubjectName || s.subjectName || s.Name || s.name || '',
          Icon: s.Icon || s.icon,
        }));
        console.log('Mapped subjects:', mappedSubjects);
        console.log('Subjects signal before update:', this.subjects());
        this.subjects.set(mappedSubjects);
        console.log('Subjects signal after update:', this.subjects());
        console.log('Subjects length:', this.subjects().length);
      },
      error: (err) => {
        console.error('Failed to load teacher subjects', err);
        this.subjects.set([]);
      },
    });
  }

  loadStudents(subjectId?: string): void {
    if (subjectId) {
      this.subjectName.set(
        this.subjects().find((s) => s.Id === subjectId)?.Name || 'Subject'
      );
    } else {
      this.subjectName.set('All Students');
    }

    // Load students - the service will update its signal, which we're already subscribed to
    this.portfolioService.getStudents(subjectId);
  }

  onSubjectChange(value: string | null): void {
    console.log('Subject changed to:', value);
    this.selectedSubjectId.set(value);
    this.onSubjectFilterChange();
  }

  onSubjectFilterChange(): void {
    const subjectId = this.selectedSubjectId();
    if (subjectId) {
      this.subjectName.set(
        this.subjects().find((s) => s.Id === subjectId)?.Name || 'Subject'
      );
    } else {
      this.subjectName.set('All Students');
    }
    this.loadStudents(subjectId || undefined);
  }

  private getSubjectName(id: string): string {
    const names: { [key: string]: string } = {
      math: 'Mathematics',
      science: 'Science',
      english: 'English Language Arts',
      arabic: 'Arabic Language',
      islamic: 'Islamic Studies',
      social: 'Social Studies',
      pe: 'Physical Education',
      arts: 'Arts',
    };
    return names[id] || 'Subject';
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - d.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  getStatusCount(status: string): number {
    return this.students().filter((s) => s.portfolioStatus === status).length;
  }

  goBack(): void {
    this.router.navigate(['/teacher/dashboard']);
  }
}
