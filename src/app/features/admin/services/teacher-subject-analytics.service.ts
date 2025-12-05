import { Injectable, signal, computed } from '@angular/core';
import { Observable, map, catchError, of } from 'rxjs';
import { BaseHttpService } from '../../../core/services/base-http.service';
import { Admin_API_ENDPOINTS } from '../../../config/AdminConfig/AdminEndpoint';
import {
  TeacherSubjectMatrix,
  SubjectAnalytics,
  TeacherPerformance,
  EvidenceExportRequest,
} from '../models/admin-analytics.model';

// API Response interfaces
interface TeacherSubjectMatrixApiResponse {
  teacherId: string;
  teacherName: string;
  email: string;
  subjects: string[];
  grades: string[];
  cpdBadgesEarned: number;
  portfolioActivity: number;
  lastActive: string;
}

interface SubjectAnalyticsApiResponse {
  subject: string;
  teacherCount: number;
  studentCount: number;
  portfolioCompletionRate: number;
  cpdBadgeCompletionRate: number;
  resourceUsage: {
    totalResources: number;
    downloadsThisMonth: number;
    uploadsThisMonth: number;
    mostPopularResource: string;
  };
  topTeachers: TeacherPerformance[];
}

@Injectable({
  providedIn: 'root',
})
export class TeacherSubjectAnalyticsService extends BaseHttpService {
  private teacherMatrix = signal<TeacherSubjectMatrix[]>([]);
  private subjectAnalytics = signal<SubjectAnalytics | null>(null);
  private selectedSubject = signal<string>('All Subjects');
  private isLoading = signal(false);

  // Available subjects computed from matrix
  readonly availableSubjects = computed(() => {
    const subjects = new Set<string>();
    subjects.add('All Subjects');
    const matrix = this.teacherMatrix();
    if (matrix && Array.isArray(matrix)) {
      matrix.forEach((t) => {
        if (t && t.subjects && Array.isArray(t.subjects)) {
          t.subjects.forEach((s) => subjects.add(s));
        }
      });
    }
    return Array.from(subjects);
  });

  constructor() {
    super();
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  init(): void {
    // Always load fresh data when component initializes
    this.loadTeacherMatrix();
  }

  // ============================================
  // LOAD DATA FROM API
  // ============================================

  // ============================================
  // HELPERS
  // ============================================

  private extractData<T>(response: any): T | null {
    if (!response) return null;

    // Check if it's wrapped in ApiResponse structure
    if (typeof response === 'object') {
      // Standard ApiResponse wrapper
      if ('Data' in response && 'IsSuccess' in response) {
        if (response.IsSuccess) {
          return response.Data;
        }
        return null;
      }

      // List wrapper with Items property (common in this API)
      if ('Items' in response && Array.isArray(response.Items)) {
        return response.Items as T;
      }
    }

    // It's direct data
    return response as T;
  }

  // ============================================
  // LOAD DATA FROM API
  // ============================================

  loadTeacherMatrix(): void {
    this.isLoading.set(true);
    console.log('Loading Teacher Matrix from:', Admin_API_ENDPOINTS.TeacherSubjects.MATRIX);

    this.get<any>(`${Admin_API_ENDPOINTS.TeacherSubjects.MATRIX}?page=1&pageSize=100`).subscribe({
      next: (response) => {
        console.log('Teacher Matrix Response:', response);
        // The API might return { Items: [...] } or just [...] or { Data: { Items: [...] } }
        // Based on other endpoints, it likely returns { Items: [...] } directly for paginated lists

        let items: TeacherSubjectMatrixApiResponse[] = [];

        if (response && Array.isArray(response)) {
          items = response;
        } else if (response && Array.isArray(response.Items)) {
          items = response.Items;
        } else if (response && response.Data && Array.isArray(response.Data.Items)) {
          items = response.Data.Items;
        }

        if (items.length > 0) {
          const matrix = items.map((t) => ({
            ...t,
            lastActive: new Date(t.lastActive),
          }));
          this.teacherMatrix.set(matrix);
        } else {
          console.warn('Teacher Matrix data is empty or invalid format');
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load teacher matrix, using mock data', err);
        this.loadMockData();
        this.isLoading.set(false);
      },
    });
  }

  loadAnalyticsBySubject(subject: string): void {
    this.selectedSubject.set(subject);
    this.isLoading.set(true);

    const url =
      subject === 'All Subjects'
        ? `${Admin_API_ENDPOINTS.TeacherSubjects.ANALYTICS}?page=1&pageSize=100`
        : `${Admin_API_ENDPOINTS.TeacherSubjects.ANALYTICS}?Subject=${encodeURIComponent(
            subject
          )}&page=1&pageSize=100`;

    console.log('Loading Subject Analytics from:', url);

    this.get<any>(url).subscribe({
      next: (response) => {
        console.log('Subject Analytics Response:', response);
        const data = this.extractData<SubjectAnalyticsApiResponse>(response);

        if (data) {
          this.subjectAnalytics.set(data);
        } else {
          console.warn('Subject Analytics data is null');
          this.subjectAnalytics.set(this.getMockSubjectAnalytics(subject));
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load subject analytics, using mock', err);
        this.subjectAnalytics.set(this.getMockSubjectAnalytics(subject));
        this.isLoading.set(false);
      },
    });
  }

  // ============================================
  // GETTERS
  // ============================================

  getTeacherSubjectMatrix(): TeacherSubjectMatrix[] {
    return this.teacherMatrix();
  }

  getTeacherMatrix() {
    return this.teacherMatrix.asReadonly();
  }

  getSubjectAnalytics() {
    return this.subjectAnalytics.asReadonly();
  }

  getSubjectFilteredAnalytics(subject: string): SubjectAnalytics | null {
    if (subject !== this.selectedSubject()) {
      this.loadAnalyticsBySubject(subject);
    }
    return this.subjectAnalytics();
  }

  getSelectedSubject() {
    return this.selectedSubject.asReadonly();
  }

  getIsLoading() {
    return this.isLoading.asReadonly();
  }

  // Computed
  readonly totalTeachers = computed(() => this.teacherMatrix().length);
  readonly uniqueSubjects = computed(() => {
    const subjects = new Set<string>();
    this.teacherMatrix().forEach((t) => t.subjects.forEach((s) => subjects.add(s)));
    return Array.from(subjects);
  });

  // ============================================
  // API CALLS
  // ============================================

  fetchTeachersBySubject(subject: string): Observable<TeacherSubjectMatrix[]> {
    const url =
      subject === 'All Subjects'
        ? `${Admin_API_ENDPOINTS.TeacherSubjects.BY_SUBJECT}?page=1&pageSize=100`
        : `${Admin_API_ENDPOINTS.TeacherSubjects.BY_SUBJECT}?Subject=${encodeURIComponent(
            subject
          )}&page=1&pageSize=100`;

    return this.get<{ Items: TeacherSubjectMatrixApiResponse[] }>(url).pipe(
      map((r) =>
        r.Items.map((t) => ({
          ...t,
          lastActive: new Date(t.lastActive),
        }))
      ),
      catchError(() => of([]))
    );
  }

  exportEvidenceBySubject(request: EvidenceExportRequest): Observable<Blob> {
    return this.http.post(Admin_API_ENDPOINTS.Evidence.EXPORT, request, {
      responseType: 'blob',
    });
  }

  // ============================================
  // FILTERING (LOCAL)
  // ============================================

  getTeachersForSubject(subject: string): TeacherSubjectMatrix[] {
    if (subject === 'All Subjects') return this.teacherMatrix();
    return this.teacherMatrix().filter((t) => t.subjects.includes(subject));
  }

  getTeachersForGrade(grade: string): TeacherSubjectMatrix[] {
    return this.teacherMatrix().filter((t) => t.grades.includes(grade));
  }

  getTopTeachersByCPD(limit = 5): TeacherSubjectMatrix[] {
    return [...this.teacherMatrix()]
      .sort((a, b) => b.cpdBadgesEarned - a.cpdBadgesEarned)
      .slice(0, limit);
  }

  // ============================================
  // MOCK DATA (Fallback)
  // ============================================

  private loadMockData(): void {
    this.teacherMatrix.set([
      {
        teacherId: 't001',
        teacherName: 'Sarah Johnson',
        email: 'sarah.johnson@school.ae',
        subjects: ['English Language Arts'],
        grades: ['6', '7'],
        cpdBadgesEarned: 8,
        portfolioActivity: 45,
        lastActive: new Date(),
      },
      {
        teacherId: 't002',
        teacherName: 'Mohammed Al-Farsi',
        email: 'mohammed.alfarsi@school.ae',
        subjects: ['ICT', 'Computer Science'],
        grades: ['6', '7'],
        cpdBadgesEarned: 12,
        portfolioActivity: 67,
        lastActive: new Date(),
      },
      {
        teacherId: 't003',
        teacherName: 'Fatima Ahmed',
        email: 'fatima.ahmed@school.ae',
        subjects: ['Arabic'],
        grades: ['6'],
        cpdBadgesEarned: 5,
        portfolioActivity: 32,
        lastActive: new Date(Date.now() - 86400000),
      },
      {
        teacherId: 't004',
        teacherName: 'James Wilson',
        email: 'james.wilson@school.ae',
        subjects: ['Mathematics', 'Science'],
        grades: ['7'],
        cpdBadgesEarned: 9,
        portfolioActivity: 54,
        lastActive: new Date(),
      },
    ]);
  }

  private getMockSubjectAnalytics(subject: string): SubjectAnalytics {
    return {
      subject,
      teacherCount: subject === 'All Subjects' ? 4 : 2,
      studentCount: subject === 'All Subjects' ? 99 : 50,
      portfolioCompletionRate: 85,
      cpdBadgeCompletionRate: 53,
      resourceUsage: {
        totalResources: 45,
        downloadsThisMonth: 128,
        uploadsThisMonth: 23,
        mostPopularResource: 'Lesson Plan Template.docx',
      },
      topTeachers: [
        {
          teacherName: 'Sarah Johnson',
          subject: 'English Language Arts',
          cpdBadges: 8,
          studentEngagement: 67,
          portfolioReviews: 45,
        },
        {
          teacherName: 'Mohammed Al-Farsi',
          subject: 'ICT',
          cpdBadges: 12,
          studentEngagement: 89,
          portfolioReviews: 67,
        },
      ],
    };
  }
}
