import { Injectable, signal, computed, inject } from '@angular/core';
import { BaseHttpService } from '../../../core/services/base-http.service';
import { Student_API_ENDPOINTS } from '../../../config/StudentConfig/StudentEndpoints';
import { ToastService } from '../../../shared/services/toast.service';
import {
  ApiResponse,
  MissionDto,
  MissionDetailDto,
  UpdateMissionProgressRequest,
  MissionProgressResponse,
} from '../models/student-api.models';

@Injectable({
  providedIn: 'root',
})
export class StudentMissionsService extends BaseHttpService {
  private toastService = inject(ToastService);
  
  private missions = signal<MissionDto[]>([]);
  private currentMission = signal<MissionDetailDto | null>(null);
  private isLoading = signal(false);

  // Computed signals
  readonly completedMissions = computed(() =>
    this.missions().filter((m) => m.Status === 'completed')
  );
  readonly inProgressMissions = computed(() =>
    this.missions().filter((m) => m.Status === 'in-progress')
  );
  readonly lockedMissions = computed(() => this.missions().filter((m) => m.Status === 'locked'));

  constructor() {
    super();
  }

  // ============================================
  // API CALLS
  // ============================================

  loadAllMissions(): void {
    this.isLoading.set(true);
    this.get<MissionDto[]>(Student_API_ENDPOINTS.Missions.GET_ALL).subscribe({
      next: (data) => {
        this.missions.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load missions:', err);
        this.isLoading.set(false);
      },
    });
  }

  loadMissionDetails(missionId: string): void {
    this.isLoading.set(true);
    this.get<MissionDetailDto>(Student_API_ENDPOINTS.Missions.GET_BY_ID(missionId)).subscribe({
      next: (data) => {
        this.currentMission.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load mission details:', err);
        this.isLoading.set(false);
      },
    });
  }

  updateMissionProgress(request: UpdateMissionProgressRequest): void {
    this.isLoading.set(true);
    this.post<UpdateMissionProgressRequest, MissionProgressResponse>(
      Student_API_ENDPOINTS.Missions.UPDATE_PROGRESS(request.MissionId),
      request
    ).subscribe({
      next: (progressData) => {
        // Update missions list
        this.missions.update((missions) =>
          missions.map((m) =>
            m.Id === progressData.MissionId
              ? { ...m, Progress: progressData.NewProgress, Status: progressData.Status }
              : m
          )
        );

        // Update current mission if viewing details
        if (this.currentMission()?.Id === progressData.MissionId) {
          this.loadMissionDetails(progressData.MissionId);
        }

        // Show badge notification if earned
        if (progressData.BadgeEarned) {
          this.toastService.showBadgeEarned(progressData.BadgeEarned);
        }

        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to update mission progress:', err);
        this.isLoading.set(false);
      },
    });
  }

  // ============================================
  // GETTERS
  // ============================================

  getAllMissions() {
    return this.missions();
  }

  getCurrentMission() {
    return this.currentMission();
  }

  isLoadingData() {
    return this.isLoading();
  }
}
