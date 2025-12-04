import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressCardComponent } from '../../../../shared/ui/progress-card/progress-card.component';
import { CpdService } from '../../services/cpd.service';

@Component({
  selector: 'app-teacher-cpd',
  standalone: true,
  imports: [CommonModule, ProgressCardComponent],
  template: `
    <div class="teacher-cpd container mx-auto px-4 py-8">
      <!-- My Progress Section -->
      <div class="mb-5">
        <h2 class="fw-bold mb-4"><i class="fas fa-chart-line text-primary me-2"></i>My Progress</h2>
        <div class="row g-4 mb-5">
          <div class="col-md-6">
            <app-progress-card
              title="CPD Hours"
              [current]="progress.hoursCompleted"
              [target]="progress.targetHours"
              unit="hours"
              color="#6366f1"
              [subtitle]="'Last activity: ' + formatDate(progress.lastActivityDate)"
            />
          </div>
          <div class="col-md-6">
            <app-progress-card
              title="Badges Earned"
              [current]="stats.badgesEarned"
              [target]="10"
              unit="badges"
              color="#f59e0b"
              subtitle="Keep collecting!"
            />
          </div>
          <div class="col-md-6">
            <app-progress-card
              title="Active Students"
              [current]="stats.activeStudents"
              [target]="30"
              unit="students"
              color="#10b981"
              subtitle="Engaging with portfolios"
            />
          </div>
          <div class="col-md-6">
            <app-progress-card
              title="Current Streak"
              [current]="progress.streak"
              [target]="30"
              unit="days"
              color="#ef4444"
              subtitle="🔥 Keep the momentum!"
            />
          </div>
        </div>
      </div>

      <div class="row g-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Badge Progress -->
        <div class="col-md-4">
          <div class="card border-0 shadow-sm rounded-4 h-100 p-4 bg-white rounded-2xl shadow-sm">
            <h5 class="fw-bold mb-4 font-bold text-lg">🏆 Certification Progress</h5>

            <div class="mb-4">
              <div class="d-flex justify-content-between mb-1 flex justify-between">
                <span class="fw-bold small font-bold text-sm">Certified Educator Lvl 1</span>
                <span class="text-primary small fw-bold text-cyan-600 font-bold text-sm">80%</span>
              </div>
              <div class="progress rounded-pill bg-gray-200" style="height: 10px">
                <div
                  class="progress-bar bg-primary bg-cyan-500"
                  role="progressbar"
                  style="width: 80%"
                ></div>
              </div>
              <small class="text-muted mt-1 d-block text-gray-500 text-xs block mt-1"
                >2 more workshops to complete</small
              >
            </div>

            <div class="mb-4">
              <div class="d-flex justify-content-between mb-1">
                <span class="fw-bold small font-bold text-sm">Digital Leader</span>
                <span class="text-success small fw-bold text-green-600 font-bold text-sm">45%</span>
              </div>
              <div class="progress rounded-pill bg-gray-200" style="height: 10px">
                <div
                  class="progress-bar bg-success bg-green-500"
                  role="progressbar"
                  style="width: 45%"
                ></div>
              </div>
              <small class="text-muted mt-1 d-block text-gray-500 text-xs"
                >On track for Q2 completion</small
              >
            </div>

            <div
              class="alert alert-light border-primary border-start border-4 mb-0 border-l-4 border-cyan-500 bg-cyan-50 p-3 rounded"
            >
              <div class="d-flex gap-2 flex items-start gap-2">
                <i class="fas fa-info-circle text-primary mt-1 text-cyan-600"></i>
                <small class="text-sm text-cyan-800"
                  >Complete the "AI in Classroom" module to unlock the next tier.</small
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Earned Badges & CPD Log -->
        <div class="col-md-8 lg:col-span-2 space-y-6">
          <!-- Earned Badges -->
          <div class="card border-0 shadow-sm rounded-4 mb-4 p-4 bg-white rounded-2xl shadow-sm">
            <h5 class="fw-bold mb-3 font-bold text-lg">🌟 Earned Badges</h5>
            <div class="d-flex gap-3 flex-wrap flex gap-4 flex-wrap">
              <div
                class="text-center p-3 bg-light rounded-3 border border-warning bg-yellow-50 border-yellow-400 rounded-xl"
                style="width: 100px"
              >
                <i class="fas fa-laptop-code text-warning fs-2 mb-2 text-yellow-500 text-3xl"></i>
                <div class="small fw-bold font-bold text-xs" style="line-height: 1.2">
                  Tech Savvy
                </div>
              </div>
              <div
                class="text-center p-3 bg-light rounded-3 border border-success bg-green-50 border-green-400 rounded-xl"
                style="width: 100px"
              >
                <i class="fas fa-users text-success fs-2 mb-2 text-green-500 text-3xl"></i>
                <div class="small fw-bold font-bold text-xs" style="line-height: 1.2">
                  Inclusive Class
                </div>
              </div>
              <div
                class="text-center p-3 bg-light rounded-3 border border-info bg-blue-50 border-blue-400 rounded-xl"
                style="width: 100px"
              >
                <i class="fas fa-project-diagram text-info fs-2 mb-2 text-blue-500 text-3xl"></i>
                <div class="small fw-bold font-bold text-xs" style="line-height: 1.2">
                  Project Lead
                </div>
              </div>
              <div
                class="text-center p-3 bg-light rounded-3 border border-danger bg-red-50 border-red-400 rounded-xl"
                style="width: 100px"
              >
                <i class="fas fa-heart text-danger fs-2 mb-2 text-red-500 text-3xl"></i>
                <div class="small fw-bold font-bold text-xs" style="line-height: 1.2">
                  Wellbeing Champ
                </div>
              </div>
            </div>
          </div>

          <!-- CPD Log -->
          <div class="card border-0 shadow-sm rounded-4 bg-white rounded-2xl shadow-sm">
            <div
              class="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center p-4 border-b border-gray-200 flex justify-between items-center"
            >
              <h5 class="fw-bold mb-0 font-bold text-lg">📚 CPD Activity Log</h5>
              <button
                class="btn btn-sm btn-outline-primary border-cyan-500 text-cyan-600 hover:bg-cyan-50 rounded px-3 py-1"
              >
                Add New Entry
              </button>
            </div>
            <div class="table-responsive">
              <table class="table table-hover align-middle mb-0 w-full">
                <thead class="table-light bg-gray-50">
                  <tr>
                    <th class="p-4">Activity</th>
                    <th class="p-4">Date</th>
                    <th class="p-4">Hours</th>
                    <th class="p-4">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr>
                    <td class="p-4">Advanced Excel for Educators</td>
                    <td class="p-4">Nov 15, 2024</td>
                    <td class="p-4">2.5</td>
                    <td class="p-4">
                      <span
                        class="badge bg-success bg-green-100 text-green-700 px-2 py-1 rounded text-xs"
                        >Verified</span
                      >
                    </td>
                  </tr>
                  <tr>
                    <td class="p-4">Inclusive Education Strategies</td>
                    <td class="p-4">Nov 02, 2024</td>
                    <td class="p-4">4.0</td>
                    <td class="p-4">
                      <span
                        class="badge bg-success bg-green-100 text-green-700 px-2 py-1 rounded text-xs"
                        >Verified</span
                      >
                    </td>
                  </tr>
                  <tr>
                    <td class="p-4">AI Tools Workshop</td>
                    <td class="p-4">Oct 28, 2024</td>
                    <td class="p-4">1.5</td>
                    <td class="p-4">
                      <span
                        class="badge bg-warning text-dark bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs"
                        >Pending</span
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../../teacher.css'],
})
export class TeacherCpdComponent {
  private cpdService = inject(CpdService);
  progress = this.cpdService.getProgress();
  stats = this.cpdService.getStats();

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
}
