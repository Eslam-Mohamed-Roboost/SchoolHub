import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentChallengesService } from '../../services/student-challenges.service';

@Component({
  selector: 'app-challenge-zone',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-container">
      <header class="page-header">
        <div class="header-icon">🎮</div>
        <div class="header-content">
          <h1>Challenge Zone</h1>
          <p>Test your skills, play games, and have fun with real-time challenges from your teacher.</p>
        </div>
      </header>

      <div class="challenge-tabs" aria-label="Challenge filters">
        <button class="tab active" type="button">All Challenges</button>
        <button class="tab" type="button" disabled>New 🆕</button>
        <button class="tab" type="button" disabled>Completed ✅</button>
      </div>

      @if (challengesService.isLoadingData()) {
        <div class="text-center py-5">
          <div class="spinner-border text-primary" role="status" aria-live="polite">
            <span class="visually-hidden">Loading challenges...</span>
          </div>
          <p class="mt-3 text-muted">Loading your challenges...</p>
        </div>
      } @else if (activeChallenges().length === 0) {
        <div class="text-center py-5">
          <i class="fas fa-flag-checkered fa-3x text-muted mb-3"></i>
          <h3 class="fw-bold mb-2">No active challenges</h3>
          <p class="text-muted mb-0">
            Your teacher hasn't assigned any challenges yet. Check back soon!
          </p>
        </div>
      } @else {
        <div class="challenges-grid" aria-live="polite">
          @for (challenge of activeChallenges(); track challenge.Id) {
            <article class="challenge-card" [attr.aria-label]="challenge.Title">
              <div class="card-image" [ngClass]="getBackgroundClass(challenge.Difficulty)">
                <span class="type-icon">{{ getTypeIcon(challenge) }}</span>
                <span class="difficulty" [ngClass]="challenge.Difficulty">
                  {{ challenge.Difficulty | titlecase }}
                </span>
              </div>
              <div class="card-content">
                <h3>{{ challenge.Title }}</h3>
                <p>{{ challenge.Description }}</p>
                <div class="card-meta">
                  <span>⏱️ {{ challenge.StartDate | date : 'MMM d' }} - {{ challenge.EndDate | date : 'MMM d' }}</span>
                  <span>⭐ {{ challenge.Points }} pts</span>
                </div>
                <button
                  class="btn-start"
                  type="button"
                  (click)="onJoinChallenge(challenge.Id)"
                  [disabled]="challenge.Completed"
                >
                  {{ challenge.Completed ? 'Completed' : 'Join Challenge' }}
                </button>
              </div>
            </article>
          }
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
        background: #e6e6fa;
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

      .challenge-tabs {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
      }
      .tab {
        background: white;
        border: 1px solid #eee;
        padding: 0.75rem 1.5rem;
        border-radius: 20px;
        font-weight: 600;
        color: #666;
        cursor: pointer;
        transition: all 0.2s;
      }
      .tab.active {
        background: #7719aa;
        color: white;
        border-color: #7719aa;
      }
      .tab:hover:not(.active) {
        background: #f5f5f5;
      }

      .challenges-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 2rem;
      }
      .challenge-card {
        background: white;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        transition: transform 0.2s;
        border: 2px solid transparent;
      }
      .challenge-card:hover {
        transform: translateY(-5px);
        border-color: #7719aa;
      }

      .card-image {
        height: 160px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .quiz-bg {
        background: linear-gradient(135deg, #ffb900, #ffd700);
      }
      .create-bg {
        background: linear-gradient(135deg, #00bcf2, #00e5ff);
      }
      .game-bg {
        background: linear-gradient(135deg, #ff5252, #ff8a80);
      }
      .investigate-bg {
        background: linear-gradient(135deg, #7719aa, #9c27b0);
      }

      .type-icon {
        font-size: 4rem;
        filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.1));
      }

      .difficulty {
        position: absolute;
        top: 1rem;
        right: 1rem;
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 700;
        background: rgba(255, 255, 255, 0.9);
        color: #333;
      }
      .difficulty.easy {
        color: #107c10;
      }
      .difficulty.medium {
        color: #8a6d00;
      }
      .difficulty.hard {
        color: #d13438;
      }

      .card-content {
        padding: 1.5rem;
      }
      h3 {
        margin: 0 0 0.5rem 0;
        color: #333;
        font-size: 1.25rem;
      }
      p {
        color: #666;
        font-size: 0.95rem;
        margin-bottom: 1.5rem;
        line-height: 1.4;
        min-height: 2.8em;
      }

      .card-meta {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1.5rem;
        font-size: 0.9rem;
        font-weight: 600;
        color: #555;
      }

      .btn-start {
        width: 100%;
        padding: 0.75rem;
        background: white;
        border: 2px solid #7719aa;
        color: #7719aa;
        border-radius: 10px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s;
      }
      .btn-start:hover {
        background: #7719aa;
        color: white;
      }
    `,
  ],
})
export class ChallengeZoneComponent {
  challengesService = inject(StudentChallengesService);

  activeChallenges = computed(() => this.challengesService.getActiveChallenges());

  constructor() {
    // Load challenges when page is opened
    this.challengesService.loadActiveChallenges();
  }

  onJoinChallenge(challengeId: number): void {
    this.challengesService.joinChallenge(challengeId);
  }

  getBackgroundClass(difficulty: string): string {
    if (difficulty === 'easy') return 'quiz-bg';
    if (difficulty === 'medium') return 'create-bg';
    return 'game-bg';
  }

  getTypeIcon(challenge: { Difficulty: string }): string {
    if (challenge.Difficulty === 'easy') return '🧠';
    if (challenge.Difficulty === 'medium') return '🎨';
    return '🕹️';
  }
}
