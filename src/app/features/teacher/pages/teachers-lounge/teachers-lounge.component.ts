import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LeaderboardComponent,
  LeaderboardEntry,
  CurrentUser,
} from '../../../../shared/ui/leaderboard/leaderboard.component';

interface Announcement {
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
            </div>
          </div>
        </div>
      </div>

      <!-- Monthly Stats Overview -->
      <div class="row g-4 mt-4">
        <div class="col-md-3">
          <div class="card border-0 shadow-sm rounded-4 p-4 text-center">
            <div class="display-4 fw-bold text-primary mb-2">156</div>
            <p class="text-muted mb-0">Total CPD Hours</p>
            <small class="text-success">
              <i class="fas fa-arrow-up me-1"></i>12% from last month
            </small>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-0 shadow-sm rounded-4 p-4 text-center">
            <div class="display-4 fw-bold text-warning mb-2">89</div>
            <p class="text-muted mb-0">Badges Awarded</p>
            <small class="text-success">
              <i class="fas fa-arrow-up me-1"></i>8% from last month
            </small>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-0 shadow-sm rounded-4 p-4 text-center">
            <div class="display-4 fw-bold text-success mb-2">24</div>
            <p class="text-muted mb-0">Active Teachers</p>
            <small class="text-muted"> <i class="fas fa-minus me-1"></i>Same as last month </small>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-0 shadow-sm rounded-4 p-4 text-center">
            <div class="display-4 fw-bold text-danger mb-2">98%</div>
            <p class="text-muted mb-0">Engagement Rate</p>
            <small class="text-success">
              <i class="fas fa-arrow-up me-1"></i>3% from last month
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
export class TeachersLoungeComponent {
  // CPD Leaders Data
  cpdLeaders: LeaderboardEntry[] = [
    {
      rank: 1,
      name: 'Ahmed Al-Mansouri',
      value: '8.5 hours',
      subtitle: 'Math Department',
    },
    {
      rank: 2,
      name: 'Fatima Al-Kuwari',
      value: '7.2 hours',
      subtitle: 'Science Department',
    },
    {
      rank: 3,
      name: 'Mohammed Al-Thani',
      value: '6.8 hours',
      subtitle: 'English Department',
    },
  ];

  currentUserCPD: CurrentUser = {
    rank: 7,
    value: '3.5 hours',
  };

  // Badge Leaders Data
  badgeLeaders: LeaderboardEntry[] = [
    {
      rank: 1,
      name: 'Layla Al-Sabah',
      value: '45 badges',
      subtitle: 'Grade 10 Class',
    },
    {
      rank: 2,
      name: 'Omar Al-Dosari',
      value: '38 badges',
      subtitle: 'Grade 9 Class',
    },
    {
      rank: 3,
      name: 'Sarah Johnson',
      value: '32 badges',
      subtitle: 'Grade 8 Class',
    },
  ];

  currentUserBadges: CurrentUser = {
    rank: 5,
    value: '28 badges',
  };

  // Announcements Feed
  announcementFeed: Announcement[] = [
    {
      id: '1',
      type: 'recognition',
      icon: 'fas fa-trophy',
      iconColor: '#f59e0b',
      title: 'Teacher of the Month',
      date: 'Today',
      description:
        'Congratulations to Ahmed Al-Mansouri for achieving the highest CPD hours this month!',
    },
    {
      id: '2',
      type: 'announcement',
      icon: 'fas fa-bullhorn',
      iconColor: '#6366f1',
      title: 'New AI Tools Workshop',
      date: 'Yesterday',
      description:
        'Join us for an exclusive workshop on integrating AI tools in the classroom. Dec 10, 2:00 PM.',
    },
    {
      id: '3',
      type: 'recognition',
      icon: 'fas fa-star',
      iconColor: '#10b981',
      title: 'Digital Citizenship Champion',
      date: '2 days ago',
      description:
        "Layla Al-Sabah's class has earned the most digital citizenship badges this month. Amazing work!",
    },
    {
      id: '4',
      type: 'announcement',
      icon: 'fas fa-calendar',
      iconColor: '#ec4899',
      title: 'Term Review Meeting',
      date: '3 days ago',
      description:
        'All staff invited to the end-of-term review meeting. Dec 15, Main Hall, 1:30 PM.',
    },
    {
      id: '5',
      type: 'announcement',
      icon: 'fas fa-book',
      iconColor: '#8b5cf6',
      title: 'New Resources Available',
      date: '5 days ago',
      description:
        'Check out the updated lesson plans and assessment templates in the Learning Vault.',
    },
    {
      id: '6',
      type: 'recognition',
      icon: 'fas fa-award',
      iconColor: '#ef4444',
      title: 'Innovation Award',
      date: '1 week ago',
      description:
        'Mohammed Al-Thani recognized for innovative use of technology in English literature classes.',
    },
    {
      id: '7',
      type: 'announcement',
      icon: 'fas fa-users',
      iconColor: '#06b6d4',
      title: 'Department Collaboration',
      date: '1 week ago',
      description:
        'Science and Math departments to collaborate on interdisciplinary STEM project for Q2.',
    },
  ];
}
