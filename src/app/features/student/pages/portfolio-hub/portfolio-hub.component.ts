import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StudentPortfolioService } from '../../services/student-portfolio.service';
import { PortfolioOverview } from '../../models/student-portfolio.model';

@Component({
  selector: 'app-portfolio-hub',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="portfolio-hub container mx-auto px-4 py-6">
      <h2 class="fw-bold mb-2">
        <i class="fas fa-folder-open text-primary me-2"></i>My Digital Portfolios
      </h2>
      <p class="text-muted mb-4">View and manage your work across all subjects</p>

      @if (portfolioService.isLoadingData()) {
      <!-- Loading State -->
      <div class="text-center py-5">
        <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3 text-muted">Loading your portfolios...</p>
      </div>
      } @else {
      <!-- Quick Stats -->
      <div class="row g-3 mb-5">
        <div class="col-md-4">
          <div class="card border-0 shadow-sm rounded-4 h-100">
            <div class="card-body text-center py-4">
              <i class="fas fa-file-alt fa-2x text-primary mb-2"></i>
              <h3 class="fw-bold mb-0">{{ overview().totalFiles }}</h3>
              <small class="text-muted">Total Files</small>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card border-0 shadow-sm rounded-4 h-100">
            <div class="card-body text-center py-4">
              <i class="fas fa-comments fa-2x text-success mb-2"></i>
              <h3 class="fw-bold mb-0">{{ overview().totalFeedback }}</h3>
              <small class="text-muted">Feedback</small>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card border-0 shadow-sm rounded-4 h-100">
            <div class="card-body text-center py-4">
              <i class="fas fa-award fa-2x text-warning mb-2"></i>
              <h3 class="fw-bold mb-0">{{ overview().totalBadges }}</h3>
              <small class="text-muted">Badges</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Subject Cards -->
      <h5 class="fw-bold mb-3">All Subjects</h5>
      <div class="row g-4">
        @for (portfolio of overview().subjectPortfolios; track portfolio.subjectId) {
        <div class="col-md-6 col-lg-3">
          <a
            [routerLink]="['/student/portfolio', portfolio.subjectId]"
            class="text-decoration-none"
          >
            <div class="card border-0 shadow-sm rounded-4 h-100 hover-lift">
              <div class="card-body text-center p-4">
                <i
                  [class]="portfolio.subjectIcon + ' fa-3x mb-3'"
                  [style.color]="getColor(portfolio.subjectId)"
                ></i>
                <h6 class="fw-bold mb-3">{{ portfolio.subjectName }}</h6>
                <div class="d-flex justify-content-around mb-2">
                  <div>
                    <div class="fw-bold text-primary">{{ portfolio.stats.filesCount }}</div>
                    <small class="text-muted">Files</small>
                  </div>
                  <div>
                    <div class="fw-bold text-success">{{ portfolio.stats.feedbackCount }}</div>
                    <small class="text-muted">Feedback</small>
                  </div>
                </div>
              </div>
              <div class="card-footer bg-light border-0 text-center py-2">
                <small class="text-primary fw-bold">View Portfolio →</small>
              </div>
            </div>
          </a>
        </div>
        }
      </div>
      }
    </div>
  `,
  styles: [
    `
      .hover-lift {
        transition: transform 0.2s;
        cursor: pointer;
      }
      .hover-lift:hover {
        transform: translateY(-5px);
      }
    `,
  ],
})
export class PortfolioHubComponent implements OnInit {
  portfolioService = inject(StudentPortfolioService);

  // Use computed signal for reactive updates
  overview = computed(() => this.portfolioService.getPortfolioOverview());

  ngOnInit(): void {
    // Data loads automatically via service constructor
  }

  getColor(subjectId: string): string {
    // Generate color based on subject name or ID to ensure consistent colors
    // Even if the ID is numeric from the backend
    const colors = [
      '#3b82f6', // blue
      '#10b981', // green
      '#8b5cf6', // purple
      '#f59e0b', // amber
      '#06b6d4', // cyan
      '#ef4444', // red
      '#14b8a6', // teal
      '#ec4899', // pink
      '#f97316', // orange
      '#84cc16', // lime
      '#a855f7', // violet
      '#22c55e', // emerald
    ];

    // Use a simple hash of the ID to pick a color
    let hash = 0;
    for (let i = 0; i < subjectId.length; i++) {
      hash = subjectId.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }
}
