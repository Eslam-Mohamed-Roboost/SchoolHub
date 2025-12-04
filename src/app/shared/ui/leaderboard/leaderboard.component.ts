import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface LeaderboardEntry {
  rank: number;
  name: string;
  value: string | number;
  avatar?: string;
  subtitle?: string;
}

export interface CurrentUser {
  rank: number;
  value: string | number;
}

@Component({
  selector: 'app-leaderboard',
  imports: [CommonModule],
  template: `
    <div class="leaderboard card border-0 shadow-sm rounded-4 h-100">
      <div class="card-header bg-white border-bottom py-3 px-4">
        <h5 class="fw-bold mb-0">{{ title() }}</h5>
      </div>

      <div class="card-body p-4">
        <!-- Top 3 Leaders -->
        @for (leader of leaders(); track leader.rank) {
        <div
          class="leader-item d-flex align-items-center gap-3 p-3 rounded-3 mb-2"
          [class.top-1]="leader.rank === 1"
          [class.top-2]="leader.rank === 2"
          [class.top-3]="leader.rank === 3"
        >
          <!-- Rank Icon -->
          <div class="rank-icon">
            @if (leader.rank === 1) {
            <i class="fas fa-trophy text-warning fs-3"></i>
            } @else if (leader.rank === 2) {
            <i class="fas fa-medal text-secondary fs-4"></i>
            } @else if (leader.rank === 3) {
            <i class="fas fa-medal text-danger fs-5"></i>
            } @else {
            <span class="badge bg-light text-dark">{{ leader.rank }}</span>
            }
          </div>

          <!-- Avatar (if provided) -->
          @if (leader.avatar) {
          <img
            [src]="leader.avatar"
            [alt]="leader.name"
            class="rounded-circle"
            width="40"
            height="40"
          />
          } @else {
          <div
            class="avatar-placeholder rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
          >
            {{ getInitials(leader.name) }}
          </div>
          }

          <!-- Name & Subtitle -->
          <div class="flex-grow-1">
            <div class="fw-bold">{{ leader.name }}</div>
            @if (leader.subtitle) {
            <small class="text-muted">{{ leader.subtitle }}</small>
            }
          </div>

          <!-- Value -->
          <div class="text-end">
            <span class="badge bg-light text-dark fw-bold">{{ leader.value }}</span>
          </div>
        </div>
        }

        <!-- Current User Position (if not in top 3) -->
        @if (currentUser() && currentUser()!.rank > 3) {
        <div class="mt-3 pt-3 border-top">
          <div class="d-flex align-items-center justify-content-between p-3 bg-light rounded-3">
            <div>
              <span class="text-muted">Your Position:</span>
              <span class="fw-bold ms-2">#{{ currentUser()!.rank }}</span>
            </div>
            <span class="badge bg-primary">{{ currentUser()!.value }}</span>
          </div>
        </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .leaderboard {
        transition: all 0.3s ease;
      }

      .leader-item {
        transition: all 0.2s ease;
        background-color: #f8f9fa;
      }

      .leader-item:hover {
        background-color: #e9ecef;
        transform: translateX(5px);
      }

      .leader-item.top-1 {
        background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
        border: 2px solid #f59e0b;
      }

      .leader-item.top-2 {
        background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
        border: 2px solid #9ca3af;
      }

      .leader-item.top-3 {
        background: linear-gradient(135deg, #fecaca 0%, #fca5a5 100%);
        border: 2px solid #ef4444;
      }

      .rank-icon {
        width: 40px;
        text-align: center;
      }

      .avatar-placeholder {
        width: 40px;
        height: 40px;
        font-size: 0.875rem;
        font-weight: 600;
      }
    `,
  ],
})
export class LeaderboardComponent {
  title = input.required<string>();
  leaders = input.required<LeaderboardEntry[]>();
  currentUser = input<CurrentUser | null>(null);

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}
