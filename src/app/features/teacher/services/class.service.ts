import { Injectable, signal } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseHttpService } from '../../../core/services/base-http.service';
import { Teacher_API_ENDPOINTS } from '../../../config/TeacherConfig/TeacherEndpoint';
import { TeacherClass, ClassStudent, ClassSubjectInfo } from '../models/class.model';

interface ApiResponse<T> {
  IsSuccess: boolean;
  Data: T;
  Message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ClassService extends BaseHttpService {
  private classes = signal<TeacherClass[]>([]);
  private classStudents = signal<ClassStudent[]>([]);

  getClassesSignal() {
    return this.classes.asReadonly();
  }

  getClassStudentsSignal() {
    return this.classStudents.asReadonly();
  }

  getMyClasses(): Observable<TeacherClass[]> {
    return this.get<ApiResponse<TeacherClassDto[]> | TeacherClassDto[]>(Teacher_API_ENDPOINTS.Classes.GET_MY_CLASSES).pipe(
      map((response) => {
        console.log('Teacher Classes API Response:', response);
        let data: TeacherClassDto[] = [];
        
        // Handle different response formats
        if (Array.isArray(response)) {
          data = response;
        } else if (response && 'Data' in response && response.Data) {
          data = Array.isArray(response.Data) ? response.Data : [];
        } else if (response && 'data' in response && (response as any).data) {
          data = Array.isArray((response as any).data) ? (response as any).data : [];
        }
        
        console.log('Extracted classes data:', data);
        const mapped = data.map((d) => this.mapToTeacherClass(d));
        console.log('Mapped classes:', mapped);
        this.classes.set(mapped);
        return mapped;
      })
    );
  }

  getClassStudents(classId: string): Observable<ClassStudent[]> {
    return this.get<ApiResponse<ClassStudentDto[]> | ClassStudentDto[]>(
      Teacher_API_ENDPOINTS.Classes.GET_CLASS_STUDENTS(classId)
    ).pipe(
      map((response) => {
        console.log('Class Students API Response:', response);
        let data: ClassStudentDto[] = [];
        
        // Handle different response formats
        if (Array.isArray(response)) {
          data = response;
        } else if (response && 'Data' in response && response.Data) {
          data = Array.isArray(response.Data) ? response.Data : [];
        } else if (response && 'data' in response && (response as any).data) {
          data = Array.isArray((response as any).data) ? (response as any).data : [];
        }
        
        console.log('Extracted students data:', data);
        const mapped = data.map((d) => this.mapToClassStudent(d));
        console.log('Mapped students:', mapped);
        this.classStudents.set(mapped);
        return mapped;
      })
    );
  }

  getClassSubjects(classId: string): Observable<ClassSubjectInfo[]> {
    return this.getMyClasses().pipe(
      map((classes) => {
        const classData = classes.find(c => c.id === classId);
        return classData?.subjects || [];
      })
    );
  }

  private mapToTeacherClass(dto: any): TeacherClass {
    // Handle both string and number IDs (backend sends strings due to LongAsStringConverter)
    const id = String(dto.Id || dto.id || '');
    const subjects = (dto.Subjects || dto.subjects || []).map((s: any) => ({
      subjectId: String(s.SubjectId || s.subjectId || ''),
      subjectName: s.SubjectName || s.subjectName || 'Unknown',
    }));
    
    console.log('Mapping class:', dto, '->', {
      id,
      name: dto.Name || dto.name || '',
      grade: Number(dto.Grade || dto.grade || 0),
      studentCount: Number(dto.StudentCount || dto.studentCount || 0),
      subjects,
    });
    
    return {
      id,
      name: dto.Name || dto.name || '',
      grade: Number(dto.Grade || dto.grade || 0),
      studentCount: Number(dto.StudentCount || dto.studentCount || 0),
      subjects,
    };
  }

  private mapToClassStudent(dto: any): ClassStudent {
    // Handle both string and number IDs (backend sends strings due to LongAsStringConverter)
    const id = String(dto.Id || dto.id || '');
    const classId = String(dto.ClassId || dto.classId || '');
    
    console.log('Mapping student:', dto, '->', {
      id,
      name: dto.Name || dto.name || '',
      email: dto.Email || dto.email || '',
      classId,
      className: dto.ClassName || dto.className || '',
      isActive: dto.IsActive !== undefined ? dto.IsActive : (dto.isActive !== undefined ? dto.isActive : true),
      lastLogin: dto.LastLogin || dto.lastLogin ? new Date(dto.LastLogin || dto.lastLogin) : undefined,
    });
    
    return {
      id,
      name: dto.Name || dto.name || '',
      email: dto.Email || dto.email || '',
      classId,
      className: dto.ClassName || dto.className || '',
      isActive: dto.IsActive !== undefined ? dto.IsActive : (dto.isActive !== undefined ? dto.isActive : true),
      lastLogin: dto.LastLogin || dto.lastLogin ? new Date(dto.LastLogin || dto.lastLogin) : undefined,
    };
  }
}

interface TeacherClassDto {
  Id: string | number; // Backend sends as string (LongAsStringConverter)
  Name: string;
  Grade: number;
  StudentCount: number;
  Subjects: Array<{
    SubjectId: string | number; // Backend sends as string (LongAsStringConverter)
    SubjectName: string;
  }>;
}

interface ClassStudentDto {
  Id: string | number; // Backend sends as string (LongAsStringConverter)
  Name: string;
  Email: string;
  ClassId: string | number; // Backend sends as string (LongAsStringConverter)
  ClassName: string;
  IsActive: boolean;
  LastLogin?: string | null;
}

