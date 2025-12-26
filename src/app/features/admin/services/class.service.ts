import { Injectable, signal, computed } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { BaseHttpService } from '../../../core/services/base-http.service';
import { Admin_API_ENDPOINTS } from '../../../config/AdminConfig/AdminEndpoint';
import { Class, ClassApiResponse, CreateClassRequest, UpdateClassRequest } from '../models/class.model';

@Injectable({
  providedIn: 'root',
})
export class ClassService extends BaseHttpService {
  private classes = signal<Class[]>([]);
  private isLoading = signal(false);

  // Public getters
  getClasses = computed(() => this.classes());
  getIsLoading = computed(() => this.isLoading());

  // Initialize and load classes
  init(): void {
    this.loadClasses();
  }

  loadClasses(): void {
    this.isLoading.set(true);

    this.get<ApiResponse<Class[]> | Class[]>(Admin_API_ENDPOINTS.Classes.GET_ALL).subscribe({
      next: (response: ApiResponse<Class[]> | Class[]) => {
        console.log('Classes API Response (raw):', response);
        console.log('Response type:', typeof response);
        console.log('Is Array:', Array.isArray(response));

        let mappedClasses: Class[] = [];

        // BaseHttpService.transformResponse already extracts Data, so response should be Class[] or ApiResponse<Class[]>
        if (Array.isArray(response)) {
          // Response is already an array (BaseHttpService extracted Data)
          console.log('Response is array, mapping classes...');
          mappedClasses = response.map((c: any) => {
            console.log('Mapping class:', c);
            return this.mapApiResponseToClass(c);
          });
        } else if (response && typeof response === 'object') {
          // Response is still wrapped in ApiResponse
          if ('Data' in response && response.Data) {
            const data = response.Data;
            if (Array.isArray(data)) {
              console.log('Response has Data array, mapping classes...');
              mappedClasses = data.map((c: any) => {
                console.log('Mapping class:', c);
                return this.mapApiResponseToClass(c);
              });
            } else {
              console.warn('Response.Data is not an array:', data);
            }
          } else {
            console.warn('Response does not have Data property:', response);
          }
        } else {
          console.warn('Unexpected response format for classes:', response);
        }

        console.log('Mapped classes:', mappedClasses);
        this.classes.set(mappedClasses);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load classes:', err);
        this.isLoading.set(false);
        this.classes.set([]);
      },
    });
  }

  getClassById(id: string): Observable<Class> {
    return this.get<ApiResponse<ClassApiResponse> | ClassApiResponse>(
      Admin_API_ENDPOINTS.Classes.GET_BY_ID(id)
    ).pipe(map((response) => this.mapApiResponseToClass(response)));
  }

  createClass(request: CreateClassRequest): Observable<number> {
    return this.post<CreateClassRequest, ApiResponse<number> | number>(
      Admin_API_ENDPOINTS.Classes.CREATE,
      request
    ).pipe(
      map((response) => {
        if (typeof response === 'number') return response;
        return response.Data || 0;
      }),
      tap(() => this.loadClasses()) // Reload classes after creation
    );
  }

  updateClass(id: string, request: UpdateClassRequest): Observable<boolean> {
    return this.put<UpdateClassRequest, ApiResponse<boolean> | boolean>(
      Admin_API_ENDPOINTS.Classes.UPDATE(id),
      request
    ).pipe(
      map((response) => {
        if (typeof response === 'boolean') return response;
        return response.Data || false;
      }),
      tap(() => this.loadClasses()) // Reload classes after update
    );
  }

  deleteClass(id: string): Observable<boolean> {
    return this.delete<ApiResponse<boolean> | boolean>(Admin_API_ENDPOINTS.Classes.DELETE(id)).pipe(
      map((response) => {
        if (typeof response === 'boolean') return response;
        return response.Data || false;
      }),
      tap(() => this.loadClasses()) // Reload classes after deletion
    );
  }

  // Get classes for dropdown (simplified, lightweight)
  getClassesForDropdown(): Observable<Class[]> {
    return this.get<ApiResponse<ClassDropdownDto[]> | ClassDropdownDto[]>(
      Admin_API_ENDPOINTS.Classes.DROPDOWN
    ).pipe(
      map((response) => {
        let dropdownData: ClassDropdownDto[] = [];
        
        if (Array.isArray(response)) {
          dropdownData = response;
        } else if ('Data' in response && response.IsSuccess && response.Data) {
          dropdownData = response.Data;
        } else if ('Data' in response && response.Data) {
          dropdownData = response.Data;
        }

        // Map to Class format for consistency
        const mappedClasses = dropdownData.map((d) => {
          const mapped = {
            id: String(d.Id || ''),
            name: d.Name || 'Unnamed Class',
            grade: Number(d.Grade || 0),
            teacherId: undefined,
            teacherName: undefined,
            studentCount: 0,
            subjectIds: [],
            createdAt: new Date(),
          };
          console.log('Mapping class dropdown item:', d, '->', mapped);
          return mapped;
        });
        console.log('Mapped classes for dropdown:', mappedClasses);
        return mappedClasses;
      })
    );
  }

  // Get classes by grade
  getClassesByGrade(grade: number): Class[] {
    return this.classes().filter((c) => c.grade === grade);
  }

  // Helper to map API response to Class model
  private mapApiResponseToClass(response: any): Class {
    if ('Data' in response && response.Data) {
      response = response.Data;
    }

    // Convert SubjectIds from string[] to number[] (backend sends strings due to LongListAsStringConverter)
    const subjectIds = response.SubjectIds || response.subjectIds || [];
    const subjectIdsAsNumbers = Array.isArray(subjectIds)
      ? subjectIds.map((id: any) => {
          // Handle both string and number types
          if (typeof id === 'string') {
            const num = Number(id);
            return isNaN(num) ? 0 : num;
          }
          return typeof id === 'number' ? id : 0;
        })
      : [];

    return {
      id: String(response.Id || response.id || ''),
      name: response.Name || response.name || '',
      grade: Number(response.Grade || response.grade || 0),
      teacherId: response.TeacherId || response.teacherId ? Number(response.TeacherId || response.teacherId) : undefined,
      teacherName: response.TeacherName || response.teacherName || undefined,
      studentCount: Number(response.StudentCount || response.studentCount || 0),
      subjectIds: subjectIdsAsNumbers,
      createdAt: new Date(response.CreatedAt || response.createdAt || Date.now()),
    };
  }
}

// API Response type
interface ApiResponse<T> {
  Data: T;
  IsSuccess: boolean;
  Message: string;
  ErrorCode: string;
}

// Dropdown DTO interface
export interface ClassDropdownDto {
  Id: string;
  Name: string;
  Grade: number;
  DisplayName?: string;
}

