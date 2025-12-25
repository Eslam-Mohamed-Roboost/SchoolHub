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
        console.log('Classes loaded:', response);

        if (Array.isArray(response)) {
          this.classes.set(response);
        } else if ('Data' in response && response.IsSuccess && response.Data) {
          const mappedClasses = response.Data.map((c: any) => this.mapApiResponseToClass(c));
          this.classes.set(mappedClasses);
        } else if ('Data' in response && response.Data) {
          const mappedClasses = response.Data.map((c: any) => this.mapApiResponseToClass(c));
          this.classes.set(mappedClasses);
        } else {
          console.warn('Unexpected response format for classes');
          this.classes.set([]);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load classes:', err);
        this.isLoading.set(false);
        this.classes.set([]);
      },
    });
  }

  getClassById(id: number): Observable<Class> {
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

  updateClass(id: number, request: UpdateClassRequest): Observable<boolean> {
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

  deleteClass(id: number): Observable<boolean> {
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
        return dropdownData.map((d) => ({
          id: d.Id,
          name: d.Name,
          grade: d.Grade,
          teacherId: undefined,
          teacherName: undefined,
          studentCount: 0,
          subjectIds: [],
          createdAt: new Date(),
        }));
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

    return {
      id: response.Id || response.id,
      name: response.Name || response.name,
      grade: response.Grade || response.grade,
      teacherId: response.TeacherId || response.teacherId,
      teacherName: response.TeacherName || response.teacherName,
      studentCount: response.StudentCount || response.studentCount || 0,
      subjectIds: response.SubjectIds || response.subjectIds || [],
      createdAt: new Date(response.CreatedAt || response.createdAt),
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
interface ClassDropdownDto {
  Id: number;
  Name: string;
  Grade: number;
  DisplayName?: string;
}

