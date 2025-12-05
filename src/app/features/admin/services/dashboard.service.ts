import { Injectable, signal, computed } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseHttpService } from '../../../core/services/base-http.service';
import { Admin_API_ENDPOINTS } from '../../../config/AdminConfig/AdminEndpoint';
import { environment } from '../../../config/environment';

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
  private isLoading = signal(true);

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

  // ============================================
  // LOAD DATA FROM API
  // ============================================

  loadDashboardData(): void {
    this.isLoading.set(true);

    console.log('Loading Dashboard data from:', Admin_API_ENDPOINTS.Dashboard);

    this.get<ApiResponse<AdminDashboardDto> | AdminDashboardDto>(
      Admin_API_ENDPOINTS.Dashboard
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

  // ============================================
  // GETTERS
  // ============================================

  getDashboardData() {
    return this.dashboardData.asReadonly();
  }

  getIsLoading() {
    return this.isLoading.asReadonly();
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
}
