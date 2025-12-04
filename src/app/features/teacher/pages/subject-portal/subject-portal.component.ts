import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-subject-portal',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="subject-portal">
      <div class="bg-white border-bottom py-3 mb-4 border-b border-gray-200">
        <div class="container mx-auto px-4 d-flex align-items-center gap-3 flex items-center gap-4">
          <button
            class="btn btn-light rounded-circle p-2 rounded-full hover:bg-gray-200"
            onclick="history.back()"
          >
            <i class="fas fa-arrow-left"></i>
          </button>
          <div class="d-flex align-items-center gap-3 flex items-center gap-3">
            <div class="rounded-3 p-2 rounded-lg bg-indigo-100 text-indigo-600">
              <i class="fas fa-folder-open fs-4 text-2xl"></i>
            </div>
            <div>
              <h4 class="fw-bold mb-1 text-xl font-bold">Student Portfolio Hub</h4>
              <p class="mb-0 text-muted small">
                Reviewing portfolios for <strong>{{ subjectName() }}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="container mx-auto px-4">
        <!-- Tabs -->
        <ul class="nav nav-pills mb-4 gap-2 flex gap-2 mb-6">
          @for (tab of tabs; track tab.id) {
          <li class="nav-item">
            <button
              [class]="
                activeTab() === tab.id
                  ? 'nav-link active bg-cyan-500 text-white'
                  : 'nav-link bg-white text-dark border border-gray-200'
              "
              (click)="activeTab.set(tab.id)"
              class="px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              {{ tab.label }}
            </button>
          </li>
          }
        </ul>

        <!-- Tab Content -->
        @if (activeTab() === 'lesson-plans') {
        <div class="card border-0 shadow-sm rounded-4 bg-white rounded-2xl shadow-sm">
          <div
            class="card-header bg-white border-bottom py-3 p-4 border-b border-gray-200 flex justify-between items-center"
          >
            <h5 class="fw-bold mb-0 font-bold text-lg">📂 Term 1 Resources</h5>
            <button
              class="btn btn-primary btn-sm rounded-pill bg-cyan-500 text-white px-4 py-2 rounded-full text-sm"
            >
              <i class="fas fa-plus me-1"></i> Upload
            </button>
          </div>
          <div class="list-group list-group-flush divide-y divide-gray-100">
            <div
              class="list-group-item py-3 p-4 d-flex align-items-center justify-content-between hover-bg flex justify-between items-center"
            >
              <div class="d-flex align-items-center gap-3 flex items-center gap-4">
                <i class="fas fa-folder text-warning fs-4 text-yellow-500 text-2xl"></i>
                <div>
                  <h6 class="mb-0 fw-bold font-bold">Unit 1: Algebra Basics</h6>
                  <small class="text-muted text-gray-500">Updated 2 days ago</small>
                </div>
              </div>
              <i class="fas fa-chevron-right text-muted opacity-25"></i>
            </div>
          </div>
        </div>
        } @if (activeTab() === 'assessments') {
        <div class="text-center p-8 text-gray-400">
          <i class="fas fa-clipboard-list text-6xl mb-4"></i>
          <h3 class="text-xl font-bold">Assessments</h3>
          <p>Quizzes and exams will appear here</p>
        </div>
        } @if (activeTab() === 'ai-tools') {
        <div class="text-center p-8 text-gray-400">
          <i class="fas fa-robot text-6xl mb-4"></i>
          <h3 class="text-xl font-bold">AI Tools</h3>
          <p>Recommended AI tools for this subject</p>
        </div>
        } @if (activeTab() === 'student-work') {
        <div class="card border-0 shadow-sm rounded-4">
          <div
            class="card-header bg-white border-bottom py-3 px-4 d-flex justify-content-between align-items-center"
          >
            <div>
              <h5 class="fw-bold mb-0">
                <i class="fas fa-folder-open text-primary me-2"></i>Student Portfolios
              </h5>
              <p class="text-muted small mb-0">{{ students.length }} students in this class</p>
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
          <div class="list-group list-group-flush">
            @for (student of students; track student.id) {
            <a
              [routerLink]="['/teacher/portfolio', student.id, subjectId]"
              class="list-group-item list-group-item-action py-3"
            >
              <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center gap-3">
                  <div
                    class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                    style="width: 45px; height: 45px; font-weight: bold;"
                  >
                    {{ getInitials(student.name) }}
                  </div>
                  <div>
                    <h6 class="mb-1 fw-bold">{{ student.name }}</h6>
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

  activeTab = signal('lesson-plans');
  subjectName = signal('Mathematics');
  subjectId = '';
  students: any[] = [];

  tabs = [
    { id: 'lesson-plans', label: 'Lesson Plans' },
    { id: 'assessments', label: 'Assessments' },
    { id: 'ai-tools', label: 'AI Tools' },
    { id: 'student-work', label: 'Student Work' },
  ];

  ngOnInit(): void {
    this.subjectId = this.route.snapshot.params['id'] || 'math';
    this.subjectName.set(this.getSubjectName(this.subjectId));
    this.students = this.portfolioService.getStudents(this.subjectId);
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
    return this.students.filter((s) => s.portfolioStatus === status).length;
  }
}
