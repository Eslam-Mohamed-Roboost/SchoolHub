import { Injectable, signal } from '@angular/core';
import { StatsCard } from '../models/admin.models';
import { UserService } from './user.service';
import { BadgeService } from './badge.service';
import { ActivityService } from './activity.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(
    private userService: UserService,
    private badgeService: BadgeService,
    private activityService: ActivityService
  ) {}

  getStatsCards(): StatsCard[] {
    const userCounts = this.userService.getUserCountByRole();
    const badgeStats = this.badgeService.getBadgeStatistics();
    const weekActivity = this.activityService.getWeekActivityCount();

    return [
      {
        title: 'Total Users',
        value: this.userService.getTotalUserCount(),
        breakdown: `${userCounts.teachers} Teachers • ${userCounts.students} Students`,
        icon: '👥',
        trend: 'neutral',
      },
      {
        title: 'Badges Earned',
        value: badgeStats.approved,
        breakdown: `${badgeStats.approved} Total Badges`,
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
  }

  getPendingApprovalsCount(): number {
    return this.badgeService.getPendingSubmissions().length;
  }
}
