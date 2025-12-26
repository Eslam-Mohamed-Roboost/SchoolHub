import { Injectable, signal, computed } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { BaseHttpService } from '../../../core/services/base-http.service';
import { Student_API_ENDPOINTS } from '../../../config/StudentConfig/StudentEndpoints';
import {
  StudentAttendanceHistory,
  AttendanceStatistics,
  AttendanceBonusResult,
  AttendanceBonusAwardResult,
} from '../models/attendance.model';
import { ApiResponse } from '../../../core/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class StudentAttendanceService extends BaseHttpService {
  private _attendanceHistory = signal<StudentAttendanceHistory[]>([]);
  private _statistics = signal<AttendanceStatistics | null>(null);

  // Public computed signals
  attendanceHistory = computed(() => this._attendanceHistory());
  statistics = computed(() => this._statistics());

  /**
   * Get student's attendance history
   */
  getAttendanceHistory(
    startDate?: Date,
    endDate?: Date
  ): Observable<ApiResponse<StudentAttendanceHistory[]>> {
    const params: any = {};
    if (startDate) params.startDate = startDate.toISOString();
    if (endDate) params.endDate = endDate.toISOString();

    return this.get<ApiResponse<StudentAttendanceHistory[]>>(
      Student_API_ENDPOINTS.Attendance.GET_HISTORY,
      params
    ).pipe(
      tap((response) => {
        if (response.IsSuccess && response.Data) {
          this._attendanceHistory.set(response.Data);
        }
      })
    );
  }

  /**
   * Get attendance statistics
   */
  getStatistics(): Observable<ApiResponse<AttendanceStatistics>> {
    return this.get<ApiResponse<AttendanceStatistics>>(
      Student_API_ENDPOINTS.Attendance.GET_STATISTICS
    ).pipe(
      tap((response) => {
        if (response.IsSuccess && response.Data) {
          this._statistics.set(response.Data);
        }
      })
    );
  }

  /**
   * Calculate attendance bonus
   */
  calculateBonus(): Observable<ApiResponse<AttendanceBonusResult>> {
    return this.post<{}, ApiResponse<AttendanceBonusResult>>(
      Student_API_ENDPOINTS.Attendance.CALCULATE_BONUS,
      {}
    );
  }

  /**
   * Award attendance bonus
   */
  awardBonus(): Observable<ApiResponse<AttendanceBonusAwardResult>> {
    return this.post<{}, ApiResponse<AttendanceBonusAwardResult>>(
      Student_API_ENDPOINTS.Attendance.AWARD_BONUS,
      {}
    ).pipe(
      tap(() => {
        // Reload statistics after awarding bonus
        this.getStatistics().subscribe();
      })
    );
  }
}

