import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-challenge-reward-display',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="challenge-rewards">
      <div class="rewards-header">
        <span class="rewards-label">Rewards</span>
      </div>
      <div class="rewards-list">
        @if (points && points > 0) {
          <div class="reward-badge points">
            <span class="icon">⭐</span>
            <span class="value">{{ points }} pts</span>
          </div>
        }
        @if (hoursAwarded && hoursAwarded > 0) {
          <div class="reward-badge hours">
            <span class="icon">⏱️</span>
            <span class="value">{{ hoursAwarded }}h</span>
          </div>
        }
        @if (hasBadge) {
          <div class="reward-badge badge">
            <span class="icon">🏆</span>
            <span class="value">Badge</span>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .challenge-rewards {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #e5e7eb;
    }

    .rewards-header {
      margin-bottom: 0.5rem;
    }

    .rewards-label {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      color: #6b7280;
      letter-spacing: 0.05em;
    }

    .rewards-list {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .reward-badge {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .reward-badge.points {
      background: linear-gradient(135deg, #fef3c7, #fcd34d);
      color: #78350f;
    }

    .reward-badge.hours {
      background: linear-gradient(135deg, #ddd6fe, #a78bfa);
      color: #4c1d95;
    }

    .reward-badge.badge {
      background: linear-gradient(135deg, #fecaca, #f87171);
      color: #7f1d1d;
    }

    .icon {
      font-size: 0.9rem;
    }

    .value {
      font-size: 0.75rem;
    }
  `]
})
export class ChallengeRewardDisplayComponent {
  @Input() points?: number;
  @Input() hoursAwarded?: number;
  @Input() hasBadge = false;
}

