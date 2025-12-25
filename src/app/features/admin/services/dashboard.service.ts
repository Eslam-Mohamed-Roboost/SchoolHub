import { Injectable, signal, computed } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseHttpService } from '../../../core/services/base-http.service';
import { Admin_API_ENDPOINTS } from '../../../config/AdminConfig/AdminEndpoint';
import { environment } from '../../../config/environment';
import {
  EnhancedDashboardDto,
  MetricCard,
  StudentAchievementMetrics,
  TeacherCPDMetrics,
  ADEKComplianceMetrics,
  PlatformEngagementMetrics,
  AIInsightDto,
} from '../models/enhanced-dashboard.model';

// API Response wrapper (matches backend EndPointResponse)
interface ApiResponse<T> {
  Data: T;
  IsSuccess: boolean;
  Message: string;
  ErrorCode: string;
  IsAuthorized: boolean;
}

// Admin Dashboard DTO (matches backend AdminDashboardDto)
interface AdminDashboardDto {
  TotalStudents: number;
  TotalTeachers: number;
  TotalBadgesEarned: number;
  TotalMissionsCompleted: number;
  ActiveUsersThisWeek: number;
  PortfolioFilesUploaded: number;
  RecentActivities: RecentActivityDto[];
  TopStudents: TopStudentDto[];
}

interface RecentActivityDto {
  UserId: number;
  UserName: string;
  Action: string;
  Type: string;
  CreatedAt: string;
}

interface TopStudentDto {
  StudentId: number;
  Name: string;
  BadgesCount: number;
  MissionsCompleted: number;
}

// Stats card for display
interface StatsCard {
  title: string;
  value: string | number;
  breakdown?: string;
  comparison?: string;
  icon: string;
  trend?: 'up' | 'down' | 'neutral';
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService extends BaseHttpService {
  private dashboardData = signal<AdminDashboardDto | null>(null);
  private enhancedDashboardData = signal<EnhancedDashboardDto | null>(null);
  private isLoading = signal(true);
  private isEnhancedLoading = signal(true);

  constructor() {
    super();
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  init(): void {
    this.isLoading.set(true);

    const token = localStorage.getItem(environment.tokenKey);
    if (token) {
      this.loadDashboardData();
    } else {
      console.warn('No auth token found, using mock data');
      setTimeout(() => {
        this.dashboardData.set(this.getMockDashboardData());
        this.isLoading.set(false);
      }, 500);
    }
  }

  initEnhanced(): void {
    this.isEnhancedLoading.set(true);

    const token = localStorage.getItem(environment.tokenKey);
    if (token) {
      this.loadEnhancedDashboard();
    } else {
      console.warn('No auth token found, using mock enhanced data');
      setTimeout(() => {
        this.enhancedDashboardData.set(this.getMockEnhancedDashboard());
        this.isEnhancedLoading.set(false);
      }, 500);
    }
  }

  // ============================================
  // LOAD DATA FROM API
  // ============================================

  loadDashboardData(): void {
    this.isLoading.set(true);

    console.log('Loading Dashboard data from:', Admin_API_ENDPOINTS.Dashboard.BASIC);

    this.get<ApiResponse<AdminDashboardDto> | AdminDashboardDto>(
      Admin_API_ENDPOINTS.Dashboard.BASIC
    ).subscribe({
      next: (response: ApiResponse<AdminDashboardDto> | AdminDashboardDto) => {
        console.log('Dashboard Data received:', response);

        // Check if response is wrapped or direct data
        if ('TotalStudents' in response) {
          // Direct data format
          this.dashboardData.set(response as AdminDashboardDto);
        } else if ('Data' in response && response.IsSuccess && response.Data) {
          // Wrapped format { Data: ..., IsSuccess: ... }
          this.dashboardData.set(response.Data);
        } else if ('Data' in response && response.Data) {
          // Wrapped but IsSuccess might be undefined
          this.dashboardData.set(response.Data);
        } else {
          console.warn('API returned unexpected format, using mock data');
          this.dashboardData.set(this.getMockDashboardData());
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load Dashboard data:', err);
        this.dashboardData.set(this.getMockDashboardData());
        this.isLoading.set(false);
      },
    });
  }

  reload(): void {
    this.loadDashboardData();
  }

  loadEnhancedDashboard(): void {
    this.isEnhancedLoading.set(true);

    console.log('Loading Enhanced Dashboard data from:', Admin_API_ENDPOINTS.Dashboard.ENHANCED);

    this.get<ApiResponse<EnhancedDashboardDto> | EnhancedDashboardDto>(
      Admin_API_ENDPOINTS.Dashboard.ENHANCED
    ).subscribe({
      next: (response: ApiResponse<EnhancedDashboardDto> | EnhancedDashboardDto) => {
        console.log('Enhanced Dashboard Data received:', response);

        // Check if response is wrapped or direct data
        if ('studentAchievement' in response) {
          // Direct data format
          this.enhancedDashboardData.set(response as EnhancedDashboardDto);
        } else if ('Data' in response && response.IsSuccess && response.Data) {
          // Wrapped format { Data: ..., IsSuccess: ... }
          this.enhancedDashboardData.set(response.Data);
        } else if ('Data' in response && response.Data) {
          // Wrapped but IsSuccess might be undefined
          this.enhancedDashboardData.set(response.Data);
        } else {
          console.warn('API returned unexpected format, using mock data');
          this.enhancedDashboardData.set(this.getMockEnhancedDashboard());
        }
        this.isEnhancedLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load Enhanced Dashboard data:', err);
        this.enhancedDashboardData.set(this.getMockEnhancedDashboard());
        this.isEnhancedLoading.set(false);
      },
    });
  }

  reloadEnhanced(): void {
    this.loadEnhancedDashboard();
  }

  // ============================================
  // GETTERS
  // ============================================

  getDashboardData() {
    return this.dashboardData.asReadonly();
  }

  getIsLoading() {
    return this.isLoading.asReadonly();
  }

  getEnhancedDashboardData() {
    return this.enhancedDashboardData.asReadonly();
  }

  getIsEnhancedLoading() {
    return this.isEnhancedLoading.asReadonly();
  }

  // Computed values
  readonly totalUsers = computed(
    () => (this.dashboardData()?.TotalStudents ?? 0) + (this.dashboardData()?.TotalTeachers ?? 0)
  );
  readonly totalStudents = computed(() => this.dashboardData()?.TotalStudents ?? 0);
  readonly totalTeachers = computed(() => this.dashboardData()?.TotalTeachers ?? 0);
  readonly badgesEarned = computed(() => this.dashboardData()?.TotalBadgesEarned ?? 0);
  readonly weekActivity = computed(() => this.dashboardData()?.ActiveUsersThisWeek ?? 0);
  readonly recentActivities = computed(() => this.dashboardData()?.RecentActivities ?? []);
  readonly topStudents = computed(() => this.dashboardData()?.TopStudents ?? []);

  // Enhanced Dashboard Computed Values
  readonly studentAchievementCard = computed((): MetricCard | null => {
    const data = this.enhancedDashboardData()?.studentAchievement;
    if (!data) return null;

    return {
      title: 'Student Achievement Overview',
      icon: '👥',
      iconColor: 'purple',
      mainValue: data.totalStudents,
      subtitle: `Grade 6: ${data.grade6Count} | Grade 7: ${data.grade7Count}`,
      details: [
        { label: 'Digital Citizenship Progress', value: `${data.digitalCitizenshipProgress}%` },
        { label: 'Portfolio Quality Score', value: `${data.portfolioQualityScore}/10 ⭐` },
        { label: 'At-Risk Students', value: `${data.atRiskCount} 🔴` },
        { label: 'Top Performers', value: `${data.topPerformersCount} 🟢` },
      ],
    };
  });

  readonly teacherCPDCard = computed((): MetricCard | null => {
    const data = this.enhancedDashboardData()?.teacherCPD;
    if (!data) return null;

    return {
      title: 'Teacher Professional Development',
      icon: '👨‍🏫',
      iconColor: 'orange',
      mainValue: data.activeTeachers,
      subtitle: `Active Teachers (${data.totalTeachers} Total Staff)`,
      details: [
        { label: 'CPD Hours This Month', value: `${data.cpdHoursThisMonth} hours (Target: ${data.targetHoursThisMonth}h)` },
        { label: 'Badge Completion Rate', value: `${data.badgeCompletionRate.toFixed(0)}%` },
        { label: 'Resource Engagement', value: `${data.resourceDownloads} downloads 📥` },
        { label: 'Top Performer', value: `${data.topPerformerName} (${data.topPerformerHours}h)` },
      ],
    };
  });

  readonly adekComplianceCard = computed((): MetricCard | null => {
    const data = this.enhancedDashboardData()?.adekCompliance;
    if (!data) return null;

    return {
      title: 'ADEK Compliance Status',
      icon: '✅',
      iconColor: 'blue',
      mainValue: data.totalEvidenceItems,
      subtitle: 'Total Evidence Items Collected',
      details: [
        { label: 'Student Portfolios', value: `${data.portfolioCompletionPercentage.toFixed(0)}% complete` },
        { label: 'Teacher CPD Documentation', value: `${data.cpdDocumentationPercentage.toFixed(0)}% complete` },
        { label: 'Pending Review', value: `${data.pendingReviewCount} items ${data.pendingReviewCount === 0 ? '🎯' : ''}` },
        { label: 'Next Deadline', value: `${new Date(data.nextDeadline).toLocaleDateString()} (${data.daysUntilDeadline} days)` },
      ],
    };
  });

  readonly platformEngagementCard = computed((): MetricCard | null => {
    const data = this.enhancedDashboardData()?.platformEngagement;
    if (!data) return null;

    const trendIcon = data.weeklyTrendPercentage > 0 ? '↗️' : data.weeklyTrendPercentage < 0 ? '↘️' : '→';
    const trendSign = data.weeklyTrendPercentage > 0 ? '+' : '';

    return {
      title: 'Platform Engagement Analytics',
      icon: '📊',
      iconColor: 'green',
      mainValue: data.dailyActiveUsers,
      subtitle: `Daily Active Users (${data.engagementPercentage.toFixed(0)}% of total)`,
      details: [
        { label: 'Peak Usage Time', value: data.peakUsageTime },
        { label: 'Most Accessed Resource', value: `${data.mostAccessedResource} 📚` },
        { label: 'Feature Adoption', value: `OneNote: ${data.oneNoteAdoptionRate.toFixed(0)}% | Badges: ${data.badgeAdoptionRate.toFixed(0)}%` },
        { label: 'Trend', value: `${trendIcon} ${trendSign}${data.weeklyTrendPercentage.toFixed(0)}% Week-over-Week` },
      ],
    };
  });

  readonly aiInsights = computed((): AIInsightDto[] => {
    return this.enhancedDashboardData()?.aiInsights ?? [];
  });

  // ============================================
  // STATS CARDS
  // ============================================

  getStatsCards(): StatsCard[] {
    const data = this.dashboardData();
    if (!data) return [];

    return [
      {
        title: 'Total Users',
        value: data.TotalStudents + data.TotalTeachers,
        breakdown: `${data.TotalTeachers} Teachers • ${data.TotalStudents} Students`,
        icon: '👥',
        trend: 'neutral',
      },
      {
        title: 'Badges Earned',
        value: data.TotalBadgesEarned,
        breakdown: `${data.TotalBadgesEarned} Total Badges`,
        comparison: '↑ 12 from last week',
        icon: '🏆',
        trend: 'up',
      },
      {
        title: 'Active This Week',
        value: data.ActiveUsersThisWeek,
        breakdown: 'Logins, Submissions, Completions',
        icon: '📊',
        trend: 'up',
      },
      {
        title: 'Missions Completed',
        value: data.TotalMissionsCompleted,
        breakdown: 'Total missions completed',
        icon: '🎯',
        trend: 'up',
      },
    ];
  }

  // ============================================
  // MOCK DATA (Fallback)
  // ============================================

  private getMockDashboardData(): AdminDashboardDto {
    return {
      TotalStudents: 816,
      TotalTeachers: 40,
      TotalBadgesEarned: 245,
      TotalMissionsCompleted: 189,
      ActiveUsersThisWeek: 1250,
      PortfolioFilesUploaded: 567,
      RecentActivities: [
        {
          UserId: 1,
          UserName: 'Ahmed Hassan',
          Action: 'submitted badge',
          Type: 'Badge',
          CreatedAt: new Date().toISOString(),
        },
        {
          UserId: 2,
          UserName: 'Fatima Ali',
          Action: 'logged in',
          Type: 'Login',
          CreatedAt: new Date().toISOString(),
        },
      ],
      TopStudents: [
        { StudentId: 1, Name: 'Ahmed Hassan', BadgesCount: 12, MissionsCompleted: 8 },
        { StudentId: 2, Name: 'Fatima Ali', BadgesCount: 10, MissionsCompleted: 7 },
      ],
    };
  }

  private getMockEnhancedDashboard(): EnhancedDashboardDto {
    return {
      studentAchievement: {
        totalStudents: 329,
        grade6Count: 165,
        grade7Count: 164,
        digitalCitizenshipProgress: 68,
        portfolioQualityScore: 7.2,
        atRiskCount: 23,
        topPerformersCount: 45,
      },
      teacherCPD: {
        totalTeachers: 40,
        activeTeachers: 12,
        cpdHoursThisMonth: 18,
        targetHoursThisMonth: 24,
        badgeCompletionRate: 76,
        resourceDownloads: 797,
        topPerformerName: 'Fatima Khan',
        topPerformerHours: 3,
      },
      adekCompliance: {
        totalEvidenceItems: 807,
        portfolioCompletionPercentage: 60,
        cpdDocumentationPercentage: 76,
        pendingReviewCount: 0,
        nextDeadline: '2025-01-15T00:00:00Z',
        daysUntilDeadline: 23,
      },
      platformEngagement: {
        dailyActiveUsers: 245,
        totalUsers: 329,
        engagementPercentage: 74,
        peakUsageTime: '10:00 AM - 11:30 AM',
        mostAccessedResource: 'DC Module 3',
        oneNoteAdoptionRate: 95,
        badgeAdoptionRate: 82,
        weeklyTrendPercentage: 12,
      },
      aiInsights: [
        {
          type: 'warning',
          icon: '⚠️',
          message: '23 students at risk of portfolio incompletion',
          count: 23,
        },
        {
          type: 'alert',
          icon: '📉',
          message: 'Teacher CPD participation down 15% this week',
        },
        {
          type: 'info',
          icon: '🏅',
          message: '5 new badges pending approval',
          count: 5,
          actionLink: '/admin/badges',
        },
        {
          type: 'info',
          icon: '📁',
          message: 'ADEK Evidence: 847 items | Report due in 12 days',
          count: 847,
        },
      ],
    };
  }
}
