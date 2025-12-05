import { Injectable, signal, computed } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseHttpService } from '../../../core/services/base-http.service';
import { Admin_API_ENDPOINTS } from '../../../config/AdminConfig/AdminEndpoint';

// API Response interfaces (matches backend DTOs)
interface ApiResponse<T> {
  Data: T;
  IsSuccess: boolean;
  Message: string;
}

// CPD Statistics DTO
interface CpdStatisticsDto {
  TotalTeachers: number;
  ActiveTeachers: number;
  TotalCPDHours: number;
  AverageHoursPerTeacher: number;
  TopPerformerName: string;
  TopPerformerHours: number;
}

// Teacher Progress DTO
interface TeacherProgressDto {
  TeacherId: number;
  TeacherName: string;
  Email: string;
  BadgeCount: number;
  CpdHours: number;
  LastBadgeDate: string;
  Categories: string[];
}

// CPD By Month DTO
interface CpdByMonthDto {
  Month: string;
  Year: number;
  Hours: number;
}

// CPD Category DTO
interface CpdCategoryDto {
  Category: string;
  Count: number;
  TotalHours: number;
}

// Frontend models
export interface TeacherCPD {
  id: string;
  name: string;
  email: string;
  badgeCount: number;
  cpdHours: number;
  lastBadgeDate: Date;
  categories: string[];
}

export interface CPDStats {
  totalTeachers: number;
  activeTeachers: number;
  totalCPDHours: number;
  averageHoursPerTeacher: number;
  topPerformer: string;
  topPerformerHours: number;
}

export interface CPDByMonth {
  month: string;
  hours: number;
}

export interface CPDCategory {
  category: string;
  count: number;
  totalHours: number;
}

@Injectable({
  providedIn: 'root',
})
export class CpdService extends BaseHttpService {
  private statistics = signal<CPDStats | null>(null);
  private teacherProgress = signal<TeacherCPD[]>([]);
  private cpdByMonth = signal<CPDByMonth[]>([]);
  private categories = signal<CPDCategory[]>([]);
  private isLoading = signal(false);

  constructor() {
    super();
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  init(): void {
    this.loadStatistics();
    this.loadTeacherProgress();
    this.loadCpdByMonth();
    this.loadCategories();
  }

  // ============================================
  // LOAD DATA FROM API
  // ============================================

  loadStatistics(): void {
    this.isLoading.set(true);

    this.get<ApiResponse<CpdStatisticsDto> | CpdStatisticsDto>(
      Admin_API_ENDPOINTS.CPD.STATISTICS
    ).subscribe({
      next: (response) => {
        const data = this.extractData<CpdStatisticsDto>(response);
        if (data) {
          this.statistics.set({
            totalTeachers: data.TotalTeachers,
            activeTeachers: data.ActiveTeachers,
            totalCPDHours: data.TotalCPDHours,
            averageHoursPerTeacher: data.AverageHoursPerTeacher,
            // API returns TopPerformer, map to topPerformer
            topPerformer: (data as any).TopPerformer || data.TopPerformerName || 'N/A',
            topPerformerHours: data.TopPerformerHours,
          });
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load CPD statistics:', err);
        this.statistics.set(this.getMockStatistics());
        this.isLoading.set(false);
      },
    });
  }

  loadTeacherProgress(sortBy?: string, sortDirection?: string): void {
    let url = Admin_API_ENDPOINTS.CPD.TEACHER_PROGRESS;
    const params: string[] = [];
    if (sortBy) params.push(`sortBy=${sortBy}`);
    if (sortDirection) params.push(`sortDirection=${sortDirection}`);
    if (params.length > 0) url += `?${params.join('&')}`;

    this.get<ApiResponse<TeacherProgressDto[]> | TeacherProgressDto[]>(url).subscribe({
      next: (response) => {
        const data = this.extractData<TeacherProgressDto[]>(response);
        if (data && Array.isArray(data)) {
          this.teacherProgress.set(
            data.map((t) => ({
              id: String(t.TeacherId),
              name: t.TeacherName,
              email: t.Email,
              badgeCount: t.BadgeCount,
              cpdHours: t.CpdHours,
              lastBadgeDate: t.LastBadgeDate ? new Date(t.LastBadgeDate) : new Date(0),
              categories: t.Categories || [],
            }))
          );
        }
      },
      error: (err) => {
        console.error('Failed to load teacher progress:', err);
        this.teacherProgress.set(this.getMockTeacherProgress());
      },
    });
  }

  loadCpdByMonth(): void {
    this.get<ApiResponse<CpdByMonthDto[]> | CpdByMonthDto[]>(
      Admin_API_ENDPOINTS.CPD.BY_MONTH
    ).subscribe({
      next: (response) => {
        const data = this.extractData<CpdByMonthDto[]>(response);
        if (data && Array.isArray(data)) {
          this.cpdByMonth.set(
            data.map((d) => ({
              month: `${d.Month} ${d.Year}`,
              hours: d.Hours,
            }))
          );
        }
      },
      error: (err) => {
        console.error('Failed to load CPD by month:', err);
        this.cpdByMonth.set(this.getMockCpdByMonth());
      },
    });
  }

  loadCategories(): void {
    this.get<ApiResponse<CpdCategoryDto[]> | CpdCategoryDto[]>(
      Admin_API_ENDPOINTS.CPD.CATEGORIES
    ).subscribe({
      next: (response) => {
        const data = this.extractData<CpdCategoryDto[]>(response);
        if (data && Array.isArray(data)) {
          this.categories.set(
            data.map((c) => ({
              category: c.Category,
              count: c.Count,
              totalHours: c.TotalHours,
            }))
          );
        }
      },
      error: (err) => {
        console.error('Failed to load CPD categories:', err);
        this.categories.set(this.getMockCategories());
      },
    });
  }

  // ============================================
  // GETTERS
  // ============================================

  getStatistics() {
    return this.statistics.asReadonly();
  }

  getTeacherProgress() {
    return this.teacherProgress.asReadonly();
  }

  getCpdByMonth() {
    return this.cpdByMonth.asReadonly();
  }

  getCategories() {
    return this.categories.asReadonly();
  }

  getIsLoading() {
    return this.isLoading.asReadonly();
  }

  // ============================================
  // API CALLS
  // ============================================

  exportCpdReport(format: string, dateFrom?: Date, dateTo?: Date): Observable<Blob> {
    const params: string[] = [];
    if (format) params.push(`format=${format}`);
    if (dateFrom) params.push(`dateFrom=${dateFrom.toISOString()}`);
    if (dateTo) params.push(`dateTo=${dateTo.toISOString()}`);

    const url = `${Admin_API_ENDPOINTS.CPD.EXPORT}?${params.join('&')}`;
    return this.get<Blob>(url);
  }

  // ============================================
  // HELPERS
  // ============================================

  private extractData<T>(response: ApiResponse<T> | T | { Items: T }): T | null {
    if (!response) return null;

    // Check if it's wrapped in ApiResponse structure
    if (typeof response === 'object') {
      // Standard ApiResponse wrapper
      if ('Data' in response && 'IsSuccess' in response) {
        const apiResp = response as ApiResponse<T>;
        if (apiResp.IsSuccess) {
          return apiResp.Data;
        }
        return null;
      }

      // List wrapper with Items property
      if ('Items' in response && Array.isArray((response as any).Items)) {
        return (response as any).Items as T;
      }
    }

    // It's direct data
    return response as T;
  }

  // ============================================
  // MOCK DATA (Fallback)
  // ============================================

  private getMockStatistics(): CPDStats {
    return {
      totalTeachers: 40,
      activeTeachers: 35,
      totalCPDHours: 280,
      averageHoursPerTeacher: 7,
      topPerformer: 'Sarah Johnson',
      topPerformerHours: 24,
    };
  }

  private getMockTeacherProgress(): TeacherCPD[] {
    return [
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah.j@school.ae',
        badgeCount: 8,
        cpdHours: 24,
        lastBadgeDate: new Date(),
        categories: ['AI Tools', 'Microsoft 365'],
      },
      {
        id: '2',
        name: 'Ahmed Hassan',
        email: 'ahmed.h@school.ae',
        badgeCount: 6,
        cpdHours: 18,
        lastBadgeDate: new Date(Date.now() - 86400000),
        categories: ['AI Tools', 'Digital Citizenship'],
      },
      {
        id: '3',
        name: 'Fatima Al-Zahra',
        email: 'fatima.z@school.ae',
        badgeCount: 5,
        cpdHours: 15,
        lastBadgeDate: new Date(Date.now() - 172800000),
        categories: ['Microsoft 365'],
      },
    ];
  }

  private getMockCpdByMonth(): CPDByMonth[] {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const currentMonth = new Date().getMonth();
    const result: CPDByMonth[] = [];

    for (let i = 11; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      result.push({
        month: `${months[monthIndex]} 2024`,
        hours: Math.floor(Math.random() * 40) + 10,
      });
    }

    return result;
  }

  private getMockCategories(): CPDCategory[] {
    return [
      { category: 'AI Tools', count: 45, totalHours: 90 },
      { category: 'Microsoft 365', count: 38, totalHours: 76 },
      { category: 'Digital Citizenship', count: 25, totalHours: 50 },
      { category: 'Collaboration', count: 20, totalHours: 40 },
      { category: 'Research', count: 15, totalHours: 30 },
    ];
  }
}
