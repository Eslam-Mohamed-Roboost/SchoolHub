import { Injectable, signal, computed } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { BaseHttpService } from '../../../core/services/base-http.service';
import { Teacher_API_ENDPOINTS } from '../../../config/TeacherConfig/TeacherEndpoint';
import {
  TeacherMission,
  TeacherMissionDetail,
  TeacherMissionsProgressSummary,
  UpdateTeacherMissionProgressRequest,
  TeacherMissionProgressResponse,
  TeacherMissionProgress,
} from '../models/mission.model';
import { ApiResponse } from '../../../core/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class MissionService extends BaseHttpService {
  private _missions = signal<TeacherMission[]>([]);
  private _currentMission = signal<TeacherMissionDetail | null>(null);
  private _progressSummary = signal<TeacherMissionsProgressSummary | null>(null);

  // Public computed signals
  missions = computed(() => this._missions());
  currentMission = computed(() => this._currentMission());
  progressSummary = computed(() => this._progressSummary());

  /**
   * Load all available teacher missions
   */
  loadMissions(): Observable<ApiResponse<TeacherMission[]>> {
    return this.get<ApiResponse<TeacherMission[]>>(Teacher_API_ENDPOINTS.Missions.GET_ALL).pipe(
      tap((response) => {
        if (response.IsSuccess && response.Data) {
          this._missions.set(response.Data);
        }
      })
    );
  }

  /**
   * Get missions list (returns signal)
   */
  getMissions(): Observable<ApiResponse<TeacherMission[]>> {
    return this.loadMissions();
  }

  /**
   * Get mission details by ID
   */
  getMissionDetail(missionId: string): Observable<ApiResponse<TeacherMissionDetail>> {
    return this.get<ApiResponse<TeacherMissionDetail>>(
      Teacher_API_ENDPOINTS.Missions.GET_DETAIL(missionId)
    ).pipe(
      tap((response) => {
        if (response.IsSuccess && response.Data) {
          this._currentMission.set(response.Data);
        }
      })
    );
  }

  /**
   * Get teacher's mission progress summary
   */
  getProgressSummary(): Observable<ApiResponse<TeacherMissionsProgressSummary>> {
    return this.get<ApiResponse<TeacherMissionsProgressSummary>>(
      Teacher_API_ENDPOINTS.Missions.GET_PROGRESS
    ).pipe(
      tap((response) => {
        if (response.IsSuccess && response.Data) {
          this._progressSummary.set(response.Data);
        }
      })
    );
  }

  /**
   * Start a mission
   */
  startMission(missionId: string): Observable<ApiResponse<TeacherMissionProgress>> {
    return this.post<{}, ApiResponse<TeacherMissionProgress>>(
      Teacher_API_ENDPOINTS.Missions.START(missionId),
      {}
    ).pipe(
      tap(() => {
        // Reload progress summary after starting
        this.getProgressSummary().subscribe();
      })
    );
  }

  /**
   * Update mission progress (mark activity as completed)
   */
  updateProgress(
    missionId: string,
    request: UpdateTeacherMissionProgressRequest
  ): Observable<ApiResponse<TeacherMissionProgressResponse>> {
    return this.post<UpdateTeacherMissionProgressRequest, ApiResponse<TeacherMissionProgressResponse>>(
      Teacher_API_ENDPOINTS.Missions.UPDATE_PROGRESS(missionId),
      request
    ).pipe(
      tap(() => {
        // Reload mission detail and progress summary
        this.getMissionDetail(missionId).subscribe();
        this.getProgressSummary().subscribe();
      })
    );
  }
}

