import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mission-reward-display',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="reward-display">
      @if (badgeName) {
        <div class="reward-item badge-reward">
          <span class="reward-icon">🏆</span>
          <span class="reward-text">{{ badgeName }}</span>
        </div>
      }
      @if (hoursAwarded && hoursAwarded > 0) {
        <div class="reward-item hours-reward">
          <span class="reward-icon">⏱️</span>
          <span class="reward-text">{{ hoursAwarded }}h</span>
        </div>
      }
    </div>
  `,
  styles: [`
    .reward-display {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
      margin-top: 0.5rem;
    }

    .reward-item {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.35rem 0.75rem;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .badge-reward {
      background: linear-gradient(135deg, #FFD700, #FFA500);
      color: #5a3a00;
    }

    .hours-reward {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
    }

    .reward-icon {
      font-size: 1rem;
    }

    .reward-text {
      font-size: 0.8rem;
    }
  `]
})
export class MissionRewardDisplayComponent {
  @Input() badgeName?: string;
  @Input() hoursAwarded?: number;
}

