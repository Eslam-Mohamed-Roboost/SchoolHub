import { Injectable, signal, computed } from '@angular/core';
import { Observable, map, catchError, of } from 'rxjs';
import { BaseHttpService } from '../../../core/services/base-http.service';
import { Admin_API_ENDPOINTS } from '../../../config/AdminConfig/AdminEndpoint';
import {
  PortfolioCompletionStats,
  ClassPortfolioStats,
  SubjectPortfolioStats,
  PortfolioUpdate,
  EvidenceCollectionStats,
} from '../models/admin-analytics.model';

// API Response interfaces
interface PortfolioCompletionApiResponse {
  TotalStudents: number;
  ActivePortfolios: number;
  CompletionRate: number;
  ByClass: ClassPortfolioStats[];
  BySubject: SubjectPortfolioStats[];
  RecentUpdates: PortfolioUpdateApiResponse[];
}

interface PortfolioUpdateApiResponse {
  studentId: string;
  studentName: string;
  className: string;
  subject: string;
  updateType: 'upload' | 'reflection' | 'feedback';
  timestamp: string;
  itemCount: number;
}

@Injectable({
  providedIn: 'root',
})
export class AdminPortfolioAnalyticsService extends BaseHttpService {
  private completionStats = signal<PortfolioCompletionStats | null>(null);
  private evidenceStats = signal<EvidenceCollectionStats | null>(null);
  private isLoading = signal(false);

  constructor() {
    super();
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  init(): void {
    // Always load fresh data when component initializes
    this.loadCompletionStats();
    this.loadEvidenceStats();
  }

  // ============================================
  // LOAD DATA FROM API
  // ============================================

  loadCompletionStats(): void {
    this.isLoading.set(true);

    this.get<PortfolioCompletionApiResponse>(
      `${Admin_API_ENDPOINTS.Portfolio.COMPLETION_STATS}?page=1&pageSize=100`
    ).subscribe({
      next: (response) => {
        this.completionStats.set({
          TotalStudents: response.TotalStudents,
          ActivePortfolios: response.ActivePortfolios,
          CompletionRate: response.CompletionRate,
          ByClass: response.ByClass || [],
          BySubject: response.BySubject || [],
          RecentUpdates: (response.RecentUpdates || []).map(
            (u) =>
              ({
                StudentId: u.studentId,
                StudentName: u.studentName,
                ClassName: u.className,
                Subject: u.subject,
                UpdateType: u.updateType,
                Timestamp: new Date(u.timestamp),
                ItemCount: u.itemCount,
              } as PortfolioUpdate)
          ),
        });
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load portfolio stats, using mock data', err);
        this.loadMockData();
        this.isLoading.set(false);
      },
    });
  }

  loadEvidenceStats(): void {
    this.get<EvidenceCollectionStats>(
      `${Admin_API_ENDPOINTS.Evidence.STATS}?page=1&pageSize=100`
    ).subscribe({
      next: (response) => {
        this.evidenceStats.set(response);
      },
      error: () => {
        this.evidenceStats.set(this.getMockEvidenceStats());
      },
    });
  }

  // ============================================
  // GETTERS
  // ============================================

  getPortfolioCompletionStats(): PortfolioCompletionStats | null {
    return this.completionStats();
  }

  getEvidenceCollectionStats(): EvidenceCollectionStats | null {
    return this.evidenceStats();
  }

  getCompletionStats() {
    return this.completionStats.asReadonly();
  }

  getClassesList(): ClassPortfolioStats[] {
    return this.completionStats()?.ByClass ?? [];
  }

  getSubjectsList(): SubjectPortfolioStats[] {
    return this.completionStats()?.BySubject ?? [];
  }

  getRecentUpdates(): PortfolioUpdate[] {
    return this.completionStats()?.RecentUpdates ?? [];
  }

  getIsLoading() {
    return this.isLoading.asReadonly();
  }

  // Computed
  readonly totalStudents = computed(() => this.completionStats()?.TotalStudents ?? 0);
  readonly activePortfolios = computed(() => this.completionStats()?.ActivePortfolios ?? 0);
  readonly completionRate = computed(() => this.completionStats()?.CompletionRate ?? 0);

  // ============================================
  // API CALLS
  // ============================================

  fetchStatsByClass(className?: string): Observable<ClassPortfolioStats[]> {
    const url = className
      ? `${Admin_API_ENDPOINTS.Portfolio.STATS_BY_CLASS}?ClassName=${encodeURIComponent(
          className
        )}&page=1&pageSize=100`
      : `${Admin_API_ENDPOINTS.Portfolio.STATS_BY_CLASS}?page=1&pageSize=100`;

    return this.get<{ Items: ClassPortfolioStats[] }>(url).pipe(
      map((r) => r.Items),
      catchError(() => of([]))
    );
  }

  fetchStatsBySubject(subjectName?: string): Observable<SubjectPortfolioStats[]> {
    const url = subjectName
      ? `${Admin_API_ENDPOINTS.Portfolio.STATS_BY_SUBJECT}?SubjectName=${encodeURIComponent(
          subjectName
        )}&page=1&pageSize=100`
      : `${Admin_API_ENDPOINTS.Portfolio.STATS_BY_SUBJECT}?page=1&pageSize=100`;

    return this.get<{ Items: SubjectPortfolioStats[] }>(url).pipe(
      map((r) => r.Items),
      catchError(() => of([]))
    );
  }

  fetchRecentUpdates(limit = 5): Observable<PortfolioUpdate[]> {
    return this.get<{ Items: PortfolioUpdateApiResponse[] }>(
      `${Admin_API_ENDPOINTS.Portfolio.RECENT_UPDATES}?Limit=${limit}&page=1&pageSize=${limit}`
    ).pipe(
      map((r) =>
        r.Items.map((u) => ({
          StudentId: u.studentId,
          StudentName: u.studentName,
          ClassName: u.className,
          Subject: u.subject,
          UpdateType: u.updateType,
          Timestamp: new Date(u.timestamp),
          ItemCount: u.itemCount,
        }))
      ),
      catchError(() => of([]))
    );
  }

  // ============================================
  // FILTERING (LOCAL)
  // ============================================

  getClassesByGrade(grade: number): ClassPortfolioStats[] {
    return this.getClassesList().filter((c) => c.Grade === grade);
  }

  getTopPerformingClasses(limit = 5): ClassPortfolioStats[] {
    return [...this.getClassesList()]
      .sort((a, b) => b.CompletionRate - a.CompletionRate)
      .slice(0, limit);
  }

  // ============================================
  // MOCK DATA (Fallback)
  // ============================================

  private loadMockData(): void {
    const mockByClass: ClassPortfolioStats[] = [
      {
        ClassName: 'Grade 6A',
        Grade: 6,
        TotalStudents: 25,
        ActivePortfolios: 20,
        CompletionRate: 80,
      },
      {
        ClassName: 'Grade 6B',
        Grade: 6,
        TotalStudents: 25,
        ActivePortfolios: 15,
        CompletionRate: 60,
      },
      {
        ClassName: 'Grade 6C',
        Grade: 6,
        TotalStudents: 24,
        ActivePortfolios: 23,
        CompletionRate: 96,
      },
      {
        ClassName: 'Grade 7A',
        Grade: 7,
        TotalStudents: 25,
        ActivePortfolios: 20,
        CompletionRate: 80,
      },
    ];

    const mockBySubject: SubjectPortfolioStats[] = [
      {
        SubjectName: 'English Language Arts',
        TotalSubmissions: 156,
        ActiveStudents: 78,
        RecentActivity: 23,
      },
      { SubjectName: 'ICT', TotalSubmissions: 142, ActiveStudents: 71, RecentActivity: 19 },
      { SubjectName: 'Arabic', TotalSubmissions: 98, ActiveStudents: 56, RecentActivity: 12 },
      { SubjectName: 'Mathematics', TotalSubmissions: 87, ActiveStudents: 45, RecentActivity: 8 },
    ];

    const mockRecentUpdates: PortfolioUpdate[] = [
      {
        StudentId: 's001',
        StudentName: 'Ahmed Hassan',
        ClassName: 'Grade 7A',
        Subject: 'English Language Arts',
        UpdateType: 'upload',
        Timestamp: new Date(),
        ItemCount: 3,
      },
      {
        StudentId: 's002',
        StudentName: 'Fatima Al-Zahra',
        ClassName: 'Grade 6A',
        Subject: 'ICT',
        UpdateType: 'reflection',
        Timestamp: new Date(Date.now() - 3600000),
        ItemCount: 1,
      },
    ];

    this.completionStats.set({
      TotalStudents: 99,
      ActivePortfolios: 78,
      CompletionRate: 79,
      ByClass: mockByClass,
      BySubject: mockBySubject,
      RecentUpdates: mockRecentUpdates,
    });
  }

  private getMockEvidenceStats(): EvidenceCollectionStats {
    return {
      totalEvidenceItems: 1111,
      thisMonth: 150,
      byType: { portfolios: 866, cpd: 89, badges: 156 },
      pendingReview: 12,
    };
  }
}
