import { Injectable, signal } from '@angular/core';
import { BaseHttpService } from '../../../core/services/base-http.service';
import { Student_API_ENDPOINTS } from '../../../config/StudentConfig/StudentEndpoints';
import { ApiResponse, StudentProgressDto } from '../models/student-api.models';

@Injectable({
  providedIn: 'root',
})
export class StudentProgressService extends BaseHttpService {
  private progressData = signal<StudentProgressDto | null>(null);
  private isLoading = signal(false);

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

  // ============================================
  // GETTERS
  // ============================================

  getProgressData() {
    return this.progressData();
  }

  isLoadingData() {
    return this.isLoading();
  }
}
