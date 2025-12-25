import { Injectable, signal } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseHttpService } from '../../../core/services/base-http.service';
import { Teacher_API_ENDPOINTS } from '../../../config/TeacherConfig/TeacherEndpoint';
import { TeacherClass, ClassStudent } from '../models/class.model';

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

  getClasses() {
    return this.classes.asReadonly();
  }

  getClassStudents() {
    return this.classStudents.asReadonly();
  }

  getMyClasses(): Observable<TeacherClass[]> {
    return this.get<ApiResponse<TeacherClassDto[]>>(Teacher_API_ENDPOINTS.Classes.GET_MY_CLASSES).pipe(
      map((response) => {
        const data = response.Data || [];
        const mapped = data.map((d) => this.mapToTeacherClass(d));
        this.classes.set(mapped);
        return mapped;
      })
    );
  }

  getClassStudents(classId: string): Observable<ClassStudent[]> {
    return this.get<ApiResponse<ClassStudentDto[]>>(
      Teacher_API_ENDPOINTS.Classes.GET_CLASS_STUDENTS(classId)
    ).pipe(
      map((response) => {
        const data = response.Data || [];
        const mapped = data.map((d) => this.mapToClassStudent(d));
        this.classStudents.set(mapped);
        return mapped;
      })
    );
  }

  private mapToTeacherClass(dto: TeacherClassDto): TeacherClass {
    return {
      id: dto.Id.toString(),
      name: dto.Name,
      grade: dto.Grade,
      studentCount: dto.StudentCount,
      subjects: dto.Subjects.map((s) => ({
        subjectId: s.SubjectId.toString(),
        subjectName: s.SubjectName,
      })),
    };
  }

  private mapToClassStudent(dto: ClassStudentDto): ClassStudent {
    return {
      id: dto.Id.toString(),
      name: dto.Name,
      email: dto.Email,
      classId: dto.ClassId.toString(),
      className: dto.ClassName,
      isActive: dto.IsActive,
      lastLogin: dto.LastLogin ? new Date(dto.LastLogin) : undefined,
    };
  }
}

interface TeacherClassDto {
  Id: number;
  Name: string;
  Grade: number;
  StudentCount: number;
  Subjects: Array<{
    SubjectId: number;
    SubjectName: string;
  }>;
}

interface ClassStudentDto {
  Id: number;
  Name: string;
  Email: string;
  ClassId: number;
  ClassName: string;
  IsActive: boolean;
  LastLogin?: string;
}

