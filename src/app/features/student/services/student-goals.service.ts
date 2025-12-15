import { Injectable, signal } from '@angular/core';
import { BaseHttpService } from '../../../core/services/base-http.service';
import { Student_API_ENDPOINTS } from '../../../config/StudentConfig/StudentEndpoints';
import { ApiResponse, StudentGoalDto, CreateGoalRequest } from '../models/student-api.models';

@Injectable({
  providedIn: 'root',
})
export class StudentGoalsService extends BaseHttpService {
  private goals = signal<StudentGoalDto[]>([]);
  private isLoading = signal(false);

  constructor() {
    super();
  }

  // ============================================
  // API CALLS
  // ============================================

  loadGoals(): void {
    this.isLoading.set(true);
    this.get<StudentGoalDto[]>(Student_API_ENDPOINTS.Goals.GET_ALL).subscribe({
      next: (data) => {
        this.goals.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load goals:', err);
        this.isLoading.set(false);
      },
    });
  }

  createGoal(request: CreateGoalRequest): void {
    this.isLoading.set(true);
    this.post<CreateGoalRequest, StudentGoalDto>(
      Student_API_ENDPOINTS.Goals.CREATE,
      request
    ).subscribe({
      next: (createdGoal) => {
        this.goals.update((goals) => [createdGoal, ...goals]);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to create goal:', err);
        this.isLoading.set(false);
      },
    });
  }

  updateGoalProgress(goalId: number, progress: number): void {
    this.put<{ progress: number }, void>(
      Student_API_ENDPOINTS.Goals.UPDATE_PROGRESS(goalId),
      { progress }
    ).subscribe({
      next: () => {
        // Reload goals to get updated data
        this.loadGoals();
      },
      error: (err) => {
        console.error('Failed to update goal progress:', err);
      },
    });
  }

  // ============================================
  // GETTERS
  // ============================================

  getGoals() {
    return this.goals();
  }

  getActiveGoals() {
    return this.goals().filter((g) => g.Status === 'active');
  }

  getCompletedGoals() {
    return this.goals().filter((g) => g.Status === 'completed');
  }

  isLoadingData() {
    return this.isLoading();
  }
}
