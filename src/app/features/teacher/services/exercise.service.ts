import { Injectable, signal } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseHttpService } from '../../../core/services/base-http.service';
import { Teacher_API_ENDPOINTS } from '../../../config/TeacherConfig/TeacherEndpoint';
import {
  Exercise,
  CreateExerciseRequest,
  UpdateExerciseRequest,
  ExerciseSubmission,
  GradeExerciseSubmissionRequest,
} from '../models/exercise.model';

interface ApiResponse<T> {
  IsSuccess: boolean;
  Data: T;
  Message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ExerciseService extends BaseHttpService {
  private exercises = signal<Exercise[]>([]);
  private submissions = signal<ExerciseSubmission[]>([]);

  getExercises() {
    return this.exercises.asReadonly();
  }

  getSubmissions() {
    return this.submissions.asReadonly();
  }

  getExercises(
    classId?: string,
    subjectId?: string,
    type?: string,
    status?: string
  ): Observable<Exercise[]> {
    const params: any = {};
    if (classId) params.classId = classId;
    if (subjectId) params.subjectId = subjectId;
    if (type) params.type = type;
    if (status) params.status = status;

    return this.get<ApiResponse<ExerciseDto[]>>(Teacher_API_ENDPOINTS.Exercises.GET_ALL, {
      params,
    }).pipe(
      map((response) => {
        const data = response.Data || [];
        const mapped = data.map((d) => this.mapToExercise(d));
        this.exercises.set(mapped);
        return mapped;
      })
    );
  }

  getExerciseById(id: string): Observable<Exercise> {
    return this.get<ApiResponse<ExerciseDto>>(Teacher_API_ENDPOINTS.Exercises.GET_BY_ID(id)).pipe(
      map((response) => this.mapToExercise(response.Data))
    );
  }

  createExercise(request: CreateExerciseRequest): Observable<Exercise> {
    return this.post<CreateExerciseRequest, ApiResponse<ExerciseDto>>(
      Teacher_API_ENDPOINTS.Exercises.CREATE,
      request
    ).pipe(
      map((response) => {
        const exercise = this.mapToExercise(response.Data);
        this.exercises.update((exercises) => [...exercises, exercise]);
        return exercise;
      })
    );
  }

  updateExercise(id: string, request: UpdateExerciseRequest): Observable<Exercise> {
    return this.put<UpdateExerciseRequest, ApiResponse<ExerciseDto>>(
      Teacher_API_ENDPOINTS.Exercises.UPDATE(id),
      request
    ).pipe(
      map((response) => {
        const exercise = this.mapToExercise(response.Data);
        this.exercises.update((exercises) =>
          exercises.map((e) => (e.id === id ? exercise : e))
        );
        return exercise;
      })
    );
  }

  deleteExercise(id: string): Observable<boolean> {
    return this.delete<ApiResponse<boolean>>(Teacher_API_ENDPOINTS.Exercises.DELETE(id)).pipe(
      map((response) => {
        this.exercises.update((exercises) => exercises.filter((e) => e.id !== id));
        return response.Data || true;
      })
    );
  }

  getSubmissions(exerciseId: string, status?: string): Observable<ExerciseSubmission[]> {
    const params: any = {};
    if (status) params.status = status;

    return this.get<ApiResponse<ExerciseSubmissionDto[]>>(
      Teacher_API_ENDPOINTS.Exercises.GET_SUBMISSIONS(exerciseId),
      { params }
    ).pipe(
      map((response) => {
        const data = response.Data || [];
        const mapped = data.map((d) => this.mapToSubmission(d));
        this.submissions.set(mapped);
        return mapped;
      })
    );
  }

  gradeSubmission(
    exerciseId: string,
    submissionId: string,
    request: GradeExerciseSubmissionRequest
  ): Observable<ExerciseSubmission> {
    return this.post<GradeExerciseSubmissionRequest, ApiResponse<ExerciseSubmissionDto>>(
      `${Teacher_API_ENDPOINTS.Exercises.GRADE_SUBMISSION(exerciseId)}?submissionId=${submissionId}`,
      request
    ).pipe(
      map((response) => {
        const submission = this.mapToSubmission(response.Data);
        this.submissions.update((submissions) =>
          submissions.map((s) => (s.id === submissionId ? submission : s))
        );
        return submission;
      })
    );
  }

  private mapToExercise(dto: ExerciseDto): Exercise {
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
      dueDate: dto.DueDate ? new Date(dto.DueDate) : undefined,
      maxScore: dto.MaxScore,
      instructions: dto.Instructions,
      attachments: dto.Attachments,
      status: dto.Status as any,
      createdAt: new Date(dto.CreatedAt),
      updatedAt: dto.UpdatedAt ? new Date(dto.UpdatedAt) : undefined,
      submissionCount: dto.SubmissionCount,
      gradedCount: dto.GradedCount,
    };
  }

  private mapToSubmission(dto: ExerciseSubmissionDto): ExerciseSubmission {
    return {
      id: dto.Id.toString(),
      exerciseId: dto.ExerciseId.toString(),
      studentId: dto.StudentId.toString(),
      studentName: dto.StudentName,
      studentEmail: dto.StudentEmail,
      submittedAt: dto.SubmittedAt ? new Date(dto.SubmittedAt) : undefined,
      content: dto.Content,
      attachments: dto.Attachments,
      status: dto.Status as any,
      score: dto.Score,
      feedback: dto.Feedback,
      gradedBy: dto.GradedBy?.toString(),
      graderName: dto.GraderName,
      gradedAt: dto.GradedAt ? new Date(dto.GradedAt) : undefined,
      isLate: dto.IsLate,
    };
  }
}

interface ExerciseDto {
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
  DueDate?: string;
  MaxScore: number;
  Instructions?: string;
  Attachments?: string;
  Status: string;
  CreatedAt: string;
  UpdatedAt?: string;
  SubmissionCount: number;
  GradedCount: number;
}

interface ExerciseSubmissionDto {
  Id: number;
  ExerciseId: number;
  StudentId: number;
  StudentName: string;
  StudentEmail: string;
  SubmittedAt?: string;
  Content?: string;
  Attachments?: string;
  Status: string;
  Score?: number;
  Feedback?: string;
  GradedBy?: number;
  GraderName?: string;
  GradedAt?: string;
  IsLate: boolean;
}

