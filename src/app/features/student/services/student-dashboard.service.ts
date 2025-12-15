import { Injectable, signal, computed } from '@angular/core';
import { BaseHttpService } from '../../../core/services/base-http.service';
import { Student_API_ENDPOINTS } from '../../../config/StudentConfig/StudentEndpoints';
import { ApiResponse, StudentDashboardDto, NotificationDto } from '../models/student-api.models';

@Injectable({
  providedIn: 'root',
})
export class StudentDashboardService extends BaseHttpService {
  private dashboardData = signal<StudentDashboardDto | null>(null);
  private notifications = signal<NotificationDto[]>([]);
  private isLoading = signal(false);

  // Computed signals
  readonly unreadCount = computed(() => this.notifications().filter((n) => !n.Read).length);

  constructor() {
    super();
  }

  // ============================================
  // API CALLS
  // ============================================

  loadDashboard(): void {
    this.isLoading.set(true);
    this.get<StudentDashboardDto>(Student_API_ENDPOINTS.Dashboard.GET).subscribe({
      next: (data) => {
        this.dashboardData.set(data);
        this.notifications.set(data.Notifications || []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load dashboard:', err);
        this.isLoading.set(false);
      },
    });
  }

  loadNotifications(unreadOnly: boolean = false): void {
    const endpoint = unreadOnly
      ? `${Student_API_ENDPOINTS.Notifications.GET_ALL}?unreadOnly=true`
      : Student_API_ENDPOINTS.Notifications.GET_ALL;

    this.get<NotificationDto[]>(endpoint).subscribe({
      next: (data) => {
        this.notifications.set(data);
      },
      error: (err) => {
        console.error('Failed to load notifications:', err);
      },
    });
  }

  markNotificationRead(notificationId: number): void {
    this.put<null, void>(Student_API_ENDPOINTS.Notifications.MARK_READ(notificationId), null).subscribe(
      {
        next: () => {
          this.notifications.update((notifications) =>
            notifications.map((n) => (n.Id === notificationId ? { ...n, Read: true } : n))
          );
        },
        error: (err) => {
          console.error('Failed to mark notification as read:', err);
        },
      }
    );
  }

  // ============================================
  // GETTERS
  // ============================================

  getDashboardData() {
    return this.dashboardData();
  }

  getNotifications() {
    return this.notifications();
  }

  isLoadingData() {
    return this.isLoading();
  }
}
