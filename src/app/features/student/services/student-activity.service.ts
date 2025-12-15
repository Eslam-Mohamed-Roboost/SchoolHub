import { Injectable, signal } from '@angular/core';
import { BaseHttpService } from '../../../core/services/base-http.service';
import { Student_API_ENDPOINTS } from '../../../config/StudentConfig/StudentEndpoints';
import {
  ApiResponse,
  ActivityStreakDto,
  PointsSummaryDto,
  AwardPointsRequest,
} from '../models/student-api.models';

@Injectable({
  providedIn: 'root',
})
export class StudentActivityService extends BaseHttpService {
  private streakData = signal<ActivityStreakDto | null>(null);
  private pointsData = signal<PointsSummaryDto | null>(null);
  private isLoading = signal(false);

  constructor() {
    super();
  }

  // ============================================
  // API CALLS
  // ============================================

  loadActivityStreak(): void {
    this.isLoading.set(true);
    this.get<ActivityStreakDto>(Student_API_ENDPOINTS.Activity.GET_STREAK).subscribe({
      next: (data) => {
        this.streakData.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load activity streak:', err);
        this.isLoading.set(false);
      },
    });
  }

  loadPointsSummary(): void {
    this.isLoading.set(true);
    this.get<PointsSummaryDto>(Student_API_ENDPOINTS.Points.GET_SUMMARY).subscribe({
      next: (data) => {
        this.pointsData.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load points summary:', err);
        this.isLoading.set(false);
      },
    });
  }

  awardPoints(request: AwardPointsRequest): void {
    this.post<AwardPointsRequest, void>(Student_API_ENDPOINTS.Points.AWARD, request).subscribe({
      next: () => {
        // Reload points to get updated data
        this.loadPointsSummary();
      },
      error: (err) => {
        console.error('Failed to award points:', err);
      },
    });
  }

  // ============================================
  // GETTERS
  // ============================================

  getStreakData() {
    return this.streakData();
  }

  getPointsData() {
    return this.pointsData();
  }

  isLoadingData() {
    return this.isLoading();
  }
}
