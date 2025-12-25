import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseHttpService } from '../../../../core/services/base-http.service';

interface BadgeConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  targetRole: 'Student' | 'Teacher' | 'Both';
  autoAward: boolean;
  criteria: string;
  cpdHours?: number;
}

interface ActivityHoursConfig {
  activityType: 'Mission' | 'Challenge' | 'CPD';
  activityId?: string;
  activityName: string;
  hoursAwarded: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
}

@Component({
  selector: 'app-badge-configuration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './badge-configuration.component.html',
  styleUrls: ['./badge-configuration.component.css']
})
export class BadgeConfigurationComponent extends BaseHttpService implements OnInit {
  badges = signal<BadgeConfig[]>([]);
  hoursConfig = signal<ActivityHoursConfig[]>([]);
  isLoading = signal(true);
  activeTab = signal<'badges' | 'hours'>('badges');

  // Form data
  editingBadge = signal<BadgeConfig | null>(null);
  showBadgeModal = signal(false);

  ngOnInit(): void {
    this.loadBadges();
    this.loadHoursConfig();
  }

  // ============================================
  // DATA LOADING
  // ============================================

  loadBadges(): void {
    this.isLoading.set(true);
    this.get<BadgeConfig[]>('/Admin/Badges').subscribe({
      next: (data) => {
        this.badges.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load badges:', err);
        this.isLoading.set(false);
      }
    });
  }

  loadHoursConfig(): void {
    // TODO: Implement hours config endpoint
    // For now, using mock data
    const mockConfig: ActivityHoursConfig[] = [
      { activityType: 'Mission', activityName: 'Mission 1-4', hoursAwarded: 1.5 },
      { activityType: 'Mission', activityName: 'Mission 5-8', hoursAwarded: 2.0 },
      { activityType: 'Challenge', activityName: 'Easy Challenges', hoursAwarded: 0.5, difficulty: 'Easy' },
      { activityType: 'Challenge', activityName: 'Medium Challenges', hoursAwarded: 1.0, difficulty: 'Medium' },
      { activityType: 'Challenge', activityName: 'Hard Challenges', hoursAwarded: 1.5, difficulty: 'Hard' },
    ];
    this.hoursConfig.set(mockConfig);
  }

  // ============================================
  // BADGE MANAGEMENT
  // ============================================

  openCreateBadgeModal(): void {
    this.editingBadge.set({
      id: '',
      name: '',
      description: '',
      icon: '🏆',
      color: '#FFD700',
      targetRole: 'Student',
      autoAward: true,
      criteria: ''
    });
    this.showBadgeModal.set(true);
  }

  openEditBadgeModal(badge: BadgeConfig): void {
    this.editingBadge.set({ ...badge });
    this.showBadgeModal.set(true);
  }

  closeBadgeModal(): void {
    this.showBadgeModal.set(false);
    setTimeout(() => {
      this.editingBadge.set(null);
    }, 300);
  }

  saveBadge(): void {
    const badge = this.editingBadge();
    if (!badge) return;

    if (badge.id) {
      // Update existing badge
      this.put(`/Admin/Badges/${badge.id}`, badge).subscribe({
        next: () => {
          this.loadBadges();
          this.closeBadgeModal();
        },
        error: (err) => {
          console.error('Failed to update badge:', err);
        }
      });
    } else {
      // Create new badge
      this.post('/Admin/Badges', badge).subscribe({
        next: () => {
          this.loadBadges();
          this.closeBadgeModal();
        },
        error: (err) => {
          console.error('Failed to create badge:', err);
        }
      });
    }
  }

  deleteBadge(badgeId: string): void {
    if (!confirm('Are you sure you want to delete this badge?')) return;

    this.delete(`/Admin/Badges/${badgeId}`).subscribe({
      next: () => {
        this.loadBadges();
      },
      error: (err) => {
        console.error('Failed to delete badge:', err);
      }
    });
  }

  // ============================================
  // HOURS CONFIGURATION
  // ============================================

  updateHoursConfig(config: ActivityHoursConfig): void {
    // TODO: Implement hours config update endpoint
    console.log('Updating hours config:', config);
  }

  // ============================================
  // STATISTICS
  // ============================================

  getBadgeStatistics(): void {
    this.get('/Admin/BadgeStatistics').subscribe({
      next: (stats) => {
        console.log('Badge statistics:', stats);
      },
      error: (err) => {
        console.error('Failed to load badge statistics:', err);
      }
    });
  }

  // ============================================
  // HELPERS
  // ============================================

  setActiveTab(tab: 'badges' | 'hours'): void {
    this.activeTab.set(tab);
  }
}

