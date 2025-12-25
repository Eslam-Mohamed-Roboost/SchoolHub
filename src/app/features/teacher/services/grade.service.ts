import { Injectable, signal } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseHttpService } from '../../../core/services/base-http.service';
import { Teacher_API_ENDPOINTS } from '../../../config/TeacherConfig/TeacherEndpoint';
import {
  Grade,
  CreateGradeRequest,
  UpdateGradeRequest,
  GradeApprovalRequest,
  GradeSummary,
} from '../models/grade.model';

interface ApiResponse<T> {
  IsSuccess: boolean;
  Data: T;
  Message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class GradeService extends BaseHttpService {
  private grades = signal<Grade[]>([]);

  getGradesSignal() {
    return this.grades.asReadonly();
  }

  getGrades(
    studentId?: string,
    classId?: string,
    subjectId?: string,
    term?: string,
    year?: number,
    status?: string
  ): Observable<Grade[]> {
    const params: any = {};
    if (studentId) params.studentId = studentId;
    if (classId) params.classId = classId;
    if (subjectId) params.subjectId = subjectId;
    if (term) params.term = term;
    if (year) params.year = year;
    if (status) params.status = status;

    return this.get<ApiResponse<GradeDto[]>>(Teacher_API_ENDPOINTS.Grades.GET_ALL, {
      params,
    }).pipe(
      map((response) => {
        const data = response.Data || [];
        const mapped = data.map((d) => this.mapToGrade(d));
        this.grades.set(mapped);
        return mapped;
      })
    );
  }

  getStudentGrades(
    studentId: string,
    classId?: string,
    subjectId?: string,
    term?: string,
    year?: number
  ): Observable<Grade[]> {
    const params: any = {};
    if (classId) params.classId = classId;
    if (subjectId) params.subjectId = subjectId;
    if (term) params.term = term;
    if (year) params.year = year;

    return this.get<ApiResponse<GradeDto[]>>(
      Teacher_API_ENDPOINTS.Grades.GET_STUDENT_GRADES(studentId),
      { params }
    ).pipe(
      map((response) => {
        const data = response.Data || [];
        return data.map((d) => this.mapToGrade(d));
      })
    );
  }

  createGrade(request: CreateGradeRequest): Observable<Grade> {
    return this.post<CreateGradeRequest, ApiResponse<GradeDto>>(
      Teacher_API_ENDPOINTS.Grades.CREATE,
      request
    ).pipe(
      map((response) => {
        const grade = this.mapToGrade(response.Data);
        this.grades.update((grades) => [...grades, grade]);
        return grade;
      })
    );
  }

  updateGrade(id: string, request: UpdateGradeRequest): Observable<Grade> {
    return this.put<UpdateGradeRequest, ApiResponse<GradeDto>>(
      Teacher_API_ENDPOINTS.Grades.UPDATE(id),
      request
    ).pipe(
      map((response) => {
        const grade = this.mapToGrade(response.Data);
        this.grades.update((grades) => grades.map((g) => (g.id === id ? grade : g)));
        return grade;
      })
    );
  }

  approveGrade(id: string, request: GradeApprovalRequest): Observable<Grade> {
    return this.post<GradeApprovalRequest, ApiResponse<GradeDto>>(
      Teacher_API_ENDPOINTS.Grades.APPROVE(id),
      request
    ).pipe(
      map((response) => {
        const grade = this.mapToGrade(response.Data);
        this.grades.update((grades) => grades.map((g) => (g.id === id ? grade : g)));
        return grade;
      })
    );
  }

  getGradeSummary(
    classId: string,
    subjectId: string,
    term?: string,
    year?: number
  ): Observable<GradeSummary> {
    const params: any = {
      classId,
      subjectId,
    };
    if (term) params.term = term;
    if (year) params.year = year;

    return this.get<ApiResponse<GradeSummaryDto>>(Teacher_API_ENDPOINTS.Grades.GET_SUMMARY, {
      params,
    }).pipe(map((response) => this.mapToGradeSummary(response.Data)));
  }

  private mapToGrade(dto: GradeDto): Grade {
    return {
      id: dto.Id.toString(),
      studentId: dto.StudentId.toString(),
      studentName: dto.StudentName,
      classId: dto.ClassId.toString(),
      className: dto.ClassName,
      subjectId: dto.SubjectId.toString(),
      subjectName: dto.SubjectName,
      exerciseId: dto.ExerciseId?.toString(),
      exerciseTitle: dto.ExerciseTitle,
      examinationId: dto.ExaminationId?.toString(),
      examinationTitle: dto.ExaminationTitle,
      score: dto.Score,
      maxScore: dto.MaxScore,
      percentage: dto.Percentage,
      letterGrade: dto.LetterGrade as any,
      term: dto.Term,
      year: dto.Year,
      gradedBy: dto.GradedBy.toString(),
      graderName: dto.GraderName,
      gradedAt: new Date(dto.GradedAt),
      status: dto.Status as any,
      approvedBy: dto.ApprovedBy?.toString(),
      approverName: dto.ApproverName,
      approvedAt: dto.ApprovedAt ? new Date(dto.ApprovedAt) : undefined,
      notes: dto.Notes,
    };
  }

  private mapToGradeSummary(dto: GradeSummaryDto): GradeSummary {
    return {
      classId: dto.ClassId.toString(),
      className: dto.ClassName,
      subjectId: dto.SubjectId.toString(),
      subjectName: dto.SubjectName,
      totalStudents: dto.TotalStudents,
      gradedStudents: dto.GradedStudents,
      averageScore: dto.AverageScore,
      highestScore: dto.HighestScore,
      lowestScore: dto.LowestScore,
      gradeDistribution: dto.GradeDistribution || {},
      term: dto.Term,
      year: dto.Year,
    };
  }
}

interface GradeDto {
  Id: number;
  StudentId: number;
  StudentName: string;
  ClassId: number;
  ClassName: string;
  SubjectId: number;
  SubjectName: string;
  ExerciseId?: number;
  ExerciseTitle?: string;
  ExaminationId?: number;
  ExaminationTitle?: string;
  Score: number;
  MaxScore: number;
  Percentage: number;
  LetterGrade?: string;
  Term?: string;
  Year: number;
  GradedBy: number;
  GraderName: string;
  GradedAt: string;
  Status: string;
  ApprovedBy?: number;
  ApproverName?: string;
  ApprovedAt?: string;
  Notes?: string;
}

interface GradeSummaryDto {
  ClassId: number;
  ClassName: string;
  SubjectId: number;
  SubjectName: string;
  TotalStudents: number;
  GradedStudents: number;
  AverageScore: number;
  HighestScore: number;
  LowestScore: number;
  GradeDistribution: Record<string, number>;
  Term?: string;
  Year: number;
}

