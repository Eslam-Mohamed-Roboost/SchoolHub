import { Injectable, signal } from '@angular/core';
import { BaseHttpService } from '../../../core/services/base-http.service';
import { CPDProgress, TeacherStats } from '../models/cpd.model';

interface TeacherDashboardDto {
  CpdProgress: {
    HoursCompleted: number;
    TargetHours: number;
    CompletedModules: number;
    TotalModules: number;
    LastActivityDate: string;
    Streak: number;
  };
  Stats: {
    CpdHours: number;
    BadgesEarned: number;
    ActiveStudents: number;
    CurrentStreak: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class TeacherDashboardService extends BaseHttpService {
  private cpdProgress = signal<CPDProgress | null>(null);
  private stats = signal<TeacherStats | null>(null);
  private isLoading = signal(false);

  constructor() {
    super();
  }

  loadDashboard(): void {
    this.isLoading.set(true);
    this.get<TeacherDashboardDto>('/Teacher/Dashboard').subscribe({
      next: (data) => {
        const cpd: CPDProgress = {
          hoursCompleted: data.CpdProgress.HoursCompleted,
          targetHours: data.CpdProgress.TargetHours,
          completedModules: data.CpdProgress.CompletedModules,
          totalModules: data.CpdProgress.TotalModules,
          lastActivityDate: new Date(data.CpdProgress.LastActivityDate),
          streak: data.CpdProgress.Streak,
        };

        const stats: TeacherStats = {
          cpdHours: data.Stats.CpdHours,
          badgesEarned: data.Stats.BadgesEarned,
          activeStudents: data.Stats.ActiveStudents,
          currentStreak: data.Stats.CurrentStreak,
        };

        this.cpdProgress.set(cpd);
        this.stats.set(stats);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load teacher dashboard:', err);
        this.isLoading.set(false);
      },
    });
  }

  getCpdProgress(): CPDProgress | null {
    return this.cpdProgress();
  }

  getStats(): TeacherStats | null {
    return this.stats();
  }

  isLoadingData(): boolean {
    return this.isLoading();
  }
}


