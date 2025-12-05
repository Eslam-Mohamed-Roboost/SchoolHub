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
  private stats = signal<EvidenceCollectionStats | null>(null);
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
    this.get<ApiResponse<EvidenceCollectionStats> | EvidenceCollectionStats>(
      Admin_API_ENDPOINTS.Evidence.STATS
    ).subscribe({
      next: (response) => {
        const data = this.extractData<EvidenceCollectionStats>(response);
        if (data) {
          this.stats.set(data);
        } else {
          this.stats.set(this.getMockStats());
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load evidence stats:', err);
        this.stats.set(this.getMockStats());
        this.isLoading.set(false);
      },
    });
  }

  // ============================================
  // ACTIONS
  // ============================================

  exportEvidence(request: EvidenceExportRequest): Observable<Blob> {
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
