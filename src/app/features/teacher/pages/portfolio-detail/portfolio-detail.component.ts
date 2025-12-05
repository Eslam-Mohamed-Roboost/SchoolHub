import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PortfolioService } from '../../services/portfolio.service';
import { Portfolio, Badge } from '../../models/portfolio.model';

@Component({
  selector: 'app-portfolio-detail',
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    @if (portfolio) {
    <div class="portfolio-detail">
      <!-- Header -->
      <div class="bg-white border-bottom py-3 mb-4">
        <div class="container mx-auto px-4">
          <div class="d-flex align-items-center gap-3">
            <button
              routerLink="/teacher/student-portfolio-hub"
              class="btn btn-light rounded-circle p-2"
            >
              <i class="fas fa-arrow-left"></i>
            </button>
            <div class="flex-grow-1">
              <h4 class="fw-bold mb-0">{{ portfolio.studentName }}</h4>
              <p class="text-muted mb-0 small">{{ portfolio.subjectName }} Portfolio</p>
            </div>
            <button class="btn btn-outline-primary rounded-pill px-4" (click)="downloadPortfolio()">
              <i class="fas fa-download me-2"></i>Download Portfolio
            </button>
          </div>
        </div>
      </div>

      <div class="container mx-auto px-4 py-4">
        <div class="row g-4">
          <!-- Main Content -->
          <div class="col-lg-8">
            <!-- Latest Submission -->
            @if (portfolio.submissions && portfolio.submissions.length > 0) {
            <div class="card border-0 shadow-sm rounded-4 mb-4">
              <div class="card-header bg-white border-bottom py-3 px-4">
                <h5 class="fw-bold mb-0">
                  <i class="fas fa-file-alt text-primary me-2"></i>Latest Submission
                </h5>
              </div>
              <div class="card-body p-4">
                <h6 class="fw-bold mb-3">{{ portfolio.submissions[0].title }}</h6>
                <div [innerHTML]="portfolio.submissions[0].content"></div>
                <hr class="my-3" />
                <div class="d-flex justify-content-between align-items-center">
                  <small class="text-muted">
                    <i class="fas fa-clock me-1"></i>
                    Submitted {{ formatDate(portfolio.submissions[0].submittedAt) }}
                  </small>
                  <div class="d-flex gap-2">
                    <button
                      class="btn btn-sm"
                      [class.btn-primary]="portfolio.isLiked"
                      [class.btn-outline-primary]="!portfolio.isLiked"
                      (click)="toggleLike()"
                    >
                      <i class="fas fa-heart me-1"></i>{{ portfolio.likes }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            }

            <!-- Feedback History -->
            <div class="card border-0 shadow-sm rounded-4 mb-4">
              <div class="card-header bg-white border-bottom py-3 px-4">
                <h5 class="fw-bold mb-0">
                  <i class="fas fa-comments text-primary me-2"></i>Feedback History
                </h5>
              </div>
              <div class="card-body p-4">
                @if (portfolio.feedback && portfolio.feedback.length > 0) { @for (comment of
                portfolio.feedback; track comment.id) {
                <div class="mb-3 pb-3 border-bottom">
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <strong>{{ comment.teacherName }}</strong>
                      @if (comment.type === 'revision-request') {
                      <span class="badge bg-warning text-dark ms-2">
                        <i class="fas fa-exclamation-triangle me-1"></i>Revision Requested
                      </span>
                      }
                    </div>
                    <small class="text-muted">
                      {{ formatDate(comment.createdAt) }}
                    </small>
                  </div>
                  <p class="mb-0">{{ comment.content }}</p>
                </div>
                } } @else {
                <p class="text-muted text-center mb-0">
                  <i class="fas fa-inbox fa-2x mb-2 d-block"></i>
                  No feedback yet. Be the first to comment!
                </p>
                }
              </div>
            </div>

            <!-- Add Comment -->
            <div class="card border-0 shadow-sm rounded-4">
              <div class="card-header bg-white border-bottom py-3 px-4">
                <h5 class="fw-bold mb-0">
                  <i class="fas fa-comment-alt text-primary me-2"></i>Add Feedback
                </h5>
              </div>
              <div class="card-body p-4">
                <textarea
                  class="form-control mb-3"
                  rows="4"
                  placeholder="Provide constructive feedback to the student..."
                  [(ngModel)]="newComment"
                ></textarea>
                <div class="d-flex gap-2">
                  <button
                    class="btn btn-primary"
                    (click)="addComment()"
                    [disabled]="!newComment.trim()"
                  >
                    <i class="fas fa-paper-plane me-2"></i>Send Feedback
                  </button>
                  <button
                    class="btn btn-warning text-white"
                    (click)="requestRevision()"
                    [disabled]="!newComment.trim()"
                  >
                    <i class="fas fa-exclamation-triangle me-2"></i>Request Revision
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="col-lg-4">
            <!-- Badge Awards -->
            <div class="card border-0 shadow-sm rounded-4 mb-4">
              <div class="card-header bg-white border-bottom py-3 px-4">
                <h6 class="fw-bold mb-0">
                  <i class="fas fa-award text-warning me-2"></i>Awarded Badges
                </h6>
              </div>
              <div class="card-body p-4">
                @if (portfolio.badges && portfolio.badges.length > 0) {
                <div class="d-flex flex-wrap gap-2 mb-3">
                  @for (badge of portfolio.badges; track badge.id) {
                  <div
                    class="badge p-2 d-flex align-items-center gap-2"
                    [style.background]="badge.color"
                    style="font-size: 0.9rem;"
                  >
                    <i [class]="badge.icon"></i>
                    {{ badge.name }}
                  </div>
                  }
                </div>
                } @else {
                <p class="text-muted small text-center mb-3">No badges yet</p>
                }

                <hr class="my-3" />

                <h6 class="fw-bold mb-2 small">Award New Badge</h6>
                <select class="form-select mb-2" [(ngModel)]="selectedBadgeId">
                  <option value="">Select a badge...</option>
                  @for (badge of availableBadges; track badge.id) {
                  <option [value]="badge.id">{{ badge.name }}</option>
                  }
                </select>
                <button
                  class="btn btn-sm btn-success w-100"
                  (click)="awardBadge()"
                  [disabled]="!selectedBadgeId"
                >
                  <i class="fas fa-trophy me-1"></i>Award Badge
                </button>
              </div>
            </div>

            <!-- Portfolio Stats -->
            <div class="card border-0 shadow-sm rounded-4">
              <div class="card-header bg-white border-bottom py-3 px-4">
                <h6 class="fw-bold mb-0">Portfolio Info</h6>
              </div>
              <div class="card-body p-4">
                <div class="mb-3">
                  <label class="text-muted small">Student</label>
                  <div class="fw-bold">{{ portfolio.studentName }}</div>
                </div>
                <div class="mb-3">
                  <label class="text-muted small">Subject</label>
                  <div class="fw-bold">{{ portfolio.subjectName }}</div>
                </div>
                <div class="mb-3">
                  <label class="text-muted small">Submissions</label>
                  <div class="fw-bold">{{ portfolio.submissions.length || 0 }}</div>
                </div>
                <div class="mb-3">
                  <label class="text-muted small">Feedback</label>
                  <div class="fw-bold">{{ portfolio.feedback.length || 0 }} comments</div>
                </div>
                <div class="mb-3">
                  <label class="text-muted small">Badges Earned</label>
                  <div class="fw-bold">{{ portfolio.badges.length || 0 }}</div>
                </div>
                <div class="mb-0">
                  <label class="text-muted small">Last Updated</label>
                  <div class="fw-bold">{{ formatDate(portfolio.lastUpdated) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    } @else {
    <div class="container mx-auto px-4 py-8 text-center">
      <i class="fas fa-exclamation-triangle text-warning fa-3x mb-3"></i>
      <h4>Portfolio Not Found</h4>
      <p class="text-muted">The requested student portfolio could not be found.</p>
      <button routerLink="/teacher/student-portfolio-hub" class="btn btn-primary rounded-pill px-4">
        <i class="fas fa-arrow-left me-2"></i>Back to Student Portfolios
      </button>
    </div>
    }
  `,
  styles: [
    `
      .portfolio-detail {
        min-height: 100vh;
        background-color: #f8f9fa;
      }
    `,
  ],
})
export class PortfolioDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private portfolioService = inject(PortfolioService);

  portfolio: Portfolio | null = null;
  availableBadges: Badge[] = [];
  newComment = '';
  selectedBadgeId = '';

  ngOnInit(): void {
    const studentId = this.route.snapshot.params['studentId'];
    const subjectId = this.route.snapshot.params['subjectId'];

    this.portfolio = this.portfolioService.getStudentPortfolio(studentId, subjectId);
    this.availableBadges = this.portfolioService.getAvailableBadges();
  }

  addComment(): void {
    if (!this.portfolio || !this.newComment.trim()) return;

    this.portfolioService.addComment(this.portfolio.id, this.newComment);
    this.portfolio = this.portfolioService.getStudentPortfolio(
      this.portfolio.studentId,
      this.portfolio.subjectId
    );
    this.newComment = '';
    alert('Feedback sent successfully! The student has been notified.');
  }

  requestRevision(): void {
    if (!this.portfolio || !this.newComment.trim()) return;

    this.portfolioService.requestRevision(this.portfolio.id, this.newComment);
    this.portfolio = this.portfolioService.getStudentPortfolio(
      this.portfolio.studentId,
      this.portfolio.subjectId
    );
    this.newComment = '';
    alert('Revision requested! The student has been notified to resubmit their work.');
  }

  toggleLike(): void {
    if (!this.portfolio) return;

    this.portfolioService.toggleLike(this.portfolio.id);
    this.portfolio = this.portfolioService.getStudentPortfolio(
      this.portfolio.studentId,
      this.portfolio.subjectId
    );
  }

  awardBadge(): void {
    if (!this.portfolio || !this.selectedBadgeId) return;

    this.portfolioService.awardBadge(this.portfolio.id, this.selectedBadgeId);
    this.portfolio = this.portfolioService.getStudentPortfolio(
      this.portfolio.studentId,
      this.portfolio.subjectId
    );
    this.selectedBadgeId = '';
    alert('Badge awarded! The student has been notified.');
  }

  downloadPortfolio(): void {
    if (!this.portfolio) return;

    // Mock download functionality
    alert(`Downloading ${this.portfolio.studentName}'s ${this.portfolio.subjectName} portfolio...`);
    console.log('Portfolio download initiated', this.portfolio);
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - d.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return d.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }
}
