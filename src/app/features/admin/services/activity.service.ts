import { Injectable, signal } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ActivityLog, ActivityType } from '../models/admin.models';
import { BaseHttpService } from '../../../core/services/base-http.service';
import { Admin_API_ENDPOINTS } from '../../../config/AdminConfig/AdminEndpoint';

// API Response wrapper
interface ApiResponse<T> {
  Data: T;
  IsSuccess: boolean;
  Message: string;
  ErrorCode: string;
  IsAuthorized: boolean;
}

// API Response interfaces (matches backend ActivityLogDto)
interface ActivityLogDto {
  Id: number;
  UserId: number;
  UserName: string;
  Action: string;
  Type: string;
  Details: string | null;
  IpAddress: string | null;
  CreatedAt: string;
}

interface PaginatedResponse<T> {
  PageSize: number;
  PageIndex: number;
  Records: number;
  Pages: number;
  Items: T[];
}

interface CountResponse {
  count: number;
}

@Injectable({
  providedIn: 'root',
})
export class ActivityService extends BaseHttpService {
  private recentActivities = signal<ActivityLog[]>([]);
  private todayCount = signal<number>(0);
  private weekCount = signal<number>(0);

  constructor() {
    super();
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  init(): void {
    this.loadRecentActivities();
    this.loadActivityCounts();
  }

  // ============================================
  // LOAD DATA FROM API
  // ============================================

  loadRecentActivities(limit: number = 10): void {
    this.get<ApiResponse<PaginatedResponse<ActivityLogDto>>>(
      `${Admin_API_ENDPOINTS.ActivityLogs.GET_ALL}?page=1&pageSize=${limit}`
    ).subscribe({
      next: (response) => {
        if (response.IsSuccess && response.Data?.Items) {
          const activities = response.Data.Items.map((a) => this.mapActivityDto(a));
          this.recentActivities.set(activities);
        }
      },
      error: (err) => {
        console.error('Failed to load activities, using mock data', err);
        this.recentActivities.set(this.generateMockActivities());
      },
    });
  }

  loadActivityCounts(): void {
    // Today count - API might return just a number or wrapped
    this.get<ApiResponse<number> | number>(Admin_API_ENDPOINTS.ActivityLogs.TODAY_COUNT).subscribe({
      next: (response) => {
        if (typeof response === 'number') {
          this.todayCount.set(response);
        } else if (response.IsSuccess) {
          this.todayCount.set(response.Data);
        }
      },
      error: () => this.todayCount.set(125),
    });

    // Week count
    this.get<ApiResponse<number> | number>(Admin_API_ENDPOINTS.ActivityLogs.WEEK_COUNT).subscribe({
      next: (response) => {
        if (typeof response === 'number') {
          this.weekCount.set(response);
        } else if (response.IsSuccess) {
          this.weekCount.set(response.Data);
        }
      },
      error: () => this.weekCount.set(1250),
    });
  }

  // ============================================
  // GETTERS
  // ============================================

  getRecentActivities(): ActivityLog[] {
    return this.recentActivities();
  }

  getRecentActivitiesSignal() {
    return this.recentActivities.asReadonly();
  }

  getTodayActivityCount() {
    return this.todayCount.asReadonly();
  }

  getWeekActivityCount() {
    return this.weekCount.asReadonly();
  }

  // ============================================
  // API CALLS
  // ============================================

  fetchActivities(params: {
    page?: number;
    pageSize?: number;
    type?: number;
    userId?: number;
  }): Observable<PaginatedResponse<ActivityLog>> {
    const queryParams: string[] = [];
    queryParams.push(`page=${params.page ?? 1}`);
    queryParams.push(`pageSize=${params.pageSize ?? 10}`);
    if (params.type !== undefined) queryParams.push(`type=${params.type}`);
    if (params.userId) queryParams.push(`userId=${params.userId}`);

    const url = `${Admin_API_ENDPOINTS.ActivityLogs.GET_ALL}?${queryParams.join('&')}`;

    return this.get<ApiResponse<PaginatedResponse<ActivityLogDto>>>(url).pipe(
      map((response) => ({
        PageSize: response.Data.PageSize,
        PageIndex: response.Data.PageIndex,
        Records: response.Data.Records,
        Pages: response.Data.Pages,
        Items: response.Data.Items.map((a) => this.mapActivityDto(a)),
      }))
    );
  }

  // ============================================
  // FILTERING (LOCAL)
  // ============================================

  filterByType(type: ActivityType): ActivityLog[] {
    return this.recentActivities().filter((a) => a.type === type);
  }

  // ============================================
  // MAPPERS
  // ============================================

  private mapActivityDto(dto: ActivityLogDto): ActivityLog {
    return {
      id: String(dto.Id),
      timestamp: new Date(dto.CreatedAt),
      userId: String(dto.UserId),
      userName: dto.UserName,
      action: dto.Action,
      type: dto.Type as ActivityType,
      details: dto.Details ?? undefined,
    };
  }

  // ============================================
  // MOCK DATA (Fallback)
  // ============================================

  private generateMockActivities(): ActivityLog[] {
    const activities: ActivityLog[] = [];
    const actions = [
      { action: 'submitted badge', type: 'Badge' as ActivityType },
      { action: 'logged in', type: 'Login' as ActivityType },
      { action: 'uploaded evidence', type: 'Upload' as ActivityType },
      { action: 'completed mission', type: 'Completion' as ActivityType },
      { action: 'updated profile', type: 'Update' as ActivityType },
    ];

    for (let i = 0; i < 10; i++) {
      const actionType = actions[Math.floor(Math.random() * actions.length)];
      const isTeacher = Math.random() > 0.5;
      const userNum = Math.floor(Math.random() * 40) + 1;

      activities.push({
        id: `activity-${i + 1}`,
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        userId: isTeacher ? `teacher-${userNum}` : `student-${userNum}`,
        userName: isTeacher ? `Teacher ${userNum}` : `Student ${userNum}`,
        action: actionType.action,
        type: actionType.type,
        details: `${actionType.action} - ${isTeacher ? 'Teacher' : 'Student'} ${userNum}`,
      });
    }

    return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
}
