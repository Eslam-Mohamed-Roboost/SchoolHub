import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BaseHttpService } from '../../../core/services/base-http.service';
import { Admin_API_ENDPOINTS } from '../../../config/AdminConfig/AdminEndpoint';
import { EvidenceCollectionStats, EvidenceExportRequest } from '../models/admin-analytics.model';
import { ApiResponse } from '../../../core/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class EvidenceService extends BaseHttpService {
  private stats = signal<EvidenceCollectionStats | null>(this.getMockStats());
  private isLoading = signal(false);

  constructor() {
    super();
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  init(): void {
    this.loadStats();
  }

  // ============================================
  // LOAD DATA
  // ============================================

  loadStats(): void {
    this.isLoading.set(true);
    this.get<any>(Admin_API_ENDPOINTS.Evidence.STATS).subscribe({
      next: (response) => {
        const rawData = this.extractData<any>(response);
        if (rawData) {
          // Map PascalCase to camelCase
          const mappedData: EvidenceCollectionStats = {
            totalEvidenceItems: rawData.TotalEvidenceItems || rawData.totalEvidenceItems || 0,
            thisMonth: rawData.ThisMonth || rawData.thisMonth || 0,
            byType: {
              portfolios: rawData.ByType?.Portfolios || rawData.byType?.portfolios || 0,
              cpd: rawData.ByType?.CPD || rawData.byType?.cpd || 0,
              badges: rawData.ByType?.Badges || rawData.byType?.badges || 0,
            },
            pendingReview: rawData.PendingReview || rawData.pendingReview || 0,
          };
          this.stats.set(mappedData);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load evidence stats:', err);
        // Keep mock data on error
        this.isLoading.set(false);
      },
    });
  }

  // ============================================
  // ACTIONS
  // ============================================

  exportEvidence(request: EvidenceExportRequest): Observable<Blob> {
    // Try API first
    return this.http.post(Admin_API_ENDPOINTS.Evidence.EXPORT, request, {
      responseType: 'blob',
    });
  }

  // ============================================
  // GETTERS
  // ============================================

  getStats() {
    return this.stats.asReadonly();
  }

  getIsLoading() {
    return this.isLoading.asReadonly();
  }

  // ============================================
  // HELPERS
  // ============================================

  private extractData<T>(response: ApiResponse<T> | T): T | null {
    if (!response) return null;

    if (typeof response === 'object' && 'Data' in response && 'IsSuccess' in response) {
      const apiResp = response as ApiResponse<T>;
      if (apiResp.IsSuccess) {
        return apiResp.Data;
      }
      return null;
    }

    return response as T;
  }

  private getMockStats(): EvidenceCollectionStats {
    return {
      totalEvidenceItems: 1250,
      thisMonth: 145,
      byType: {
        portfolios: 850,
        cpd: 300,
        badges: 100,
      },
      pendingReview: 25,
    };
  }
}
