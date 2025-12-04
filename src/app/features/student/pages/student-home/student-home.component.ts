import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StatCardComponent } from '../../../../shared/ui/stat-card/stat-card.component';
import { StudentPortfolioService } from '../../services/student-portfolio.service';
import { PortfolioFile } from '../../models/student-portfolio.model';

@Component({
  selector: 'app-student-home',
  imports: [CommonModule, RouterLink, StatCardComponent],
  template: `
    <div class="student-home container mx-auto px-4 py-6">
      <!-- Welcome Header -->
      <div class="mb-5">
        <h2 class="fw-bold">Welcome back, {{ studentName }}! 👋</h2>
        <p class="text-muted">Let's continue your digital citizenship journey</p>
      </div>

      <!-- Quick Stats Dashboard -->
      <div class="row g-4 mb-5">
        <div class="col-md-6 col-lg-3">
          <app-stat-card
            icon="fas fa-tasks"
            [value]="missions.completed + '/' + missions.total"
            label="Missions Completed"
            color="primary"
          ></app-stat-card>
        </div>
        <div class="col-md-6 col-lg-3">
          <app-stat-card
            icon="fas fa-award"
            [value]="badges.earned.toString()"
            label="Badges Earned"
            color="warning"
          ></app-stat-card>
        </div>
        <div class="col-md-6 col-lg-3">
          <app-stat-card
            icon="fas fa-folder-open"
            [value]="portfolioStats.totalFiles.toString()"
            label="Portfolio Files"
            color="info"
          ></app-stat-card>
        </div>
        <div class="col-md-6 col-lg-3">
          <app-stat-card
            icon="fas fa-fire"
            [value]="currentStreak.toString() + ' days'"
            label="Current Streak"
            color="danger"
          ></app-stat-card>
        </div>
      </div>

      <div class="row g-4">
        <!-- Current Mission Card -->
        <div class="col-lg-8">
          <div class="card border-0 shadow-sm rounded-4 h-100">
            <div class="card-header bg-white border-bottom py-3 px-4">
              <div class="d-flex justify-content-between align-items-center">
                <h5 class="fw-bold mb-0">
                  <i class="fas fa-compass text-primary me-2"></i>Current Mission
                </h5>
                <span class="badge bg-warning">{{ currentMission.status }}</span>
              </div>
            </div>
            <div class="card-body p-4">
              <h4 class="fw-bold mb-3">{{ currentMission.title }}</h4>

              <div class="mb-3">
                <div class="d-flex justify-content-between mb-2">
                  <span class="text-muted">Progress</span>
                  <span class="fw-bold">{{ currentMission.progress }}%</span>
                </div>
                <div class="progress" style="height: 10px;">
                  <div
                    class="progress-bar bg-primary"
                    [style.width.%]="currentMission.progress"
                  ></div>
                </div>
              </div>

              <div class="row g-3 mb-4">
                <div class="col-6">
                  <div class="text-muted small">Activities Completed</div>
                  <div class="fw-bold">
                    {{ currentMission.activitiesCompleted }}/{{ currentMission.totalActivities }}
                  </div>
                </div>
                <div class="col-6">
                  <div class="text-muted small">Estimated Time</div>
                  <div class="fw-bold">
                    <i class="fas fa-clock text-primary me-1"></i>{{ currentMission.estimatedTime }}
                  </div>
                </div>
              </div>

              @if (currentMission.nextActivity) {
              <div class="alert alert-light mb-3">
                <strong>Next Activity:</strong> {{ currentMission.nextActivity }}
              </div>
              }

              <div class="d-flex gap-2">
                <a [routerLink]="['/student/missions', currentMission.id]" class="btn btn-primary">
                  <i class="fas fa-play me-2"></i>Resume Mission
                </a>
                <a routerLink="/student/missions" class="btn btn-outline-primary">
                  View All Missions
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- My Portfolios Card -->
        <div class="col-lg-4">
          <div class="card border-0 shadow-sm rounded-4 h-100">
            <div class="card-header bg-white border-bottom py-3 px-4">
              <h5 class="fw-bold mb-0">
                <i class="fas fa-folder-open text-info me-2"></i>My Portfolios
              </h5>
            </div>
            <div class="card-body p-4">
              @if (recentUploads.length > 0) {
              <div class="mb-3">
                @for (file of recentUploads; track file.id) {
                <div class="d-flex align-items-center gap-2 mb-3">
                  <i [class]="getFileIcon(file.fileType) + ' fa-lg'"></i>
                  <div class="flex-grow-1">
                    <div class="small fw-bold text-truncate">{{ file.fileName }}</div>
                    <small class="text-muted">{{ getSubjectName(file.subjectId) }}</small>
                  </div>
                </div>
                }
              </div>
              <a routerLink="/student/portfolio-hub" class="btn btn-outline-info w-100">
                <i class="fas fa-th-large me-2"></i>View All Portfolios
              </a>
              } @else {
              <div class="text-center py-4">
                <i class="fas fa-folder-open fa-3x text-muted mb-3"></i>
                <p class="text-muted mb-3">No portfolio uploads yet</p>
                <a routerLink="/student/portfolio-hub" class="btn btn-info">
                  Start Uploading Work
                </a>
              </div>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Badges -->
      <div class="mt-5">
        <h5 class="fw-bold mb-3">Recent Badges</h5>
        <div class="row g-3">
          @for (badge of badges.recent.slice(0, 4); track badge) {
          <div class="col-md-3">
            <div class="card border-0 shadow-sm rounded-4 text-center p-3">
              <i class="fas fa-award fa-2x text-warning mb-2"></i>
              <h6 class="mb-0">{{ badge }}</h6>
            </div>
          </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .progress {
        border-radius: 10px;
      }
    `,
  ],
})
export class StudentHomeComponent implements OnInit {
  private portfolioService = inject(StudentPortfolioService);

  studentName = 'Ahmed';
  currentStreak = 7;

  missions = {
    completed: 3,
    total: 8,
    percentage: 37.5,
  };

  badges = {
    earned: 4,
    recent: ['Safety Shield', 'Digital Scout', 'Kindness Champion', 'Footprint Tracker'],
  };

  currentMission = {
    id: 3,
    title: 'Online Safety & Privacy',
    progress: 60,
    activitiesCompleted: 3,
    totalActivities: 5,
    estimatedTime: '20 mins',
    nextActivity: 'Password Security Quiz',
    status: 'In Progress',
  };

  portfolioStats = { totalFiles: 0, totalFeedback: 0, totalBadges: 0 };
  recentUploads: PortfolioFile[] = [];

  ngOnInit(): void {
    const overview = this.portfolioService.getPortfolioOverview();
    this.portfolioStats = {
      totalFiles: overview.totalFiles,
      totalFeedback: overview.totalFeedback,
      totalBadges: overview.totalBadges,
    };
    this.recentUploads = overview.recentUploads;
  }

  getFileIcon(fileType: string): string {
    const icons: { [key: string]: string } = {
      pdf: 'fas fa-file-pdf text-danger',
      docx: 'fas fa-file-word text-primary',
      pptx: 'fas fa-file-powerpoint text-warning',
      jpg: 'fas fa-file-image text-info',
      png: 'fas fa-file-image text-info',
      mp4: 'fas fa-file-video text-purple',
    };
    return icons[fileType] || 'fas fa-file';
  }

  getSubjectName(subjectId: string): string {
    const subjects: { [key: string]: string } = {
      math: 'Math',
      science: 'Science',
      ela: 'ELA',
      arabic: 'Arabic',
      islamic: 'Islamic Studies',
      social: 'Social Studies',
      pe: 'PE',
      arts: 'Arts',
    };
    return subjects[subjectId] || subjectId;
  }
}
