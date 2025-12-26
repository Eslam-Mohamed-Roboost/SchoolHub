import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LeaderboardComponent,
  LeaderboardEntry,
  CurrentUser,
} from '../../../../shared/ui/leaderboard/leaderboard.component';
import { LoungeService } from '../../services/lounge.service';
import { TeachersLounge, Announcement } from '../../models/lounge.model';

interface AnnouncementDisplay {
  id: string;
  type: 'announcement' | 'recognition';
  icon: string;
  iconColor: string;
  title: string;
  date: string;
  description: string;
}

@Component({
  selector: 'app-teachers-lounge',
  imports: [CommonModule, LeaderboardComponent],
  template: `
    <div class="teachers-lounge container mx-auto px-4 py-8">
      <!-- Page Header -->
      <div class="mb-5">
        <h2 class="fw-bold mb-1"><i class="fas fa-users text-primary me-2"></i>Teacher Lounge</h2>
        <p class="text-muted mb-0">Community achievements, recognition, and school updates</p>
      </div>

      <div class="row g-4">
        <!-- CPD Leaders Leaderboard -->
        <div class="col-lg-4">
          <app-leaderboard
            title="🏆 Top CPD Leaders This Month"
            [leaders]="cpdLeaders"
            [currentUser]="currentUserCPD"
          />
        </div>

        <!-- Badge Leaders Leaderboard -->
        <div class="col-lg-4">
          <app-leaderboard
            title="🌟 Digital Citizenship Badge Leaders"
            [leaders]="badgeLeaders"
            [currentUser]="currentUserBadges"
          />
        </div>

        <!-- Communication Feed -->
        <div class="col-lg-4">
          <div class="card border-0 shadow-sm rounded-4 h-100">
            <div class="card-header bg-white border-bottom py-3 px-4">
              <h5 class="fw-bold mb-0">📢 Announcements & Recognition</h5>
            </div>
            <div class="card-body p-0" style="max-height: 600px; overflow-y: auto;">
              @if (announcementFeed.length > 0) {
              @for (item of announcementFeed; track item.id) {
              <div
                class="border-bottom p-4 hover-bg"
                style="cursor: pointer; transition: background-color 0.2s;"
              >
                <div class="d-flex align-items-start gap-3">
                  <div
                    class="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    [style.background]="item.iconColor + '20'"
                    [style.color]="item.iconColor"
                    style="width: 40px; height: 40px;"
                  >
                    <i [class]="item.icon"></i>
                  </div>
                  <div class="flex-grow-1">
                    <div class="d-flex justify-content-between align-items-start mb-1">
                      <h6 class="fw-bold mb-0">{{ item.title }}</h6>
                      <small class="text-muted">{{ item.date }}</small>
                    </div>
                    <p class="text-muted small mb-0">{{ item.description }}</p>
                    @if (item.type === 'recognition') {
                    <span class="badge bg-success mt-2">
                      <i class="fas fa-star me-1"></i>Recognition
                    </span>
                    }
                  </div>
                </div>
              </div>
              }
              } @else {
              <!-- Empty State for Announcements -->
              <div class="text-center py-5 px-4">
                <i class="fas fa-bullhorn text-muted" style="font-size: 3rem; opacity: 0.3;"></i>
                <p class="text-muted mt-3 mb-0">No announcements yet</p>
                <small class="text-muted">Check back later for updates</small>
              </div>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- Monthly Stats Overview -->
      <div class="row g-4 mt-4">
        <div class="col-md-3">
          <div class="card border-0 shadow-sm rounded-4 p-4 text-center">
            <div class="display-4 fw-bold text-primary mb-2">{{ stats.totalCpdHours.toFixed(1) }}</div>
            <p class="text-muted mb-0">Total CPD Hours</p>
            <small [class]="getChangeClass(stats.cpdHoursChange)">
              <i [class]="getChangeIcon(stats.cpdHoursChange)"></i>{{ formatChangePercent(stats.cpdHoursChange) }} from last month
            </small>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-0 shadow-sm rounded-4 p-4 text-center">
            <div class="display-4 fw-bold text-warning mb-2">{{ stats.badgesAwarded }}</div>
            <p class="text-muted mb-0">Badges Awarded</p>
            <small [class]="getChangeClass(stats.badgesChange)">
              <i [class]="getChangeIcon(stats.badgesChange)"></i>{{ formatChangePercent(stats.badgesChange) }} from last month
            </small>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-0 shadow-sm rounded-4 p-4 text-center">
            <div class="display-4 fw-bold text-success mb-2">{{ stats.activeTeachers }}</div>
            <p class="text-muted mb-0">Active Teachers</p>
            <small [class]="getChangeClass(stats.activeTeachersChange)">
              <i [class]="getChangeIcon(stats.activeTeachersChange)"></i>{{ formatChangePercent(stats.activeTeachersChange) }} from last month
            </small>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-0 shadow-sm rounded-4 p-4 text-center">
            <div class="display-4 fw-bold text-danger mb-2">{{ stats.engagementRate.toFixed(1) }}%</div>
            <p class="text-muted mb-0">Engagement Rate</p>
            <small [class]="getChangeClass(stats.engagementChange)">
              <i [class]="getChangeIcon(stats.engagementChange)"></i>{{ formatChangePercent(stats.engagementChange) }} from last month
            </small>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .hover-bg:hover {
        background-color: #f8f9fa;
      }
    `,
  ],
})
export class TeachersLoungeComponent implements OnInit {
  private loungeService = inject(LoungeService);

  // CPD Leaders Data
  cpdLeaders: LeaderboardEntry[] = [];
  currentUserCPD: CurrentUser | null = null;

  // Badge Leaders Data
  badgeLeaders: LeaderboardEntry[] = [];
  currentUserBadges: CurrentUser | null = null;

  // Announcements Feed
  announcementFeed: AnnouncementDisplay[] = [];

  // Stats
  stats = {
    totalCpdHours: 0,
    cpdHoursChange: 0,
    badgesAwarded: 0,
    badgesChange: 0,
    activeTeachers: 0,
    activeTeachersChange: 0,
    engagementRate: 0,
    engagementChange: 0,
  };

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    // Load lounge data
    // BaseHttpService.transformResponse unwraps ApiResponse and returns Data directly
    this.loungeService.loadLoungeData().subscribe({
      next: (data) => {
        if (data) {
          // Map CPD leaders
          this.cpdLeaders = (data.CpdLeaders || []).map((leader) => ({
            rank: leader.Rank,
            name: leader.Name,
            value: leader.Value,
            subtitle: leader.Subtitle,
          }));

          // Map current user CPD rank
          if (data.CurrentUserCpdRank) {
            this.currentUserCPD = {
              rank: data.CurrentUserCpdRank.Rank,
              value: data.CurrentUserCpdRank.Value,
            };
          }

          // Map badge leaders
          this.badgeLeaders = (data.BadgeLeaders || []).map((leader) => ({
            rank: leader.Rank,
            name: leader.Name,
            value: leader.Value,
            subtitle: leader.Subtitle,
          }));

          // Map current user badge rank
          if (data.CurrentUserBadgeRank) {
            this.currentUserBadges = {
              rank: data.CurrentUserBadgeRank.Rank,
              value: data.CurrentUserBadgeRank.Value,
            };
          }

          // Map stats
          if (data.Stats) {
            this.stats = {
              totalCpdHours: data.Stats.TotalCpdHours || 0,
              cpdHoursChange: data.Stats.CpdHoursChangePercent || 0,
              badgesAwarded: data.Stats.BadgesAwarded || 0,
              badgesChange: data.Stats.BadgesChangePercent || 0,
              activeTeachers: data.Stats.ActiveTeachers || 0,
              activeTeachersChange: data.Stats.ActiveTeachersChangePercent || 0,
              engagementRate: data.Stats.EngagementRate || 0,
              engagementChange: data.Stats.EngagementChangePercent || 0,
            };
          }
        }
      },
      error: (err) => {
        console.error('Failed to load lounge data:', err);
      },
    });

    // Load announcements
    // BaseHttpService.transformResponse unwraps ApiResponse and returns Data directly
    this.loungeService.loadAnnouncements(20).subscribe({
      next: (announcements) => {
        if (announcements && Array.isArray(announcements)) {
          this.announcementFeed = announcements.map((announcement) => ({
            id: announcement.Id,
            type: this.getAnnouncementType(announcement),
            icon: this.getAnnouncementIcon(announcement),
            iconColor: this.getAnnouncementColor(announcement),
            title: announcement.Title,
            date: this.formatDate(announcement.PublishedAt || announcement.CreatedAt),
            description: announcement.Content,
          }));
        }
      },
      error: (err) => {
        console.error('Failed to load announcements:', err);
      },
    });
  }

  private getAnnouncementType(announcement: Announcement): 'announcement' | 'recognition' {
    // Check if it's a recognition based on priority or content
    if (announcement.PriorityName === 'High' || announcement.Title.toLowerCase().includes('recognition') || announcement.Title.toLowerCase().includes('award')) {
      return 'recognition';
    }
    return 'announcement';
  }

  private getAnnouncementIcon(announcement: Announcement): string {
    if (announcement.Title.toLowerCase().includes('workshop') || announcement.Title.toLowerCase().includes('training')) {
      return 'fas fa-chalkboard-teacher';
    }
    if (announcement.Title.toLowerCase().includes('meeting')) {
      return 'fas fa-calendar';
    }
    if (announcement.Title.toLowerCase().includes('resource') || announcement.Title.toLowerCase().includes('vault')) {
      return 'fas fa-book';
    }
    if (announcement.Title.toLowerCase().includes('collaboration') || announcement.Title.toLowerCase().includes('team')) {
      return 'fas fa-users';
    }
    if (announcement.Title.toLowerCase().includes('award') || announcement.Title.toLowerCase().includes('trophy')) {
      return 'fas fa-trophy';
    }
    if (announcement.Title.toLowerCase().includes('recognition') || announcement.Title.toLowerCase().includes('champion')) {
      return 'fas fa-star';
    }
    return 'fas fa-bullhorn';
  }

  private getAnnouncementColor(announcement: Announcement): string {
    const type = this.getAnnouncementType(announcement);
    if (type === 'recognition') {
      return '#f59e0b'; // Gold
    }
    // Different colors based on priority
    switch (announcement.PriorityName) {
      case 'High':
        return '#ef4444'; // Red
      case 'Medium':
        return '#6366f1'; // Indigo
      default:
        return '#06b6d4'; // Cyan
    }
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  }

  formatChangePercent(percent: number): string {
    const sign = percent >= 0 ? '+' : '';
    return `${sign}${percent.toFixed(1)}%`;
  }

  getChangeIcon(percent: number): string {
    if (percent > 0) return 'fas fa-arrow-up me-1';
    if (percent < 0) return 'fas fa-arrow-down me-1';
    return 'fas fa-minus me-1';
  }

  getChangeClass(percent: number): string {
    if (percent > 0) return 'text-success';
    if (percent < 0) return 'text-danger';
    return 'text-muted';
  }
}
