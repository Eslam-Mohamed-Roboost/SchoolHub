import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-subject-portal',
  standalone: true,
  imports: [CommonModule],
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
              <i class="fas fa-calculator fs-4 text-2xl"></i>
            </div>
            <h4 class="fw-bold mb-0 text-xl font-bold">{{ subjectName() }} Portal</h4>
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
        <div class="text-center p-8 text-gray-400">
          <i class="fas fa-user-graduate text-6xl mb-4"></i>
          <h3 class="text-xl font-bold">Student Work</h3>
          <p>Student portfolios and exemplars</p>
        </div>
        }
      </div>
    </div>
  `,
  styleUrls: ['../../teacher.css'],
})
export class SubjectPortalComponent {
  activeTab = signal('lesson-plans');
  subjectName = signal('Mathematics');

  tabs = [
    { id: 'lesson-plans', label: 'Lesson Plans' },
    { id: 'assessments', label: 'Assessments' },
    { id: 'ai-tools', label: 'AI Tools' },
    { id: 'student-work', label: 'Student Work' },
  ];

  constructor(private route: ActivatedRoute) {
    const subjectId = this.route.snapshot.params['id'];
    this.subjectName.set(this.getSubjectName(subjectId));
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
}
