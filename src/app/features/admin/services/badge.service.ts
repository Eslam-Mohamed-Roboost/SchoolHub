import { Injectable, signal, computed } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BadgeSubmission, Badge, BadgeStatus } from '../models/admin.models';
import { ApplicationRole } from '../../../core/enums/application-role.enum';
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

// API DTOs (matches backend)
interface BadgeDto {
  Id: number;
  Name: string;
  Description: string | null;
  Icon: string | null;
  Color: string | null;
  Category: number;
  CategoryName: string;
  TargetRole: number;
  TargetRoleName: string;
  CpdHours: number | null;
  IsActive: boolean;
  EarnedCount: number;
}

interface BadgeSubmissionDto {
  Id: number;
  UserId: number;
  UserName: string;
  UserRole: number;
  UserAvatar: string | null;
  BadgeId: number;
  BadgeName: string;
  BadgeIcon: string;
  BadgeCategory: string;
  CpdHours: number | null;
  EvidenceLink: string | null;
  SubmitterNotes: string | null;
  SubmissionDate: string;
  Status: string;
  ReviewedBy: number | null;
  ReviewDate: string | null;
  ReviewNotes: string | null;
}

interface BadgeStatisticsDto {
  Total: number;
  Approved: number;
  Rejected: number;
  Pending: number;
  ApprovalRate: number;
  RejectionRate: number;
  ByCategory: { Category: string; Count: number }[];
}

interface PaginatedResponse<T> {
  PageSize: number;
  PageIndex: number;
  Records: number;
  Pages: number;
  Items: T[];
}

@Injectable({
  providedIn: 'root',
})
export class BadgeService extends BaseHttpService {
  private submissions = signal<BadgeSubmission[]>([]);
  private badges = signal<Badge[]>([]);
  private statistics = signal<BadgeStatisticsDto | null>(null);
  private cpdCategories = signal<{ Category: string; Count: number }[]>([]);
  private isLoaded = signal(false);

  // Computed signal for badges by category
  private badgesByCategory = computed(() => {
    const cpdCategories = this.cpdCategories();
    if (cpdCategories && cpdCategories.length > 0) {
      return cpdCategories.map((c) => ({ category: c.Category, count: c.Count }));
    }

    const stats = this.statistics();
    if (stats?.ByCategory) {
      return stats.ByCategory.map((c) => ({ category: c.Category, count: c.Count }));
    }

    // Fallback to local calculation from submissions
    const submissions = this.submissions();
    const categoryMap = new Map<string, number>();

    submissions.forEach((s) => {
      categoryMap.set(s.badgeCategory, (categoryMap.get(s.badgeCategory) || 0) + 1);
    });

    return Array.from(categoryMap.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);
  });

  constructor() {
    super();
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  init(): void {
    this.loadBadges();
    this.loadSubmissions();
    this.loadStatistics();
    this.loadCpdCategories();
  }

  // ============================================
  // LOAD DATA FROM API
  // ============================================

  loadBadges(): void {
    this.get<PaginatedResponse<BadgeDto>>(
      `${Admin_API_ENDPOINTS.Badges.GET_ALL}?page=1&pageSize=100`
    ).subscribe({
      next: (response) => {
        // Response is already extracted by BaseHttpService (Data.Items)
        // response is the PaginatedResponse<BadgeDto> directly
        if (response?.Items) {
          this.badges.set(response.Items.map((b) => this.mapBadgeDto(b)));
        }
      },
      error: (err) => {
        console.error('Failed to load badges, using mock data', err);
        this.badges.set(this.generateMockBadges());
      },
    });
  }

  loadSubmissions(): void {
    this.get<ApiResponse<PaginatedResponse<BadgeSubmissionDto>>>(
      `${Admin_API_ENDPOINTS.BadgeSubmissions.GET_ALL}?pageIndex=1&pageSize=100`
    ).subscribe({
      next: (response) => {
        if (response.IsSuccess && response.Data?.Items) {
          const mappedSubmissions = response.Data.Items.map((s) => this.mapSubmissionDto(s));
          this.submissions.set(mappedSubmissions);
        }
        this.isLoaded.set(true);
      },
      error: (err) => {
        console.error('Failed to load submissions, using mock data', err);
        this.submissions.set(this.generateMockSubmissions());
        this.isLoaded.set(true);
      },
    });
  }

  loadStatistics(): void {
    this.get<ApiResponse<BadgeStatisticsDto>>(Admin_API_ENDPOINTS.BadgeStatistics).subscribe({
      next: (response) => {
        if (response.IsSuccess && response.Data) {
          this.statistics.set(response.Data);
        }
      },
      error: (err) => console.error('Failed to load badge statistics', err),
    });
  }

  loadCpdCategories(): void {
    this.get<ApiResponse<{ Category: string; Count: number }[]>>(
      Admin_API_ENDPOINTS.CPD.CATEGORIES
    ).subscribe({
      next: (response) => {
        if (response.IsSuccess && response.Data) {
          this.cpdCategories.set(response.Data);
        }
      },
      error: (err) => console.error('Failed to load CPD categories', err),
    });
  }

  // ============================================
  // GETTERS
  // ============================================

  getSubmissions() {
    return this.submissions.asReadonly();
  }

  getBadges() {
    return this.badges.asReadonly();
  }

  getStatistics() {
    return this.statistics.asReadonly();
  }

  getPendingSubmissions(): BadgeSubmission[] {
    return this.submissions().filter((s) => s.status === 'Pending');
  }

  getPendingTeacherSubmissions(): BadgeSubmission[] {
    return this.submissions().filter(
      (s) => s.status === 'Pending' && s.userRole === ApplicationRole.Teacher
    );
  }

  getPendingStudentSubmissions(): BadgeSubmission[] {
    return this.submissions().filter(
      (s) => s.status === 'Pending' && s.userRole === ApplicationRole.Student
    );
  }

  getSubmissionById(id: string): BadgeSubmission | undefined {
    return this.submissions().find((s) => s.id === id);
  }

  // ============================================
  // ACTIONS - API CALLS
  // ============================================

  createBadge(request: {
    Name: string;
    Description: string;
    Icon: string;
    Color: string;
    Category: number;
    TargetRole: number;
    CpdHours?: number;
    MissionId?: string;
  }): Observable<{ success: boolean; message: string; badgeId?: string }> {
    // The API returns: { Data: badgeId (number), IsSuccess: true, Message: "Badge created successfully" }
    // BaseHttpService.transformResponse automatically extracts response.Data when IsSuccess is true
    // So we receive the badgeId (number) directly in the next callback
    return this.post<typeof request, number>(
      Admin_API_ENDPOINTS.Badges.CREATE,
      request
    ).pipe(
      map((badgeId: number) => {
        // Reload badges to get the newly created one
        this.loadBadges();
        
        return {
          success: true,
          message: 'Badge created successfully',
          badgeId: String(badgeId),
        };
      })
    );
  }

  updateBadge(
    id: string,
    request: {
      Name: string;
      Description: string;
      Icon: string;
      Color: string;
      Category: number;
      TargetRole: number;
      CpdHours?: number;
      MissionId?: string;
      IsActive?: boolean;
    }
  ): Observable<{ success: boolean; message: string }> {
    return this.put<typeof request, number>(
      Admin_API_ENDPOINTS.Badges.UPDATE(id),
      request
    ).pipe(
      map(() => {
        // Reload badges to get the updated one
        this.loadBadges();
        
        return {
          success: true,
          message: 'Badge updated successfully',
        };
      })
    );
  }

  deleteBadge(id: string): Observable<{ success: boolean; message: string }> {
    return this.delete<number>(Admin_API_ENDPOINTS.Badges.DELETE(id)).pipe(
      map(() => {
        // Remove from local state
        this.badges.update((badges) => badges.filter((b) => b.id !== id));
        
        return {
          success: true,
          message: 'Badge deleted successfully',
        };
      })
    );
  }

  approveSubmission(id: string, reviewedBy: number, notes?: string): Observable<boolean> {
    return this.post<{ ReviewedBy: number; ReviewNotes?: string }, ApiResponse<boolean>>(
      Admin_API_ENDPOINTS.BadgeSubmissions.APPROVE(id),
      { ReviewedBy: reviewedBy, ReviewNotes: notes }
    ).pipe(
      map((response) => {
        if (response.IsSuccess) {
          // Update local state
          this.submissions.update((subs) =>
            subs.map((s) =>
              s.id === id
                ? {
                    ...s,
                    status: 'Approved' as BadgeStatus,
                    reviewedBy: String(reviewedBy),
                    reviewNotes: notes,
                  }
                : s
            )
          );
        }
        return response.IsSuccess;
      })
    );
  }

  rejectSubmission(id: string, reviewedBy: number, notes: string): Observable<boolean> {
    return this.post<{ ReviewedBy: number; ReviewNotes: string }, ApiResponse<boolean>>(
      Admin_API_ENDPOINTS.BadgeSubmissions.REJECT(id),
      { ReviewedBy: reviewedBy, ReviewNotes: notes }
    ).pipe(
      map((response) => {
        if (response.IsSuccess) {
          // Update local state
          this.submissions.update((subs) =>
            subs.map((s) =>
              s.id === id
                ? {
                    ...s,
                    status: 'Rejected' as BadgeStatus,
                    reviewedBy: String(reviewedBy),
                    reviewNotes: notes,
                  }
                : s
            )
          );
        }
        return response.IsSuccess;
      })
    );
  }

  // ============================================
  // STATISTICS
  // ============================================

  getBadgeStatistics(): {
    total: number;
    approved: number;
    rejected: number;
    pending: number;
    approvalRate: number;
    rejectionRate: number;
  } {
    const stats = this.statistics();
    if (stats) {
      return {
        total: stats.Total,
        approved: stats.Approved,
        rejected: stats.Rejected,
        pending: stats.Pending,
        approvalRate: stats.ApprovalRate,
        rejectionRate: stats.RejectionRate,
      };
    }

    // Fallback to local calculation
    const submissions = this.submissions();
    const total = submissions.length;
    const approved = submissions.filter((s) => s.status === 'Approved').length;
    const rejected = submissions.filter((s) => s.status === 'Rejected').length;
    const pending = submissions.filter((s) => s.status === 'Pending').length;

    return {
      total,
      approved,
      rejected,
      pending,
      approvalRate: total > 0 ? Math.round((approved / total) * 100) : 0,
      rejectionRate: total > 0 ? Math.round((rejected / total) * 100) : 0,
    };
  }

  getBadgesByCategory() {
    return this.badgesByCategory;
  }

  // ============================================
  // MAPPERS
  // ============================================

  private mapBadgeDto(dto: BadgeDto): Badge {
    return {
      id: String(dto.Id),
      name: dto.Name,
      category: dto.CategoryName,
      categoryId: dto.Category,
      icon: dto.Icon ?? '🏆',
      color: dto.Color ?? '#FFD700',
      cpdHours: dto.CpdHours ?? undefined,
      description: dto.Description ?? '',
      targetRole: dto.TargetRole,
      targetRoleName: dto.TargetRoleName,
      isActive: dto.IsActive,
      earnedCount: dto.EarnedCount,
    };
  }

  private mapSubmissionDto(dto: BadgeSubmissionDto): BadgeSubmission {
    return {
      id: String(dto.Id),
      userId: String(dto.UserId),
      userName: dto.UserName,
      userRole: dto.UserRole as ApplicationRole,
      userAvatar: dto.UserAvatar ?? undefined,
      badgeId: String(dto.BadgeId),
      badgeName: dto.BadgeName,
      badgeIcon: dto.BadgeIcon,
      badgeCategory: dto.BadgeCategory,
      cpdHours: dto.CpdHours ?? undefined,
      evidenceLink: dto.EvidenceLink ?? '',
      submitterNotes: dto.SubmitterNotes ?? undefined,
      submissionDate: new Date(dto.SubmissionDate),
      status: dto.Status as BadgeStatus,
      reviewedBy: dto.ReviewedBy ? String(dto.ReviewedBy) : undefined,
      reviewDate: dto.ReviewDate ? new Date(dto.ReviewDate) : undefined,
      reviewNotes: dto.ReviewNotes ?? undefined,
    };
  }

  // ============================================
  // MOCK DATA (Fallback)
  // ============================================

  private generateMockBadges(): Badge[] {
    return [
    
    ];
  }

  private generateMockSubmissions(): BadgeSubmission[] {
    const submissions: BadgeSubmission[] = [];
    const badges = this.generateMockBadges();
    const statuses: BadgeStatus[] = ['Pending', 'Approved', 'Rejected'];

    for (let i = 1; i <= 10; i++) {
      const badge = badges[Math.floor(Math.random() * badges.length)];
      const isTeacher = i <= 7;
      const status = i <= 3 ? 'Pending' : statuses[Math.floor(Math.random() * statuses.length)];

      submissions.push({
        id: `submission-${i}`,
        userId: isTeacher ? `teacher-${i}` : `student-${i}`,
        userName: isTeacher ? `Teacher ${i}` : `Student ${i}`,
        userRole: isTeacher ? ApplicationRole.Teacher : ApplicationRole.Student,
        badgeId: badge.id,
        badgeName: badge.name,
        badgeIcon: badge.icon,
        badgeCategory: badge.category,
        cpdHours: isTeacher ? badge.cpdHours : undefined,
        evidenceLink: `https://example.com/evidence/${i}`,
        submissionDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        status,
        reviewedBy: status !== 'Pending' ? '1' : undefined,
        reviewDate: status !== 'Pending' ? new Date() : undefined,
      });
    }

    return submissions.sort((a, b) => b.submissionDate.getTime() - a.submissionDate.getTime());
  }
}
