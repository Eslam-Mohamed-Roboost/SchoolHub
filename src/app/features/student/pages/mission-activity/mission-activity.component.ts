import { Component, OnInit, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { StudentMissionsService } from '../../services/student-missions.service';
import { MissionActivityDto } from '../../models/student-api.models';
import { VideoActivityComponent } from '../../components/activities/video-activity.component';
import { QuizActivityComponent } from '../../components/activities/quiz-activity.component';
import { ReadingActivityComponent } from '../../components/activities/reading-activity.component';
import { InteractiveActivityComponent } from '../../components/activities/interactive-activity.component';

@Component({
  selector: 'app-mission-activity',
  imports: [
    CommonModule,
    VideoActivityComponent,
    QuizActivityComponent,
    ReadingActivityComponent,
    InteractiveActivityComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mission-activity-page" aria-live="polite">
      @if (isLoading()) {
        <div class="loading-container">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading activity...</span>
          </div>
          <p>Loading activity...</p>
        </div>
      } @else if (error()) {
        <div class="error-container">
          <div class="error-icon">⚠️</div>
          <h2>Activity Not Found</h2>
          <p>{{ error() }}</p>
          <button type="button" class="btn-back" (click)="goBack()">
            ← Back to Mission
          </button>
        </div>
      } @else if (currentActivity()) {
        <!-- Activity Header -->
        <header class="activity-header">
          <button type="button" class="back-button" (click)="goBack()">
            <i class="fas fa-arrow-left"></i>
            Back to Mission
          </button>
          <div class="activity-meta">
            <span class="activity-type-badge" [class]="'type-' + currentActivity()?.Type">
              {{ getActivityTypeLabel(currentActivity()?.Type || '') }}
            </span>
            @if (currentActivity()?.Completed) {
              <span class="completed-badge">
                <i class="fas fa-check-circle"></i>
                Completed
              </span>
            }
          </div>
        </header>

        <!-- Activity Content -->
        <div class="activity-content">
          <div class="activity-container">
            @switch (currentActivity()?.Type) {
              @case ('video') {
                <app-video-activity [activity]="currentActivity()!" />
              }
              @case ('quiz') {
                <app-quiz-activity [activity]="currentActivity()!" />
              }
              @case ('reading') {
                <app-reading-activity [activity]="currentActivity()!" />
              }
              @case ('interactive') {
                <app-interactive-activity [activity]="currentActivity()!" />
              }
              @default {
                <div class="unsupported-type">
                  <i class="fas fa-exclamation-triangle fa-3x"></i>
                  <h3>Unsupported Activity Type</h3>
                  <p>This activity type ({{ currentActivity()?.Type }}) is not yet supported.</p>
                </div>
              }
            }
          </div>
        </div>

        <!-- Activity Actions -->
        <div class="activity-actions">
          @if (!currentActivity()?.Completed) {
            <button
              type="button"
              class="btn-complete"
              (click)="completeActivity()"
              [disabled]="isCompleting()"
            >
              @if (isCompleting()) {
                <span class="spinner-border spinner-border-sm" role="status"></span>
                <span>Completing...</span>
              } @else {
                <i class="fas fa-check"></i>
                <span>Mark as Complete</span>
              }
            </button>
          } @else {
            <div class="already-completed">
              <i class="fas fa-check-circle"></i>
              <span>You've already completed this activity</span>
            </div>
          }
          
          <button type="button" class="btn-cancel" (click)="goBack()">
            Cancel
          </button>
        </div>

        <!-- Progress Info -->
        @if (activityNumber() > 0 && totalActivities() > 0) {
          <div class="progress-info">
            <div class="progress-text">
              Activity {{ activityNumber() }} of {{ totalActivities() }}
            </div>
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                [style.width.%]="(activityNumber() / totalActivities()) * 100"
              ></div>
            </div>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .mission-activity-page {
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem 1rem;
      min-height: 70vh;
    }

    .loading-container,
    .error-container {
      text-align: center;
      padding: 4rem 2rem;
    }

    .loading-container p {
      margin-top: 1rem;
      color: #666;
      font-size: 1.1rem;
    }

    .error-container {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .error-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .error-container h2 {
      color: #dc3545;
      margin-bottom: 0.5rem;
    }

    .error-container p {
      color: #666;
      margin-bottom: 2rem;
    }

    .activity-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .back-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1.25rem;
      background: white;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      color: #666;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .back-button:hover {
      border-color: #00bcf2;
      color: #00bcf2;
      transform: translateX(-3px);
    }

    .activity-meta {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .activity-type-badge {
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-weight: 600;
      font-size: 0.9rem;
      text-transform: capitalize;
    }

    .activity-type-badge.type-video {
      background: #fff3cd;
      color: #856404;
    }

    .activity-type-badge.type-quiz {
      background: #d1ecf1;
      color: #0c5460;
    }

    .activity-type-badge.type-reading {
      background: #d4edda;
      color: #155724;
    }

    .activity-type-badge.type-interactive {
      background: #e2d9f3;
      color: #5a3e8e;
    }

    .completed-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: #d4edda;
      border: 1px solid #c3e6cb;
      border-radius: 20px;
      color: #155724;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .activity-content {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      padding: 2rem;
      margin-bottom: 2rem;
    }

    .activity-container {
      width: 100%;
    }

    .unsupported-type {
      text-align: center;
      padding: 3rem 2rem;
      color: #666;
    }

    .unsupported-type i {
      color: #ffc107;
      margin-bottom: 1rem;
    }

    .unsupported-type h3 {
      color: #333;
      margin-bottom: 0.5rem;
    }

    .activity-actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .btn-complete,
    .btn-cancel,
    .btn-back {
      padding: 0.875rem 2rem;
      font-size: 1rem;
      font-weight: 600;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-complete {
      background: #28a745;
      color: white;
    }

    .btn-complete:hover:not(:disabled) {
      background: #218838;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
    }

    .btn-complete:disabled {
      background: #6c757d;
      cursor: not-allowed;
      opacity: 0.6;
    }

    .btn-cancel,
    .btn-back {
      background: #6c757d;
      color: white;
    }

    .btn-cancel:hover,
    .btn-back:hover {
      background: #5a6268;
    }

    .already-completed {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 2rem;
      background: #d4edda;
      border: 1px solid #c3e6cb;
      border-radius: 8px;
      color: #155724;
      font-weight: 500;
    }

    .already-completed i {
      font-size: 1.25rem;
      color: #28a745;
    }

    .progress-info {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 12px;
      text-align: center;
    }

    .progress-text {
      font-weight: 600;
      color: #666;
      margin-bottom: 0.75rem;
    }

    .progress-bar {
      height: 8px;
      background: #e9ecef;
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #00bcf2, #0099c4);
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    @media (max-width: 768px) {
      .mission-activity-page {
        padding: 1rem 0.5rem;
      }

      .activity-header {
        flex-direction: column;
        align-items: stretch;
      }

      .activity-content {
        padding: 1.5rem 1rem;
      }

      .activity-actions {
        flex-direction: column;
      }

      .btn-complete,
      .btn-cancel {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class MissionActivityComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private missionsService = inject(StudentMissionsService);

  currentActivity = signal<MissionActivityDto | null>(null);
  isLoading = signal(false);
  isCompleting = signal(false);
  error = signal<string>('');
  
  missionId = signal<string>('');
  activityId = signal<number>(0);
  activityNumber = signal<number>(0);
  totalActivities = signal<number>(0);

  ngOnInit(): void {
    const missionIdParam = this.route.snapshot.params['missionId'];
    const activityIdParam = this.route.snapshot.params['activityId'];

    if (!missionIdParam || !activityIdParam) {
      this.error.set('Missing mission or activity ID');
      return;
    }

    this.missionId.set(missionIdParam);
    this.activityId.set(Number(activityIdParam));

    this.loadActivity();
  }

  private loadActivity(): void {
    this.isLoading.set(true);

    // Get current mission from service
    const mission = this.missionsService.getCurrentMission();
    
    if (!mission) {
      // Mission not loaded yet, load it first
      this.missionsService.loadMissionDetails(this.missionId());
      
      // Wait for mission to load (in real app, use subscription or effect)
      setTimeout(() => {
        this.findAndSetActivity();
        this.isLoading.set(false);
      }, 500);
    } else {
      this.findAndSetActivity();
      this.isLoading.set(false);
    }
  }

  private findAndSetActivity(): void {
    const mission = this.missionsService.getCurrentMission();
    
    if (!mission || !mission.Activities) {
      this.error.set('Mission or activities not found');
      return;
    }

    const activity = mission.Activities.find(a => a.Id === this.activityId());
    
    if (!activity) {
      this.error.set(`Activity with ID ${this.activityId()} not found`);
      return;
    }

    this.currentActivity.set(activity);
    this.totalActivities.set(mission.Activities.length);
    this.activityNumber.set(activity.Order);
  }

  completeActivity(): void {
    const activity = this.currentActivity();
    if (!activity || activity.Completed) return;

    this.isCompleting.set(true);

    // Call service to update progress
    this.missionsService.updateMissionProgress({
      MissionId: Number(this.missionId()),
      ActivityId: activity.Id,
      Completed: true,
      ActivityData: {
        completedAt: new Date().toISOString()
      }
    });

    // Wait a moment for the update, then navigate back
    setTimeout(() => {
      this.isCompleting.set(false);
      this.goBack();
    }, 1000);
  }

  goBack(): void {
    this.router.navigate(['/student/missions', this.missionId()]);
  }

  getActivityTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      video: 'Video',
      quiz: 'Quiz',
      reading: 'Reading',
      interactive: 'Interactive'
    };
    return labels[type] || type;
  }
}

