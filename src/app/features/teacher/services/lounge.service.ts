import { Injectable, signal, computed } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { BaseHttpService } from '../../../core/services/base-http.service';
import { Teacher_API_ENDPOINTS } from '../../../config/TeacherConfig/TeacherEndpoint';
import { TeachersLounge, Announcement } from '../models/lounge.model';
import { ApiResponse } from '../../../core/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class LoungeService extends BaseHttpService {
  private _loungeData = signal<TeachersLounge | null>(null);
  private _announcements = signal<Announcement[]>([]);

  // Public computed signals
  loungeData = computed(() => this._loungeData());
  announcements = computed(() => this._announcements());

  /**
   * Load teachers lounge data (leaderboards and stats)
   * BaseHttpService.transformResponse unwraps ApiResponse and returns Data directly
   */
  loadLoungeData(): Observable<TeachersLounge> {
    return this.get<TeachersLounge>(Teacher_API_ENDPOINTS.Lounge.GET).pipe(
      tap((data) => {
        if (data) {
          this._loungeData.set(data);
        }
      })
    );
  }

  /**
   * Get lounge data (returns signal)
   */
  getLoungeData(): Observable<TeachersLounge> {
    return this.loadLoungeData();
  }

  /**
   * Load announcements
   * BaseHttpService.transformResponse unwraps ApiResponse and returns Data directly
   */
  loadAnnouncements(limit: number = 20): Observable<Announcement[]> {
    return this.get<Announcement[]>(
      Teacher_API_ENDPOINTS.Lounge.GET_ANNOUNCEMENTS,
      { params: { limit: limit.toString() } }
    ).pipe(
      tap((data) => {
        if (data && Array.isArray(data)) {
          this._announcements.set(data);
        }
      })
    );
  }
}

