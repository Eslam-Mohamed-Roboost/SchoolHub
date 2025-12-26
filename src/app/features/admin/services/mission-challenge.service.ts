import { Injectable, signal, computed } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Mission, CreateMissionRequest, WeeklyChallenge, MissionResource, CreateMissionResourceRequest, UpdateMissionResourceRequest } from '../models/admin.models';
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
  Number: number;
  Title: string;
  Description?: string;
  Icon?: string;
  EstimatedMinutes: number;
  BadgeId: string | number;
  BadgeName?: string;
  Order: number;
  IsEnabled: boolean;
  CreatedAt: string;
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

interface MissionResourceDto {
  Id: string | number;
  MissionId: string | number;
  Type: string;
  Title: string;
  Url: string;
  Description?: string;
  Order: number;
  IsRequired: boolean;
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
  private missionResources = signal<Map<string, MissionResource[]>>(new Map());
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
  // RESOURCE MANAGEMENT
  // ============================================

  loadMissionResources(missionId: string): void {
    this.get<MissionResourceDto[]>(Admin_API_ENDPOINTS.Missions.GET_RESOURCES(missionId)).subscribe({
      next: (resources) => {
        if (resources) {
          this.missionResources.update((map) => {
            const newMap = new Map(map);
            newMap.set(missionId, resources.map((r) => this.mapResourceDto(r)));
            return newMap;
          });
        }
      },
      error: (err) => {
        console.error('Failed to load mission resources:', err);
      },
    });
  }

  getMissionResources(missionId: string): MissionResource[] {
    return this.missionResources().get(missionId) || [];
  }

  createResource(missionId: string, request: CreateMissionResourceRequest): Observable<{ success: boolean; message: string; resourceId?: string }> {
    return this.post<CreateMissionResourceRequest, string | number>(
      Admin_API_ENDPOINTS.Missions.CREATE_RESOURCE(missionId),
      request
    ).pipe(
      map((resourceId: string | number) => {
        this.loadMissionResources(missionId);
        return {
          success: true,
          message: 'Resource created successfully',
          resourceId: String(resourceId),
        };
      })
    );
  }

  uploadResource(missionId: string, request: { Type: string; Title: string; File: File; Description?: string; Order: number; IsRequired: boolean }): Observable<{ success: boolean; message: string; resourceId?: string }> {
    const formData = new FormData();
    formData.append('MissionId', missionId);
    formData.append('Type', request.Type);
    formData.append('Title', request.Title);
    formData.append('File', request.File);
    if (request.Description) {
      formData.append('Description', request.Description);
    }
    formData.append('Order', request.Order.toString());
    formData.append('IsRequired', request.IsRequired.toString());

    return this.postFormData<string | number>(
      Admin_API_ENDPOINTS.Missions.UPLOAD_RESOURCE(missionId),
      formData
    ).pipe(
      map((resourceId: string | number) => {
        this.loadMissionResources(missionId);
        return {
          success: true,
          message: 'Resource uploaded successfully',
          resourceId: String(resourceId),
        };
      })
    );
  }

  updateResource(resourceId: string, request: UpdateMissionResourceRequest, missionId?: string): Observable<{ success: boolean; message: string }> {
    return this.put<UpdateMissionResourceRequest, boolean>(
      Admin_API_ENDPOINTS.Missions.UPDATE_RESOURCE(resourceId),
      request
    ).pipe(
      map(() => {
        // Reload resources if missionId is provided
        if (missionId) {
          this.loadMissionResources(missionId);
        }
        return {
          success: true,
          message: 'Resource updated successfully',
        };
      })
    );
  }

  deleteResource(resourceId: string, missionId: string): Observable<{ success: boolean; message: string }> {
    return this.delete<boolean>(Admin_API_ENDPOINTS.Missions.DELETE_RESOURCE(resourceId)).pipe(
      map(() => {
        this.missionResources.update((map) => {
          const newMap = new Map(map);
          const resources = newMap.get(missionId) || [];
          newMap.set(missionId, resources.filter((r) => r.id !== resourceId));
          return newMap;
        });
        return {
          success: true,
          message: 'Resource deleted successfully',
        };
      })
    );
  }

  // ============================================
  // MAPPERS
  // ============================================

  private mapResourceDto(dto: MissionResourceDto): MissionResource {
    return {
      id: String(dto.Id),
      missionId: String(dto.MissionId),
      type: dto.Type as 'video' | 'article' | 'interactive' | 'pdf',
      title: dto.Title,
      url: dto.Url,
      description: dto.Description,
      order: dto.Order,
      isRequired: dto.IsRequired,
    };
  }

  private mapMissionDto(dto: MissionDto): Mission {
    return {
      id: String(dto.Id),
      title: dto.Title,
      description: dto.Description || '',
      icon: dto.Icon || '🎯',
      order: dto.Order,
      enabled: dto.IsEnabled,
      badgeId: dto.BadgeId ? String(dto.BadgeId) : undefined,
      duration: dto.EstimatedMinutes ? String(dto.EstimatedMinutes) : undefined,
      requirements: [],
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

