import { Injectable, signal, computed } from '@angular/core';
import { BaseHttpService } from '../../../core/services/base-http.service';
import { Student_API_ENDPOINTS } from '../../../config/StudentConfig/StudentEndpoints';
import {
  ApiResponse,
  StudentBadgesSummaryDto,
  AwardBadgeRequest,
} from '../models/student-api.models';

@Injectable({
  providedIn: 'root',
})
export class StudentBadgesService extends BaseHttpService {
  private badgesSummary = signal<StudentBadgesSummaryDto | null>(null);
  private isLoading = signal(false);

  // Computed signals
  readonly earnedBadges = computed(
    () => this.badgesSummary()?.Badges.filter((b) => b.Earned) || []
  );
  readonly lockedBadges = computed(
    () => this.badgesSummary()?.Badges.filter((b) => !b.Earned) || []
  );
  readonly portfolioBadges = computed(() => this.badgesSummary()?.PortfolioBadges || []);
  readonly earnedPortfolioBadges = computed(
    () => this.badgesSummary()?.PortfolioBadges.filter((b) => b.EarnedDate) || []
  );

  constructor() {
    super();
  }

  // ============================================
  // API CALLS
  // ============================================

  loadBadges(): void {
    this.isLoading.set(true);
    this.get<StudentBadgesSummaryDto>(Student_API_ENDPOINTS.Badges.GET_ALL).subscribe({
      next: (data) => {
        this.badgesSummary.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load badges:', err);
        this.isLoading.set(false);
      },
    });
  }

  awardBadge(request: AwardBadgeRequest): void {
    this.post<AwardBadgeRequest, void>(Student_API_ENDPOINTS.Badges.AWARD, request).subscribe({
      next: () => {
        // Reload badges to get updated data
        this.loadBadges();
      },
      error: (err) => {
        console.error('Failed to award badge:', err);
      },
    });
  }

  // ============================================
  // GETTERS
  // ============================================

  getBadgesSummary() {
    return this.badgesSummary();
  }

  isLoadingData() {
    return this.isLoading();
  }
}
