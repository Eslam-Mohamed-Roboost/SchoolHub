import { Injectable, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { BaseHttpService } from '../../../core/services/base-http.service';
import { Admin_API_ENDPOINTS } from '../../../config/AdminConfig/AdminEndpoint';
import {
  ClassSubjectAssignment,
  TeacherAssignmentInfo,
  TeacherAssignmentResponse,
  TeacherAssignmentRequest,
} from '../models/teacher-assignment.model';

interface ApiResponse<T> {
  Data: T;
  IsSuccess: boolean;
  Message?: string;
  ErrorCode?: string;
}

@Injectable({
  providedIn: 'root',
})
export class TeacherAssignmentService extends BaseHttpService {
  private assignments = signal<Map<string, TeacherAssignmentInfo[]>>(new Map());

  /**
   * Assign teacher to classes and subjects
   */
  assignTeacherToClasses(
    teacherId: string,
    assignments: ClassSubjectAssignment[]
  ): Observable<TeacherAssignmentResponse> {
    const request: TeacherAssignmentRequest = {
      Assignments: assignments,
    };

    return this.post<TeacherAssignmentRequest, ApiResponse<TeacherAssignmentResponse>>(
      Admin_API_ENDPOINTS.Teachers.ASSIGN(teacherId),
      request
    ).pipe(
      map((response) => {
        if (Array.isArray(response)) {
          return response as unknown as TeacherAssignmentResponse;
        }
        if ('Data' in response && response.Data) {
          return response.Data;
        }
        return response as unknown as TeacherAssignmentResponse;
      }),
      tap(() => {
        // Reload assignments after successful assignment
        this.getTeacherAssignments(teacherId).subscribe();
      })
    );
  }

  /**
   * Get all assignments for a teacher
   */
  getTeacherAssignments(teacherId: string): Observable<TeacherAssignmentInfo[]> {
    console.log('TeacherAssignmentService: Getting assignments for teacher:', teacherId);
    return this.get<ApiResponse<TeacherAssignmentInfo[]> | TeacherAssignmentInfo[]>(
      Admin_API_ENDPOINTS.Teachers.ASSIGNMENTS(teacherId)
    ).pipe(
      map((response) => {
        console.log('TeacherAssignmentService: Raw response:', response);
        let assignments: TeacherAssignmentInfo[] = [];

        if (Array.isArray(response)) {
          assignments = response;
        } else if ('Data' in response && response.IsSuccess && response.Data) {
          assignments = response.Data;
        } else if ('Data' in response && response.Data) {
          assignments = response.Data;
        }

        console.log('TeacherAssignmentService: Extracted assignments:', assignments);

        // Map backend long IDs to frontend strings
        const mappedAssignments = assignments.map((a) => ({
          Id: String(a.Id || (a as any).id || ''),
          ClassId: String(a.ClassId || (a as any).classId || ''),
          ClassName: a.ClassName || (a as any).className || '',
          Grade: a.Grade || (a as any).grade || 0,
          SubjectId: String(a.SubjectId || (a as any).subjectId || ''),
          SubjectName: a.SubjectName || (a as any).subjectName || '',
          AssignedAt: a.AssignedAt || (a as any).assignedAt || '',
        }));
        
        console.log('TeacherAssignmentService: Mapped assignments:', mappedAssignments);
        return mappedAssignments;
      }),
      tap((assignments) => {
        console.log('TeacherAssignmentService: Caching assignments:', assignments);
        // Cache assignments
        this.assignments.update((map) => {
          const newMap = new Map(map);
          newMap.set(teacherId, assignments);
          return newMap;
        });
      })
    );
  }

  /**
   * Get cached assignments for a teacher
   */
  getCachedAssignments(teacherId: string): TeacherAssignmentInfo[] {
    return this.assignments().get(teacherId) || [];
  }

  /**
   * Remove an assignment (soft delete by not including it in new assignment)
   * Note: Backend doesn't have a delete endpoint, so we remove by reassigning without the removed assignment
   */
  removeAssignment(teacherId: string, assignmentId: string): Observable<boolean> {
    // Get current assignments
    const currentAssignments = this.getCachedAssignments(teacherId);
    const filteredAssignments = currentAssignments.filter((a) => a.Id !== assignmentId);

    // Reassign without the removed assignment
    const assignmentsToKeep: ClassSubjectAssignment[] = filteredAssignments.map((a) => ({
      ClassId: a.ClassId,
      SubjectId: a.SubjectId,
    }));

    return this.assignTeacherToClasses(teacherId, assignmentsToKeep).pipe(
      map(() => true)
    );
  }
}

