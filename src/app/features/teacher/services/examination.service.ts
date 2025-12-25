import { Injectable, signal } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseHttpService } from '../../../core/services/base-http.service';
import { Teacher_API_ENDPOINTS } from '../../../config/TeacherConfig/TeacherEndpoint';
import {
  Examination,
  CreateExaminationRequest,
  UpdateExaminationRequest,
  ExaminationAttempt,
  GradeExaminationAttemptRequest,
} from '../models/examination.model';

interface ApiResponse<T> {
  IsSuccess: boolean;
  Data: T;
  Message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ExaminationService extends BaseHttpService {
  private examinations = signal<Examination[]>([]);
  private attempts = signal<ExaminationAttempt[]>([]);

  getExaminationsSignal() {
    return this.examinations.asReadonly();
  }

  getAttemptsSignal() {
    return this.attempts.asReadonly();
  }

  getExaminations(
    classId?: string,
    subjectId?: string,
    type?: string,
    status?: string
  ): Observable<Examination[]> {
    const params: any = {};
    if (classId) params.classId = classId;
    if (subjectId) params.subjectId = subjectId;
    if (type) params.type = type;
    if (status) params.status = status;

    return this.get<ApiResponse<ExaminationDto[]>>(Teacher_API_ENDPOINTS.Examinations.GET_ALL, {
      params,
    }).pipe(
      map((response) => {
        const data = response.Data || [];
        const mapped = data.map((d) => this.mapToExamination(d));
        this.examinations.set(mapped);
        return mapped;
      })
    );
  }

  getExaminationById(id: string): Observable<Examination> {
    return this.get<ApiResponse<ExaminationDto>>(
      Teacher_API_ENDPOINTS.Examinations.GET_BY_ID(id)
    ).pipe(map((response) => this.mapToExamination(response.Data)));
  }

  createExamination(request: CreateExaminationRequest): Observable<Examination> {
    return this.post<CreateExaminationRequest, ApiResponse<ExaminationDto>>(
      Teacher_API_ENDPOINTS.Examinations.CREATE,
      request
    ).pipe(
      map((response) => {
        const examination = this.mapToExamination(response.Data);
        this.examinations.update((examinations) => [...examinations, examination]);
        return examination;
      })
    );
  }

  updateExamination(id: string, request: UpdateExaminationRequest): Observable<Examination> {
    return this.put<UpdateExaminationRequest, ApiResponse<ExaminationDto>>(
      Teacher_API_ENDPOINTS.Examinations.UPDATE(id),
      request
    ).pipe(
      map((response) => {
        const examination = this.mapToExamination(response.Data);
        this.examinations.update((examinations) =>
          examinations.map((e) => (e.id === id ? examination : e))
        );
        return examination;
      })
    );
  }

  deleteExamination(id: string): Observable<boolean> {
    return this.delete<ApiResponse<boolean>>(Teacher_API_ENDPOINTS.Examinations.DELETE(id)).pipe(
      map((response) => {
        this.examinations.update((examinations) => examinations.filter((e) => e.id !== id));
        return response.Data || true;
      })
    );
  }

  getAttempts(examinationId: string, status?: string): Observable<ExaminationAttempt[]> {
    const params: any = {};
    if (status) params.status = status;

    return this.get<ApiResponse<ExaminationAttemptDto[]>>(
      Teacher_API_ENDPOINTS.Examinations.GET_ATTEMPTS(examinationId),
      { params }
    ).pipe(
      map((response) => {
        const data = response.Data || [];
        const mapped = data.map((d) => this.mapToAttempt(d));
        this.attempts.set(mapped);
        return mapped;
      })
    );
  }

  gradeAttempt(
    examinationId: string,
    attemptId: string,
    request: GradeExaminationAttemptRequest
  ): Observable<ExaminationAttempt> {
    return this.post<GradeExaminationAttemptRequest, ApiResponse<ExaminationAttemptDto>>(
      `${Teacher_API_ENDPOINTS.Examinations.GRADE_ATTEMPT(examinationId)}?attemptId=${attemptId}`,
      request
    ).pipe(
      map((response) => {
        const attempt = this.mapToAttempt(response.Data);
        this.attempts.update((attempts) =>
          attempts.map((a) => (a.id === attemptId ? attempt : a))
        );
        return attempt;
      })
    );
  }

  private mapToExamination(dto: ExaminationDto): Examination {
    return {
      id: dto.Id.toString(),
      teacherId: dto.TeacherId.toString(),
      teacherName: dto.TeacherName,
      classId: dto.ClassId.toString(),
      className: dto.ClassName,
      subjectId: dto.SubjectId.toString(),
      subjectName: dto.SubjectName,
      title: dto.Title,
      description: dto.Description,
      type: dto.Type as any,
      scheduledDate: dto.ScheduledDate ? new Date(dto.ScheduledDate) : undefined,
      duration: dto.Duration,
      maxScore: dto.MaxScore,
      instructions: dto.Instructions,
      questions: dto.Questions,
      status: dto.Status as any,
      createdAt: new Date(dto.CreatedAt),
      updatedAt: dto.UpdatedAt ? new Date(dto.UpdatedAt) : undefined,
      attemptCount: dto.AttemptCount,
      gradedCount: dto.GradedCount,
    };
  }

  private mapToAttempt(dto: ExaminationAttemptDto): ExaminationAttempt {
    return {
      id: dto.Id.toString(),
      examinationId: dto.ExaminationId.toString(),
      studentId: dto.StudentId.toString(),
      studentName: dto.StudentName,
      studentEmail: dto.StudentEmail,
      startedAt: new Date(dto.StartedAt),
      submittedAt: dto.SubmittedAt ? new Date(dto.SubmittedAt) : undefined,
      answers: dto.Answers,
      score: dto.Score,
      status: dto.Status as any,
      timeSpent: dto.TimeSpent,
      gradedBy: dto.GradedBy?.toString(),
      graderName: dto.GraderName,
      gradedAt: dto.GradedAt ? new Date(dto.GradedAt) : undefined,
    };
  }
}

interface ExaminationDto {
  Id: number;
  TeacherId: number;
  TeacherName: string;
  ClassId: number;
  ClassName: string;
  SubjectId: number;
  SubjectName: string;
  Title: string;
  Description?: string;
  Type: string;
  ScheduledDate?: string;
  Duration?: number;
  MaxScore: number;
  Instructions?: string;
  Questions?: string;
  Status: string;
  CreatedAt: string;
  UpdatedAt?: string;
  AttemptCount: number;
  GradedCount: number;
}

interface ExaminationAttemptDto {
  Id: number;
  ExaminationId: number;
  StudentId: number;
  StudentName: string;
  StudentEmail: string;
  StartedAt: string;
  SubmittedAt?: string;
  Answers?: string;
  Score?: number;
  Status: string;
  TimeSpent?: number;
  GradedBy?: number;
  GraderName?: string;
  GradedAt?: string;
}

