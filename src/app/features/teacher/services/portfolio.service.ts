import { Injectable, signal } from '@angular/core';
import { BaseHttpService } from '../../../core/services/base-http.service';
import { Student, Portfolio, Submission, Comment, Badge } from '../models/portfolio.model';
import { Teacher_API_ENDPOINTS } from '../../../config/TeacherConfig/TeacherEndpoint';

interface StudentDto {
  Id: string;
  Name: string;
  Email: string;
  Avatar?: string | null;
  PortfolioStatus: 'pending' | 'reviewed' | 'needs-revision';
  LatestSubmission?: {
    Id: string;
    Title: string;
    Content: string;
    SubmittedAt: string;
    Type: 'onenote' | 'file-upload';
    FileUrl?: string;
    FileName?: string;
    FileSize?: string;
  };
}

interface StudentPortfolioDto {
  StudentId: number;
  StudentName: string;
  Email: string;
  ClassId: number;
  ClassName: string;
  TotalFiles: number;
  PendingFiles: number;
  ReviewedFiles: number;
  NeedsRevisionFiles: number;
  LastSubmissionDate?: string;
  PortfolioStatus: string;
}

interface StudentPortfolioDetailDto {
  StudentId: number;
  StudentName: string;
  SubjectId: number;
  SubjectName: string;
  Files: TeacherPortfolioFileDto[];
}

interface TeacherPortfolioFileDto {
  Id: number;
  FileName: string;
  FileType: string;
  FileSize: number;
  DownloadUrl: string;
  UploadedAt: string;
  Status: string;
  ReviewedBy?: number;
  ReviewerName?: string;
  ReviewedAt?: string;
  RevisionNotes?: string;
}

interface ApiResponse<T> {
  Data: T;
  IsSuccess: boolean;
  Message: string;
  ErrorCode: string;
}

interface PortfolioDto {
  Id: string;
  StudentId: string;
  StudentName: string;
  SubjectId: string;
  SubjectName: string;
  Submissions: {
    Id: string;
    Title: string;
    Content: string;
    SubmittedAt: string;
    Type: 'onenote' | 'file-upload';
    FileUrl?: string;
    FileName?: string;
    FileSize?: string;
  }[];
  Feedback: {
    Id: string;
    TeacherId: string;
    TeacherName: string;
    Content: string;
    CreatedAt: string;
    Type: 'comment' | 'revision-request';
  }[];
  Badges: {
    Id: string;
    Name: string;
    Icon: string;
    Description: string;
    Color: string;
    Category: 'subject' | 'skill' | 'achievement';
    AwardedAt?: string;
  }[];
  Likes: number;
  IsLiked: boolean;
  LastUpdated: string;
}

interface BadgeDto {
  Id: string;
  Name: string;
  Icon: string;
  Description: string;
  Color: string;
  Category: 'subject' | 'skill' | 'achievement';
}

@Injectable({
  providedIn: 'root',
})
export class PortfolioService extends BaseHttpService {
  private mockBadges: Badge[] = [
    {
      id: 'critical-thinker',
      name: 'Critical Thinker',
      icon: 'fas fa-brain',
      description: 'Demonstrates exceptional critical thinking skills',
      color: '#6366f1',
      category: 'skill',
    },
    {
      id: 'creative-writer',
      name: 'Creative Writer',
      icon: 'fas fa-pen-fancy',
      description: 'Shows creativity and originality in writing',
      color: '#ec4899',
      category: 'subject',
    },
    {
      id: 'problem-solver',
      name: 'Problem Solver',
      icon: 'fas fa-lightbulb',
      description: 'Excels at solving complex problems',
      color: '#f59e0b',
      category: 'skill',
    },
    {
      id: 'excellent-researcher',
      name: 'Excellent Researcher',
      icon: 'fas fa-search',
      description: 'Shows strong research and citation skills',
      color: '#10b981',
      category: 'skill',
    },
    {
      id: 'subject-mastery',
      name: 'Subject Mastery',
      icon: 'fas fa-star',
      description: 'Demonstrates mastery of subject content',
      color: '#8b5cf6',
      category: 'achievement',
    },
  ];

  private portfolios = signal<Portfolio[]>([
    {
      id: 'portfolio-1',
      studentId: 'student-1',
      studentName: 'Ahmed Al-Mansouri',
      subjectId: 'math',
      subjectName: 'Mathematics',
      submissions: [
        {
          id: 'sub-1',
          title: 'Algebra Problem Set Week 5',
          content: `
            <h3>Quadratic Equations Solutions</h3>
            <p>Completed all 10 problems with detailed workings.</p>
            <div>
              <p><strong>Problem 1:</strong> Solve x² + 5x + 6 = 0</p>
              <p>Solution: (x+2)(x+3) = 0, therefore x = -2 or x = -3</p>
            </div>
          `,
          submittedAt: new Date('2024-12-01T10:30:00'),
          type: 'onenote',
        },
      ],
      feedback: [
        {
          id: 'comment-1',
          teacherId: 'teacher-1',
          teacherName: 'Sarah Johnson',
          content:
            'Excellent work on the problem set! Your solutions are clear and well-organized.',
          createdAt: new Date('2024-12-01T14:00:00'),
          type: 'comment',
        },
      ],
      badges: [{ ...this.mockBadges[2], awardedAt: new Date('2024-11-15') }],
      likes: 3,
      isLiked: true,
      lastUpdated: new Date('2024-12-01'),
    },
    {
      id: 'portfolio-2',
      studentId: 'student-2',
      studentName: 'Fatima Al-Kuwari',
      subjectId: 'math',
      subjectName: 'Mathematics',
      submissions: [
        {
          id: 'sub-2',
          title: 'Geometry Assignment - Triangles',
          content: `
            <h3>Triangle Properties Investigation</h3>
            <p>This assignment explores the properties of different types of triangles.</p>
          `,
          submittedAt: new Date('2024-11-30T16:45:00'),
          type: 'file-upload',
          fileUrl: '/mock/geometry-assignment.pdf',
          fileName: 'geometry-assignment.pdf',
          fileSize: '2.3 MB',
        },
      ],
      feedback: [],
      badges: [],
      likes: 0,
      isLiked: false,
      lastUpdated: new Date('2024-11-30'),
    },
  ]);

  private currentPortfolio = signal<Portfolio | null>(null);

  private students = signal<Student[]>([
    {
      id: 'student-1',
      name: 'Ahmed Al-Mansouri',
      email: 'ahmed.m@school.edu',
      avatar: '',
      portfolioStatus: 'reviewed',
      latestSubmission: {
        id: 'sub-1',
        title: 'Algebra Problem Set Week 5',
        content: '',
        submittedAt: new Date('2024-12-01T10:30:00'),
        type: 'onenote',
      },
    },
    {
      id: 'student-2',
      name: 'Fatima Al-Kuwari',
      email: 'fatima.k@school.edu',
      portfolioStatus: 'pending',
      latestSubmission: {
        id: 'sub-2',
        title: 'Geometry Assignment - Triangles',
        content: '',
        submittedAt: new Date('2024-11-30T16:45:00'),
        type: 'file-upload',
      },
    },
    {
      id: 'student-3',
      name: 'Mohammed Al-Thani',
      email: 'mohammed.t@school.edu',
      portfolioStatus: 'pending',
      latestSubmission: {
        id: 'sub-3',
        title: 'Calculus Practice',
        content: '',
        submittedAt: new Date('2024-11-29T09:15:00'),
        type: 'onenote',
      },
    },
    {
      id: 'student-4',
      name: 'Layla Al-Sabah',
      email: 'layla.s@school.edu',
      portfolioStatus: 'reviewed',
    },
    {
      id: 'student-5',
      name: 'Omar Al-Dosari',
      email: 'omar.d@school.edu',
      portfolioStatus: 'needs-revision',
      latestSubmission: {
        id: 'sub-5',
        title: 'Statistics Project',
        content: '',
        submittedAt: new Date('2024-11-28T11:00:00'),
        type: 'file-upload',
      },
    },
  ]);

  // ============================================
  // API calls
  // ============================================

  getStudents(subjectId?: string, classId?: string): Student[] {
    const subjectIdNum = subjectId ? parseInt(subjectId) : undefined;
    const classIdNum = classId ? parseInt(classId) : undefined;
    
    let url = Teacher_API_ENDPOINTS.Portfolio.MY_STUDENTS;
    const params: string[] = [];
    if (subjectIdNum) {
      params.push(`subjectId=${subjectIdNum}`);
    }
    if (classIdNum) {
      params.push(`classId=${classIdNum}`);
    }
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    this.get<ApiResponse<StudentPortfolioDto[]>>(url).subscribe({
      next: (response) => {
        const data = response.Data || [];
        const mapped = data.map((s) => this.mapStudentPortfolioDto(s));
        this.students.set(mapped);
      },
      error: (err) => {
        console.error('Failed to load students', { subjectId, classId }, err);
        this.students.set([]);
      },
    });

    return this.students();
  }

  /**
   * Load all students (no filters)
   */
  loadAllStudents(): void {
    this.getStudents();
  }

  loadStudentPortfolio(studentId: string, subjectId: string): void {
    const studentIdNum = parseInt(studentId);
    const subjectIdNum = parseInt(subjectId);

    this.get<ApiResponse<StudentPortfolioDetailDto>>(
      Teacher_API_ENDPOINTS.Portfolio.STUDENT_DETAIL(studentIdNum, subjectIdNum)
    ).subscribe({
      next: (response) => {
        if (response.Data) {
          const portfolio = this.mapStudentPortfolioDetailDto(response.Data);
          this.currentPortfolio.set(portfolio);
        }
      },
      error: (err) => {
        console.error('Failed to load student portfolio', err);
        this.currentPortfolio.set(null);
      },
    });
  }

  getStudentPortfolio(studentId: string, subjectId: string): Portfolio | null {
    this.loadStudentPortfolio(studentId, subjectId);
    this.get<PortfolioDto>(`/Teacher/Portfolio/${studentId}/${subjectId}`).subscribe({
      next: (dto) => {
        const portfolio = this.mapPortfolioDto(dto);
        this.portfolios.update((portfolios) => {
          const existingIndex = portfolios.findIndex((p) => p.id === portfolio.id);
          if (existingIndex !== -1) {
            portfolios[existingIndex] = portfolio;
            return [...portfolios];
          }
          return [...portfolios, portfolio];
        });
      },
      error: (err) => {
        console.error('Failed to load portfolio', studentId, subjectId, err);
      },
    });

    return (
      this.portfolios().find((p) => p.studentId === studentId && p.subjectId === subjectId) || null
    );
  }

  addComment(
    portfolioId: string,
    content: string,
    type: 'comment' | 'revision-request' = 'comment'
  ): void {
    this.post<{ Content: string; Type: string }, void>(
      `/Teacher/Portfolio/${portfolioId}/Comment`,
      { Content: content, Type: type }
    ).subscribe({
      next: () => {
        // Optimistic update: append comment locally
        const newComment: Comment = {
          id: `comment-${Date.now()}`,
          teacherId: 'teacher-1',
          teacherName: 'Teacher',
          content,
          createdAt: new Date(),
          type,
        };

        this.portfolios.update((portfolios) =>
          portfolios.map((p) =>
            p.id === portfolioId ? { ...p, feedback: [...p.feedback, newComment] } : p
          )
        );
      },
      error: (err) => {
        console.error('Failed to add comment', err);
      },
    });
  }

  toggleLike(portfolioId: string): void {
    this.post<{}, void>(`/Teacher/Portfolio/${portfolioId}/ToggleLike`, {}).subscribe({
      next: () => {
        this.portfolios.update((portfolios) =>
          portfolios.map((p) =>
            p.id === portfolioId
              ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 }
              : p
          )
        );
      },
      error: (err) => {
        console.error('Failed to toggle like', err);
      },
    });
  }

  requestRevision(portfolioId: string, feedback: string): void {
    this.post<{ Feedback: string }, void>(
      `/Teacher/Portfolio/${portfolioId}/RequestRevision`,
      { Feedback: feedback }
    ).subscribe({
      next: () => {
        this.addComment(portfolioId, feedback, 'revision-request');
      },
      error: (err) => {
        console.error('Failed to request revision', err);
      },
    });
  }

  awardBadge(portfolioId: string, badgeId: string): void {
    this.post<{ BadgeId: string }, void>(`/Teacher/Portfolio/${portfolioId}/AwardBadge`, {
      BadgeId: badgeId,
    }).subscribe({
      next: () => {
        const badge = this.mockBadges.find((b) => b.id === badgeId);
        if (!badge) return;

        const awardedBadge: Badge = {
          ...badge,
          awardedAt: new Date(),
        };

        this.portfolios.update((portfolios) =>
          portfolios.map((p) =>
            p.id === portfolioId ? { ...p, badges: [...p.badges, awardedBadge] } : p
          )
        );
      },
      error: (err) => {
        console.error('Failed to award badge', err);
      },
    });
  }

  getAvailableBadges(): Badge[] {
    // Backend-backed list
    this.get<BadgeDto[]>(`/Teacher/Portfolio/Badges`).subscribe({
      next: (dtos) => {
        this.mockBadges = dtos.map((b) => ({
          id: b.Id,
          name: b.Name,
          icon: b.Icon,
          description: b.Description,
          color: b.Color,
          category: b.Category,
        }));
      },
      error: (err) => {
        console.error('Failed to load available badges', err);
      },
    });

    return this.mockBadges;
  }

  private getSubjectName(id: string): string {
    const names: { [key: string]: string } = {
      math: 'Mathematics',
      science: 'Science',
      english: 'English Language Arts',
      arabic: 'Arabic Language',
      islamic: 'Islamic Studies',
      social: 'Social Studies',
      pe: 'Physical Education',
      arts: 'Arts',
    };
    return names[id] || 'Subject';
  }

  private mapStudentDto(dto: StudentDto): Student {
    return {
      id: dto.Id,
      name: dto.Name,
      email: dto.Email,
      avatar: dto.Avatar || undefined,
      portfolioStatus: dto.PortfolioStatus,
      latestSubmission: dto.LatestSubmission
        ? this.mapSubmission({
            Id: dto.LatestSubmission.Id,
            Title: dto.LatestSubmission.Title,
            Content: dto.LatestSubmission.Content,
            SubmittedAt: dto.LatestSubmission.SubmittedAt,
            Type: dto.LatestSubmission.Type,
            FileUrl: dto.LatestSubmission.FileUrl,
            FileName: dto.LatestSubmission.FileName,
            FileSize: dto.LatestSubmission.FileSize,
          })
        : undefined,
    };
  }

  private mapPortfolioDto(dto: PortfolioDto): Portfolio {
    return {
      id: dto.Id,
      studentId: dto.StudentId,
      studentName: dto.StudentName,
      subjectId: dto.SubjectId,
      subjectName: dto.SubjectName,
      submissions: dto.Submissions.map((s) => this.mapSubmission(s)),
      feedback: dto.Feedback.map((f) => ({
        id: f.Id,
        teacherId: f.TeacherId,
        teacherName: f.TeacherName,
        content: f.Content,
        createdAt: new Date(f.CreatedAt),
        type: f.Type,
      })),
      badges: dto.Badges.map((b) => ({
        id: b.Id,
        name: b.Name,
        icon: b.Icon,
        description: b.Description,
        color: b.Color,
        category: b.Category,
        awardedAt: b.AwardedAt ? new Date(b.AwardedAt) : undefined,
      })),
      likes: dto.Likes,
      isLiked: dto.IsLiked,
      lastUpdated: new Date(dto.LastUpdated),
    };
  }

  private mapSubmission(dto: {
    Id: string;
    Title: string;
    Content: string;
    SubmittedAt: string;
    Type: 'onenote' | 'file-upload';
    FileUrl?: string;
    FileName?: string;
    FileSize?: string;
  }): Submission {
    return {
      id: dto.Id,
      title: dto.Title,
      content: dto.Content,
      submittedAt: new Date(dto.SubmittedAt),
      type: dto.Type,
      fileUrl: dto.FileUrl,
      fileName: dto.FileName,
      fileSize: dto.FileSize,
    };
  }

  private mapStudentPortfolioDto(dto: StudentPortfolioDto): Student {
    return {
      id: dto.StudentId.toString(),
      name: dto.StudentName,
      email: dto.Email || '',
      avatar: '',
      portfolioStatus: this.mapPortfolioStatus(dto.PortfolioStatus),
      latestSubmission: dto.LastSubmissionDate
        ? {
            id: 'latest',
            title: 'Latest Submission',
            content: '',
            submittedAt: new Date(dto.LastSubmissionDate),
            type: 'file-upload',
          }
        : undefined,
      // Include class information
      classId: dto.ClassId?.toString(),
      className: dto.ClassName,
    };
  }

  private mapStudentPortfolioDetailDto(dto: StudentPortfolioDetailDto): Portfolio {
    return {
      id: `portfolio-${dto.StudentId}-${dto.SubjectId}`,
      studentId: dto.StudentId.toString(),
      studentName: dto.StudentName,
      subjectId: dto.SubjectId.toString(),
      subjectName: dto.SubjectName,
      submissions: dto.Files.map((f) => ({
        id: f.Id.toString(),
        title: f.FileName,
        content: '',
        submittedAt: new Date(f.UploadedAt),
        type: 'file-upload',
        fileUrl: f.DownloadUrl,
        fileName: f.FileName,
        fileSize: this.formatFileSize(f.FileSize),
      })),
      feedback: [],
      badges: [],
      likes: 0,
      isLiked: false,
      lastUpdated: dto.Files.length > 0 ? new Date(dto.Files[0].UploadedAt) : new Date(),
    };
  }

  private mapPortfolioStatus(status: string): 'pending' | 'reviewed' | 'needs-revision' {
    if (status.toLowerCase().includes('reviewed')) return 'reviewed';
    if (status.toLowerCase().includes('revision')) return 'needs-revision';
    return 'pending';
  }

  private formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  // Mock data methods removed - all data now loaded from API only

  getCurrentPortfolio() {
    return this.currentPortfolio.asReadonly();
  }
}

