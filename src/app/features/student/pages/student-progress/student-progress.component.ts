import { Component, OnInit, inject, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentProgressService } from '../../services/student-progress.service';
import { StudentActivityService } from '../../services/student-activity.service';
import { StudentGoalsService } from '../../services/student-goals.service';

@Component({
  selector: 'app-student-progress',
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <header class="page-header">
        <div class="header-icon">📊</div>
        <div class="header-content">
          <h1>My Progress</h1>
          <p>Track your learning journey and achievements.</p>
        </div>
      </header>

      @if (progressService.isLoadingData()) {
      <!-- Loading State -->
      <div class="text-center py-5">
        <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3 text-muted">Loading your progress...</p>
      </div>
      } @else {
      <!-- Overview Cards -->
      <div class="overview-grid">
        <div class="stat-card">
          <h3>Missions</h3>
          <div class="stat-number">
            {{ missionProgress().completed }} / {{ missionProgress().total }}
          </div>
          <div class="progress-bar-sm">
            <div class="fill" [style.width.%]="missionProgress().percentage"></div>
          </div>
          <div class="stat-label">{{ missionProgress().percentage.toFixed(1) }}% Complete</div>
        </div>
        <div class="stat-card">
          <h3>Badges</h3>
          <div class="stat-number">{{ badgeProgress().earned }}</div>
          <div class="progress-bar-sm">
            <div class="fill" [style.width.%]="badgeProgress().percentage"></div>
          </div>
          <div class="stat-label">{{ badgeProgress().earned }} Earned</div>
        </div>
        <div class="stat-card">
          <h3>Points</h3>
          <div class="stat-number">{{ totalPoints() }}</div>
          <div class="stat-label">Total XP</div>
        </div>
        <div class="stat-card">
          <h3>Streak</h3>
          <div class="stat-number">🔥 {{ currentStreak() }}</div>
          <div class="stat-label">Days Active</div>
        </div>
      </div>

      <div class="details-grid">
        <!-- Activity Timeline -->
        <div class="timeline-section">
          <h2>Recent Activity</h2>
          @if (recentActivity().length > 0) {
          <div class="timeline">
            @for (activity of recentActivity(); track activity.Date + activity.Description) {
            <div class="timeline-item">
              <div class="time-marker">{{ formatDateLabel(activity.Date) }}</div>
              <div class="time-content">
                <div class="activity-icon">{{ activity.Icon || getActivityIcon(activity.ActivityType) }}</div>
                <div class="activity-details">
                  <h4>{{ getActivityTitle(activity.ActivityType) }}</h4>
                  <p>{{ activity.Description }}</p>
                </div>
                <div class="activity-time">{{ formatTime(activity.Date) }}</div>
              </div>
            </div>
            }
          </div>
          } @else {
          <p class="text-muted text-center">No recent activity</p>
          }
        </div>

        <!-- Goals Section -->
        <div class="goals-section">
          <h2>My Goals</h2>
          @if (activeGoals().length > 0) {
          @for (goal of activeGoals(); track goal.Id) {
          <div class="goal-card">
            <div class="goal-header">
              <h3>{{ goal.Title }}</h3>
              <span class="goal-status" [class]="getGoalStatusClass(goal.Status)">
                {{ goal.Status }}
              </span>
            </div>
            <p>{{ goal.Description }}</p>
            <div class="goal-progress">
              <div class="progress-info">
                <span>{{ goal.CurrentProgress }} / {{ goal.TargetProgress }} Completed</span>
                <span>{{ goal.PercentageComplete }}%</span>
              </div>
              <div class="progress-bar-lg">
                <div class="fill" [style.width.%]="goal.PercentageComplete"></div>
              </div>
            </div>
          </div>
          }
          } @else {
          <p class="text-muted text-center mb-3">No active goals</p>
          }
          <button class="btn-new-goal" (click)="onCreateGoal()">+ Set New Goal</button>
        </div>
      </div>
      }
    </div>
  `,
  styles: [
    `
      .page-container {
        max-width: 1200px;
        margin: 0 auto;
        padding-bottom: 4rem;
      }
      .page-header {
        display: flex;
        gap: 1.5rem;
        align-items: center;
        margin-bottom: 2rem;
        background: white;
        padding: 2rem;
        border-radius: 20px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      }
      .header-icon {
        font-size: 3rem;
        background: #e6f8fd;
        width: 80px;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
      }
      h1 {
        margin: 0 0 0.5rem 0;
        color: #333;
        font-size: 2rem;
      }
      p {
        margin: 0;
        color: #666;
        font-size: 1.1rem;
      }

      .overview-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }
      .stat-card {
        background: white;
        padding: 1.5rem;
        border-radius: 16px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        text-align: center;
      }
      .stat-card h3 {
        margin: 0 0 1rem 0;
        color: #666;
        font-size: 1rem;
      }
      .stat-number {
        font-size: 2rem;
        font-weight: 800;
        color: #333;
        margin-bottom: 0.5rem;
      }
      .stat-label {
        font-size: 0.9rem;
        color: #888;
      }

      .progress-bar-sm {
        height: 6px;
        background: #eee;
        border-radius: 3px;
        margin: 0.5rem auto;
        width: 80%;
        overflow: hidden;
      }
      .fill {
        height: 100%;
        background: #00bcf2;
        border-radius: 3px;
      }

      .details-grid {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 2rem;
      }

      .timeline-section,
      .goals-section {
        background: white;
        padding: 2rem;
        border-radius: 24px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      }
      h2 {
        margin-top: 0;
        margin-bottom: 1.5rem;
        color: #333;
        font-size: 1.5rem;
      }

      .timeline {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }
      .timeline-item {
        display: flex;
        gap: 1rem;
      }
      .time-marker {
        width: 80px;
        font-weight: 600;
        color: #888;
        font-size: 0.9rem;
        text-align: right;
        padding-top: 0.5rem;
      }
      .time-content {
        flex: 1;
        background: #f9f9f9;
        padding: 1rem;
        border-radius: 12px;
        display: flex;
        gap: 1rem;
        align-items: center;
      }
      .activity-icon {
        font-size: 1.5rem;
      }
      .activity-details h4 {
        margin: 0 0 0.25rem 0;
        color: #333;
      }
      .activity-details p {
        margin: 0;
        color: #666;
        font-size: 0.9rem;
      }
      .activity-time {
        font-size: 0.8rem;
        color: #999;
        margin-left: auto;
      }

      .goal-card {
        border: 1px solid #eee;
        padding: 1.5rem;
        border-radius: 16px;
        margin-bottom: 1rem;
      }
      .goal-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
      }
      .goal-header h3 {
        margin: 0;
        color: #333;
        font-size: 1.1rem;
      }
      .goal-status {
        font-size: 0.8rem;
        background: #fff9e6;
        color: #8a6d00;
        padding: 0.25rem 0.5rem;
        border-radius: 10px;
        font-weight: 700;
        text-transform: capitalize;
      }
      .goal-status-active {
        background: #fff9e6;
        color: #8a6d00;
      }
      .goal-status-completed {
        background: #e6f8e6;
        color: #107c10;
      }
      .goal-status-expired {
        background: #ffe6e6;
        color: #d13438;
      }
      .goal-card p {
        color: #666;
        margin-bottom: 1rem;
      }

      .progress-info {
        display: flex;
        justify-content: space-between;
        font-size: 0.85rem;
        color: #666;
        margin-bottom: 0.25rem;
      }
      .progress-bar-lg {
        height: 10px;
        background: #eee;
        border-radius: 5px;
        overflow: hidden;
      }

      .btn-new-goal {
        width: 100%;
        padding: 0.75rem;
        border: 2px dashed #ccc;
        background: none;
        border-radius: 12px;
        color: #666;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }
      .btn-new-goal:hover {
        border-color: #00bcf2;
        color: #00bcf2;
        background: #e6f8fd;
      }

      @media (max-width: 900px) {
        .details-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class StudentProgressComponent implements OnInit {
  progressService = inject(StudentProgressService);
  activityService = inject(StudentActivityService);
  goalsService = inject(StudentGoalsService);

  // Computed signals from services
  progressData = computed(() => this.progressService.getProgressData());
  streakData = computed(() => this.activityService.getStreakData());
  goals = computed(() => this.goalsService.getGoals());

  // Computed values for template
  missionProgress = computed(() => {
    const progress = this.progressData();
    const missionProgress = progress?.MissionProgress;
    if (!missionProgress) {
      return { completed: 0, total: 0, percentage: 0 };
    }
    const total = missionProgress.TotalMissions || 0;
    const completed = missionProgress.CompletedMissions || 0;
    return {
      completed,
      total,
      percentage: total > 0 ? (completed / total) * 100 : 0,
    };
  });

  badgeProgress = computed(() => {
    const progress = this.progressData();
    const badgeProgress = progress?.BadgeProgress;
    if (!badgeProgress) {
      return { earned: 0, total: 0, percentage: 0 };
    }
    const total = badgeProgress.TotalBadges || 0;
    const earned = badgeProgress.EarnedBadges || 0;
    // Use Percentage from backend if available, otherwise calculate
    const percentage = badgeProgress.Percentage ?? (total > 0 ? (earned / total) * 100 : 0);
    return {
      earned,
      total,
      percentage,
    };
  });

  totalPoints = computed(() => this.progressData()?.TotalPoints || 0);
  currentStreak = computed(() => this.streakData()?.CurrentStreak || 0);

  recentActivity = computed(() => {
    const progress = this.progressData();
    return progress?.RecentActivity || [];
  });

  activeGoals = computed(() => {
    return this.goals().filter((g) => g.Status === 'active');
  });

  ngOnInit(): void {
    // Load all data
    this.progressService.loadProgress();
    this.activityService.loadActivityStreak();
    this.goalsService.loadGoals();

    // Debug: Log when progress data changes
    effect(() => {
      const data = this.progressData();
      console.log('Progress data in component:', data);
      if (data) {
        console.log('MissionProgress:', data.MissionProgress);
        console.log('BadgeProgress:', data.BadgeProgress);
        console.log('TotalPoints:', data.TotalPoints);
        console.log('RecentActivity:', data.RecentActivity);
      }
    });
  }

  formatDateLabel(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours < 1) {
      return diffMinutes === 0 ? 'Just now' : `${diffMinutes}m ago`;
    }
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }

    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }

  getActivityIcon(type: string): string {
    const icons: { [key: string]: string } = {
      upload: '📤',
      badge_earned: '🏆',
      mission_completed: '✅',
      challenge_completed: '🎮',
    };
    return icons[type] || '📝';
  }

  getActivityTitle(type: string): string {
    const titles: { [key: string]: string } = {
      upload: 'File Uploaded',
      badge_earned: 'Badge Earned',
      mission_completed: 'Mission Completed',
      challenge_completed: 'Challenge Completed',
    };
    return titles[type] || 'Activity';
  }

  getGoalStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      active: 'goal-status-active',
      completed: 'goal-status-completed',
      expired: 'goal-status-expired',
    };
    return classes[status] || '';
  }

  onCreateGoal(): void {
    // TODO: Open goal creation modal/dialog
    console.log('Create new goal clicked');
  }
}
