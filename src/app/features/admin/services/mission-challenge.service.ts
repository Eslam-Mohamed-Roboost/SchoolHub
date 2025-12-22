import { Injectable, signal, computed } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Mission, CreateMissionRequest, WeeklyChallenge } from '../models/admin.models';
import { BaseHttpService } from '../../../core/services/base-http.service';
import { Admin_API_ENDPOINTS } from '../../../config/AdminConfig/AdminEndpoint';

// API Response wrapper
interface ApiResponse<T> {
  Data: T;
  IsSuccess: boolean;
  Message: string;
  ErrorCode: string;
  IsAuthorized: boolean;
}

// API DTOs (matches backend)
interface MissionDto {
  Id: string | number;
  Name: string;
  Title: string;
  Description: string;
  Icon: string;
  Order: number;
  Enabled: boolean;
  BadgeId?: string | number;
  Duration?: string;
  Requirements?: string[];
}

interface WeeklyChallengeDto {
  Id: string | number;
  WeekNumber: number;
  Title: string;
  Description: string;
  ResourceLinks: string[];
  TutorialVideo?: string;
  SubmissionFormLink?: string;
  PublishDate?: string;
  Status: string;
  AutoNotify: boolean;
}

interface PaginatedResponse<T> {
  PageSize: number;
  PageIndex: number;
  Records: number;
  Pages: number;
  Items: T[];
}

@Injectable({
  providedIn: 'root',
})
export class MissionChallengeService extends BaseHttpService {
  private missions = signal<Mission[]>([]);
  private challenges = signal<WeeklyChallenge[]>([]);
  private isLoading = signal(false);

  constructor() {
    super();
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  init(): void {
    this.loadMissions();
    this.loadChallenges();
  }

  // ============================================
  // LOAD DATA FROM API
  // ============================================

  loadMissions(): void {
    this.isLoading.set(true);
    this.get<PaginatedResponse<MissionDto>>(
      `${Admin_API_ENDPOINTS.Missions.GET_ALL}?page=1&pageSize=100`
    ).subscribe({
      next: (response) => {
        if (response?.Items) {
          this.missions.set(response.Items.map((m) => this.mapMissionDto(m)));
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load missions', err);
        this.missions.set([]);
        this.isLoading.set(false);
      },
    });
  }

  loadChallenges(): void {
    this.isLoading.set(true);
    this.get<PaginatedResponse<WeeklyChallengeDto> | WeeklyChallengeDto[]>(
      Admin_API_ENDPOINTS.WeeklyChallenges.GET_ALL
    ).subscribe({
      next: (response) => {
        let items: WeeklyChallengeDto[] = [];
        if (Array.isArray(response)) {
          items = response;
        } else if (response?.Items) {
          items = response.Items;
        }
        this.challenges.set(items.map((c) => this.mapChallengeDto(c)));
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load challenges', err);
        this.challenges.set([]);
        this.isLoading.set(false);
      },
    });
  }

  // ============================================
  // GETTERS
  // ============================================

  getMissions() {
    return this.missions.asReadonly();
  }

  getChallenges() {
    return this.challenges.asReadonly();
  }

  getIsLoading() {
    return this.isLoading.asReadonly();
  }

  // ============================================
  // MISSION CRUD OPERATIONS
  // ============================================

  createMission(request: CreateMissionRequest): Observable<{ success: boolean; message: string; missionId?: string }> {
    return this.post<CreateMissionRequest, string | number>(
      Admin_API_ENDPOINTS.Missions.CREATE,
      request
    ).pipe(
      map((missionId: string | number) => {
        this.loadMissions();
        return {
          success: true,
          message: 'Mission created successfully',
          missionId: String(missionId),
        };
      })
    );
  }

  updateMission(
    id: string,
    request: CreateMissionRequest
  ): Observable<{ success: boolean; message: string }> {
    return this.put<CreateMissionRequest, string | number>(
      Admin_API_ENDPOINTS.Missions.UPDATE(id),
      request
    ).pipe(
      map(() => {
        this.loadMissions();
        return {
          success: true,
          message: 'Mission updated successfully',
        };
      })
    );
  }

  deleteMission(id: string): Observable<{ success: boolean; message: string }> {
    return this.delete<string | number>(Admin_API_ENDPOINTS.Missions.DELETE(id)).pipe(
      map(() => {
        this.missions.update((missions) => missions.filter((m) => m.id !== id));
        return {
          success: true,
          message: 'Mission deleted successfully',
        };
      })
    );
  }

  // ============================================
  // CHALLENGE CRUD OPERATIONS
  // ============================================

  createChallenge(request: {
    WeekNumber: number;
    Title: string;
    Description: string;
    ResourceLinks: string[];
    TutorialVideo?: string;
    SubmissionFormLink?: string;
    Status: string;
    AutoNotify: boolean;
  }): Observable<{ success: boolean; message: string; challengeId?: string }> {
    return this.post<typeof request, string | number>(
      Admin_API_ENDPOINTS.WeeklyChallenges.CREATE,
      request
    ).pipe(
      map((challengeId: string | number) => {
        this.loadChallenges();
        return {
          success: true,
          message: 'Challenge created successfully',
          challengeId: String(challengeId),
        };
      })
    );
  }

  updateChallenge(
    id: string,
    request: {
      WeekNumber: number;
      Title: string;
      Description: string;
      ResourceLinks: string[];
      TutorialVideo?: string;
      SubmissionFormLink?: string;
      Status: string;
      AutoNotify: boolean;
    }
  ): Observable<{ success: boolean; message: string }> {
    return this.put<typeof request, string | number>(
      Admin_API_ENDPOINTS.WeeklyChallenges.UPDATE(id),
      request
    ).pipe(
      map(() => {
        this.loadChallenges();
        return {
          success: true,
          message: 'Challenge updated successfully',
        };
      })
    );
  }

  deleteChallenge(id: string): Observable<{ success: boolean; message: string }> {
    return this.delete<string | number>(Admin_API_ENDPOINTS.WeeklyChallenges.DELETE(id)).pipe(
      map(() => {
        this.challenges.update((challenges) => challenges.filter((c) => c.id !== id));
        return {
          success: true,
          message: 'Challenge deleted successfully',
        };
      })
    );
  }

  publishChallenge(id: string): Observable<{ success: boolean; message: string }> {
    return this.post<{}, string | number>(
      Admin_API_ENDPOINTS.WeeklyChallenges.PUBLISH(id),
      {}
    ).pipe(
      map(() => {
        this.loadChallenges();
        return {
          success: true,
          message: 'Challenge published successfully',
        };
      })
    );
  }

  // ============================================
  // MAPPERS
  // ============================================

  private mapMissionDto(dto: MissionDto): Mission {
    return {
      id: String(dto.Id),
      name: dto.Name,
      title: dto.Title,
      description: dto.Description || '',
      icon: dto.Icon || '🎯',
      order: dto.Order,
      enabled: dto.Enabled,
      badgeId: dto.BadgeId ? String(dto.BadgeId) : undefined,
      duration: dto.Duration,
      requirements: dto.Requirements,
    };
  }

  private mapChallengeDto(dto: WeeklyChallengeDto): WeeklyChallenge {
    return {
      id: String(dto.Id),
      weekNumber: dto.WeekNumber,
      title: dto.Title,
      description: dto.Description,
      resourceLinks: dto.ResourceLinks || [],
      tutorialVideo: dto.TutorialVideo,
      submissionFormLink: dto.SubmissionFormLink,
      publishDate: dto.PublishDate ? new Date(dto.PublishDate) : undefined,
      status: dto.Status as 'Draft' | 'Published' | 'Scheduled',
      autoNotify: dto.AutoNotify,
    };
  }
}

