import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CpdService } from '../../services/cpd.service';

@Component({
  selector: 'app-learning-vault',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="learning-vault container mx-auto px-4 py-8">
      <div
        class="d-flex justify-content-between align-items-center mb-4 flex justify-between items-center mb-6"
      >
        <div>
          <h2 class="fw-bold mb-1 text-2xl font-bold">
            <i class="fas fa-vault text-warning text-yellow-500 me-2"></i>Learning Vault
          </h2>
          <p class="text-muted mb-0 text-gray-500">
            Secure storage for exams, answer keys, and confidential records.
          </p>
        </div>
        <button
          class="btn btn-outline-primary rounded-pill px-4 border-cyan-500 text-cyan-600 hover:bg-cyan-50 rounded-full"
        >
          <i class="fas fa-upload me-2"></i>Secure Upload
        </button>
      </div>

      <!-- CPD Training Modules Section -->
      <div class="mb-5">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 class="fw-bold mb-1">
              <i class="fas fa-graduation-cap text-primary me-2"></i>CPD Training Modules
            </h3>
            <p class="text-muted mb-0">Professional development courses for educators</p>
          </div>
        </div>

        <!-- CPD Progress Overview -->
        <div class="row mb-4">
          <div class="col-12">
            <div
              class="card border-0 shadow-sm rounded-4 p-4 bg-gradient-primary text-white"
              style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);"
            >
              <div class="row align-items-center">
                <div class="col-md-8">
                  <h5 class="fw-bold mb-2">Your CPD Progress</h5>
                  <div
                    class="progress rounded-pill mb-2"
                    style="height: 12px; background-color: rgba(255,255,255,0.3);"
                  >
                    <div
                      class="progress-bar bg-white"
                      role="progressbar"
                      [style.width.%]="progressPercentage"
                      [attr.aria-valuenow]="progress.hoursCompleted"
                      [attr.aria-valuemin]="0"
                      [attr.aria-valuemax]="progress.targetHours"
                    ></div>
                  </div>
                  <div class="d-flex gap-4 small">
                    <span
                      ><i class="fas fa-clock me-1"></i>{{ progress.hoursCompleted }} /
                      {{ progress.targetHours }} hours</span
                    >
                    <span
                      ><i class="fas fa-check-circle me-1"></i>{{ progress.completedModules }} /
                      {{ progress.totalModules }} modules</span
                    >
                    <span
                      ><i class="fas fa-calendar me-1"></i>Last activity:
                      {{ formatDate(progress.lastActivityDate) }}</span
                    >
                  </div>
                </div>
                <div class="col-md-4 text-end">
                  <div class="display-4 fw-bold">{{ progressPercentage }}%</div>
                  <small>Complete</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Training Modules Grid -->
        <div class="row g-4 mb-5">
          @for (module of modules; track module.id) {
          <div class="col-md-3 col-sm-6">
            <a
              [routerLink]="['/teacher/learning-vault/module', module.id]"
              class="card border-0 shadow-sm rounded-4 p-4 h-100 hover-card text-decoration-none"
              style="cursor: pointer;"
            >
              <div class="text-center">
                <div
                  class="icon-circle mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
                  [style.background]="module.bgColor"
                  [style.color]="module.color"
                  style="width: 60px; height: 60px;"
                >
                  <i [class]="module.icon" class="fs-3"></i>
                </div>
                <h6 class="fw-bold mb-2 text-dark">{{ module.title }}</h6>
                <p class="text-muted small mb-2">
                  <i class="fas fa-clock me-1"></i>{{ module.duration }} min
                </p>

                <!-- Status Badge -->
                @if (module.status === 'completed') {
                <span class="badge bg-success mb-2">
                  <i class="fas fa-check-circle me-1"></i>Completed
                </span>
                } @else if (module.status === 'in-progress') {
                <span class="badge bg-warning text-dark mb-2">
                  <i class="fas fa-spinner me-1"></i>In Progress
                </span>
                } @else {
                <span class="badge bg-secondary mb-2">
                  <i class="fas fa-circle me-1"></i>Not Started
                </span>
                }

                <!-- Action Button -->
                <div class="mt-3">
                  @if (module.status === 'completed') {
                  <button class="btn btn-sm btn-outline-primary rounded-pill px-3">
                    <i class="fas fa-redo me-1"></i>Review
                  </button>
                  } @else if (module.status === 'in-progress') {
                  <button class="btn btn-sm btn-primary rounded-pill px-3">
                    <i class="fas fa-play me-1"></i>Resume
                  </button>
                  } @else {
                  <button class="btn btn-sm btn-outline-secondary rounded-pill px-3">
                    <i class="fas fa-play me-1"></i>Start
                  </button>
                  }
                </div>
              </div>
            </a>
          </div>
          }
        </div>
      </div>

      <!-- Divider -->
      <hr class="my-5" />

      <!-- Secure Folders Grid -->
      <div class="row g-4 mb-5 grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div class="col-md-3">
          <div
            class="card border-0 shadow-sm rounded-4 p-4 h-100 hover-card text-center bg-white rounded-2xl shadow-sm p-6"
          >
            <i class="fas fa-folder-minus text-warning fs-1 mb-3 text-yellow-500 text-5xl mb-4"></i>
            <h5 class="fw-bold font-bold">Exams & Quizzes</h5>
            <p class="text-muted small mb-0 text-gray-500 text-sm">
              12 Files •
              <span class="text-danger text-red-500"
                ><i class="fas fa-lock me-1"></i>Restricted</span
              >
            </p>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-0 shadow-sm rounded-4 p-4 h-100 hover-card text-center">
            <i class="fas fa-folder-open text-primary fs-1 mb-3 text-cyan-500 text-5xl mb-4"></i>
            <h5 class="fw-bold font-bold">Answer Keys</h5>
            <p class="text-muted small mb-0 text-gray-500 text-sm">
              8 Files •
              <span class="text-danger text-red-500"
                ><i class="fas fa-lock me-1"></i>Restricted</span
              >
            </p>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-0 shadow-sm rounded-4 p-4 h-100 hover-card text-center">
            <i class="fas fa-folder text-success fs-1 mb-3 text-green-500 text-5xl mb-4"></i>
            <h5 class="fw-bold font-bold">Student Reports</h5>
            <p class="text-muted small mb-0 text-gray-500 text-sm">
              24 Files •
              <span class="text-warning text-yellow-600"
                ><i class="fas fa-eye me-1"></i>Confidential</span
              >
            </p>
          </div>
        </div>
        <div class="col-md-3">
          <div
            class="card border-0 shadow-sm rounded-4 p-4 h-100 hover-card text-center bg-light opacity-75 bg-gray-50"
          >
            <i class="fas fa-archive text-secondary fs-1 mb-3 text-gray-400 text-5xl mb-4"></i>
            <h5 class="fw-bold font-bold">Archived 2023</h5>
            <p class="text-muted small mb-0 text-gray-500 text-sm">Read Only</p>
          </div>
        </div>
      </div>

      <!-- Recent Access Log -->
      <div class="card border-0 shadow-sm rounded-4 overflow-hidden bg-white rounded-2xl shadow-sm">
        <div class="card-header bg-white border-bottom py-3 p-4 border-b border-gray-200">
          <h5 class="fw-bold mb-0 font-bold">Recent Access Log</h5>
        </div>
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0 w-full">
            <thead class="bg-light bg-gray-50">
              <tr>
                <th class="ps-4 p-4">File Name</th>
                <th class="p-4">Category</th>
                <th class="p-4">Last Accessed</th>
                <th class="p-4">Security Level</th>
                <th class="text-end pe-4 p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr>
                <td class="ps-4 p-4">
                  <div class="d-flex align-items-center gap-3 flex items-center gap-3">
                    <i class="fas fa-file-pdf text-danger fs-4 text-red-500"></i>
                    <div>
                      <div class="fw-bold font-bold">Grade 10 Final Exam_v2.pdf</div>
                      <div class="small text-muted text-gray-500 text-sm">2.4 MB</div>
                    </div>
                  </div>
                </td>
                <td class="p-4">Exams</td>
                <td class="p-4">Today, 10:30 AM</td>
                <td class="p-4">
                  <span class="badge bg-danger bg-red-100 text-red-700 px-2 py-1 rounded text-xs"
                    ><i class="fas fa-lock me-1"></i>High</span
                  >
                </td>
                <td class="text-end pe-4 p-4 text-right">
                  <button class="btn btn-sm btn-light text-primary p-2 hover:bg-gray-100 rounded">
                    <i class="fas fa-download"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../../teacher.css'],
})
export class LearningVaultComponent {
  private cpdService = inject(CpdService);
  modules = this.cpdService.getModules();
  progress = this.cpdService.getProgress();

  get progressPercentage(): number {
    return Math.round((this.progress.hoursCompleted / this.progress.targetHours) * 100);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }
}
