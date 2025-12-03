import { Injectable, signal, computed } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { StatsCard, AdminKpiResponse } from '../models/admin.models';
import { BaseHttpService } from '../../../core/services/base-http.service';
import { Admin_API_ENDPOINTS } from '../../../config/AdminConfig/AdminEndpoint';
import { UserService } from './user.service';
import { BadgeService } from './badge.service';
import { ActivityService } from './activity.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardService extends BaseHttpService {
  private kpiData = signal<AdminKpiResponse | null>(null);
  private readonly fallbackKpi: AdminKpiResponse = {
    TotalUsers: 3,
    BadgesEarned: 0,
    ThisWeekActivity: 500000,
  };

  constructor(
    private userService: UserService,
    private badgeService: BadgeService,
    private activityService: ActivityService
  ) {
    super();
    this.loadKpiData();
  }

  loadKpiData(): void {
    this.get<AdminKpiResponse>(Admin_API_ENDPOINTS.AdminKpi).subscribe({
      next: (data) => {
        // If API returns null/undefined or missing keys, fall back to defaults
        if (!data || data.TotalUsers == null || data.BadgesEarned == null || data.ThisWeekActivity == null) {
          this.kpiData.set(this.fallbackKpi);
        } else {
          this.kpiData.set(data);
        }
      },
      error: (error) => {
        console.error('Failed to load admin KPI data', error);
        // On error, populate with fallback values so UI remains usable
        this.kpiData.set(this.fallbackKpi);
      },
    });
  }

  getStatsCards = computed((): StatsCard[] => {
    const kpi = this.kpiData();
    const userCounts = this.userService.getUserCountByRole();

    // Use API data if available, otherwise fallback to local data
    const totalUsers = kpi?.TotalUsers ?? this.userService.getTotalUserCount();
    const badgesEarned = kpi?.BadgesEarned ?? this.badgeService.getBadgeStatistics().approved;
    const weekActivity = kpi?.ThisWeekActivity ?? this.activityService.getWeekActivityCount();

    return [
      {
        title: 'Total Users',
        value: totalUsers,
        breakdown: `${userCounts.teachers} Teachers • ${userCounts.students} Students`,
        icon: '👥',
        trend: 'neutral',
      },
      {
        title: 'Badges Earned',
        value: badgesEarned,
        breakdown: `${badgesEarned} Total Badges`,
        comparison: '↑ 12 from last week',
        icon: '🏆',
        trend: 'up',
      },
      {
        title: 'This Week Activity',
        value: weekActivity,
        breakdown: 'Logins, Submissions, Completions',
        icon: '📊',
        trend: 'up',
      },
    ];
  });

  getPendingApprovalsCount(): number {
    return this.badgeService.getPendingSubmissions().length;
  }
}
