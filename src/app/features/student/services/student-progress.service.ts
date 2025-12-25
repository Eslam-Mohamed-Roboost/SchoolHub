import { Injectable, signal } from '@angular/core';
import { BaseHttpService } from '../../../core/services/base-http.service';
import { Student_API_ENDPOINTS } from '../../../config/StudentConfig/StudentEndpoints';
import { ApiResponse, StudentProgressDto } from '../models/student-api.models';
import { LearningHoursSummary } from '../models/learning-hours.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StudentProgressService extends BaseHttpService {
  private progressData = signal<StudentProgressDto | null>(null);
  private isLoading = signal(false);
  private learningHours = signal<LearningHoursSummary | null>(null);

  constructor() {
    super();
  }

  // ============================================
  // API CALLS
  // ============================================

  loadProgress(): void {
    this.isLoading.set(true);
    this.get<StudentProgressDto>(Student_API_ENDPOINTS.Progress.GET).subscribe({
      next: (data) => {
        console.log('Progress data received:', data);
        this.progressData.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load progress:', err);
        this.isLoading.set(false);
      },
    });
  }

  getLearningHours(startDate?: Date, endDate?: Date): Observable<LearningHoursSummary> {
    let url = `${Student_API_ENDPOINTS.Progress.GET}/LearningHours`;
    const params: string[] = [];
    
    if (startDate) {
      params.push(`startDate=${startDate.toISOString()}`);
    }
    if (endDate) {
      params.push(`endDate=${endDate.toISOString()}`);
    }
    
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    
    return this.get<LearningHoursSummary>(url);
  }

  loadLearningHours(): void {
    this.getLearningHours().subscribe({
      next: (data) => {
        this.learningHours.set(data);
      },
      error: (err) => {
        console.error('Failed to load learning hours:', err);
      },
    });
  }

  // ============================================
  // GETTERS
  // ============================================

  getProgressData() {
    return this.progressData();
  }

  isLoadingData() {
    return this.isLoading();
  }

  getLearningHoursSummary() {
    return this.learningHours();
  }
}
