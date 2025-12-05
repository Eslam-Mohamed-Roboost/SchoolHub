import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { BadgeService } from '../../services/badge.service';
import { ActivityService } from '../../services/activity.service';
import { AdminPortfolioAnalyticsService } from '../../services/admin-portfolio-analytics.service';
import { TeacherSubjectAnalyticsService } from '../../services/teacher-subject-analytics.service';
import { StatsCard, ActivityLog } from '../../models/admin.models';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private badgeService = inject(BadgeService);
  private activityService = inject(ActivityService);
  private portfolioAnalytics = inject(AdminPortfolioAnalyticsService);
  private teacherAnalytics = inject(TeacherSubjectAnalyticsService);

  ngOnInit(): void {
    // Initialize all services - ensures data loads on page refresh
    this.dashboardService.init();
    this.badgeService.init();
    this.activityService.init();
    this.portfolioAnalytics.init();
    this.teacherAnalytics.init();
  }

  // Loading state - true until data is loaded
  isLoading = computed(() => this.dashboardService.getIsLoading()());

  currentDate = computed(() => new Date());

  // Portfolio Analytics Data
  portfolioStats = computed(() => this.portfolioAnalytics.getPortfolioCompletionStats());
  evidenceStats = computed(() => this.portfolioAnalytics.getEvidenceCollectionStats());
  teacherSubjectMatrix = computed(() => this.teacherAnalytics.getTeacherSubjectMatrix());

  // Subject filtering
  selectedSubject = signal<string>('All Subjects');
  availableSubjects = this.teacherAnalytics.availableSubjects;

  subjectAnalytics = computed(() =>
    this.teacherAnalytics.getSubjectFilteredAnalytics(this.selectedSubject())
  );

  statsCards = computed(() => this.dashboardService.getStatsCards());
  pendingApprovals = computed(() => this.badgeService.getPendingSubmissions());
  recentActivities = computed(() => this.activityService.getRecentActivities());

  selectedActivityFilter = signal<string>('All');

  filteredActivities = computed(() => {
    const filter = this.selectedActivityFilter();
    if (filter === 'All') return this.recentActivities();

    return this.recentActivities().filter((activity) => activity.type === filter);
  });

  quickActions = [
    {
      icon: '🔍',
      label: 'Approve Badges',
      route: '/admin/evidence',
      description: 'Review pending badge submissions',
    },
    { icon: '➕', label: 'Add User', action: 'addUser', description: 'Create new user account' },
    {
      icon: '📢',
      label: 'Publish News',
      route: '/admin/announcements',
      description: 'Create announcement',
    },
    {
      icon: '📊',
      label: 'Run Report',
      route: '/admin/reports',
      description: 'Generate system reports',
    },
    { icon: '💾', label: 'Backup Data', action: 'backup', description: 'Manual data backup' },
    { icon: '✏️', label: 'Update Content', route: '/admin/content', description: 'Manage content' },
    { icon: '📧', label: 'Send Announcement', action: 'sendEmail', description: 'Email all users' },
  ];

  activityFilters = ['All', 'Login', 'Badge', 'Upload', 'Completion'];

  filterActivities(filter: string) {
    this.selectedActivityFilter.set(filter);
  }

  handleQuickAction(action: string) {
    console.log('Quick action:', action);
    // These will be implemented with modals
  }

  getActivityTypeClass(type: string): string {
    const classes: Record<string, string> = {
      Login: 'activity-login',
      Badge: 'activity-badge',
      Upload: 'activity-upload',
      Completion: 'activity-completion',
      Update: 'activity-update',
    };
    return classes[type] || '';
  }

  formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  }

  // Portfolio-specific methods
  selectSubject(subject: string): void {
    this.selectedSubject.set(subject);
  }

  downloadEvidence(): void {
    const request = {
      dateRange: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        end: new Date(),
      },
      subjects: [this.selectedSubject()],
      evidenceTypes: ['portfolios' as const, 'cpd' as const, 'badges' as const],
      format: 'zip' as const,
    };

    this.teacherAnalytics.exportEvidenceBySubject(request).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `evidence-export-${this.selectedSubject()}-${Date.now()}.zip`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => console.error('Failed to export evidence', err),
    });
  }
}
