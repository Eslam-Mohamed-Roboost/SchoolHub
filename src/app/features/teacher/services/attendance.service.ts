import { Injectable, signal, computed } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { BaseHttpService } from '../../../core/services/base-http.service';
import { Teacher_API_ENDPOINTS } from '../../../config/TeacherConfig/TeacherEndpoint';
import {
  ClassAttendance,
  MarkAttendanceRequest,
  BulkMarkAttendanceRequest,
  UpdateAttendanceRequest,
} from '../models/attendance.model';
import { ApiResponse } from '../../../core/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService extends BaseHttpService {
  private _classAttendance = signal<ClassAttendance | null>(null);

  // Public computed signals
  classAttendance = computed(() => this._classAttendance());

  /**
   * Get class attendance for a specific date
   */
  getClassAttendance(classId: string, date: Date): Observable<ApiResponse<ClassAttendance>> {
    const dateStr = date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    return this.get<ApiResponse<ClassAttendance>>(
      Teacher_API_ENDPOINTS.Attendance.GET_CLASS_ATTENDANCE(classId, dateStr)
    ).pipe(
      tap((response) => {
        if (response.IsSuccess && response.Data) {
          this._classAttendance.set(response.Data);
        }
      })
    );
  }

  /**
   * Mark attendance for multiple students
   */
  markAttendance(classId: string, request: MarkAttendanceRequest): Observable<ApiResponse<boolean>> {
    return this.post<MarkAttendanceRequest, ApiResponse<boolean>>(
      Teacher_API_ENDPOINTS.Attendance.MARK_ATTENDANCE(classId),
      request
    ).pipe(
      tap(() => {
        // Reload attendance after marking
        if (request.AttendanceDate) {
          const date = new Date(request.AttendanceDate);
          this.getClassAttendance(classId, date).subscribe();
        }
      })
    );
  }

  /**
   * Bulk mark attendance for multiple students with same status
   */
  bulkMarkAttendance(
    classId: string,
    request: BulkMarkAttendanceRequest
  ): Observable<ApiResponse<boolean>> {
    return this.post<BulkMarkAttendanceRequest, ApiResponse<boolean>>(
      Teacher_API_ENDPOINTS.Attendance.BULK_MARK(classId),
      request
    ).pipe(
      tap(() => {
        // Reload attendance after bulk marking
        if (request.AttendanceDate) {
          const date = new Date(request.AttendanceDate);
          this.getClassAttendance(classId, date).subscribe();
        }
      })
    );
  }

  /**
   * Update an existing attendance record
   */
  updateAttendance(
    attendanceId: string,
    request: UpdateAttendanceRequest
  ): Observable<ApiResponse<boolean>> {
    return this.put<UpdateAttendanceRequest, ApiResponse<boolean>>(
      Teacher_API_ENDPOINTS.Attendance.UPDATE(attendanceId),
      request
    );
  }

  /**
   * Process automatic attendance for a class
   */
  processAutomaticAttendance(classId: string, date: Date): Observable<ApiResponse<number>> {
    const dateStr = date.toISOString().split('T')[0];
    return this.post<{ Date: string }, ApiResponse<number>>(
      Teacher_API_ENDPOINTS.Attendance.PROCESS_AUTOMATIC(classId),
      { Date: dateStr }
    ).pipe(
      tap(() => {
        // Reload attendance after processing
        this.getClassAttendance(classId, date).subscribe();
      })
    );
  }
}

