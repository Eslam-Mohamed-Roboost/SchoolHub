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
  StudentId: string; // All IDs are strings
  StudentName: string;
  Email: string;
  ClassId: string; // All IDs are strings
  ClassName: string;
  TotalFiles: number;
  PendingFiles: number;
  ReviewedFiles: number;
  NeedsRevisionFiles: number;
  LastSubmissionDate?: string;
  PortfolioStatus: string;
}

interface StudentPortfolioDetailDto {
  StudentId: string; // All IDs are strings
  StudentName: string;
  SubjectId: string; // All IDs are strings
  SubjectName: string;
  Files: TeacherPortfolioFileDto[];
}

interface TeacherPortfolioFileDto {
  Id: string; // All IDs are strings
  FileName: string;
  FileType: string;
  FileSize: number; // FileSize is a number (bytes)
  DownloadUrl: string;
  UploadedAt: string;
  Status: string;
  ReviewedBy?: string; // All IDs are strings
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

interface PortfolioFileDto {
  Id: string;
  FileName: string;
  FileType: string;
  FileSize: number;
  UploadDate: string;
  SubjectId: string;
  ThumbnailUrl?: string;
  PreviewUrl?: string;
  DownloadUrl: string;
}

interface PortfolioDto {
  Id: string;
  StudentId: string;
  StudentName: string;
  SubjectId: string;
  SubjectName: string;
  Submissions: PortfolioFileDto[];
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
  LastUpdated: string | null;
}

interface BadgeDto {
  Id: string;
  Name: string;
  Icon: string;
  Description: string;
  Color: string;
  Category: 'subject' | 'skill' | 'achievement';
}

interface TeacherPortfolioRevisionRequest {
  Feedback: string;
}

interface TeacherAwardPortfolioBadgeRequest {
  BadgeId: string;
}

@Injectable({
  providedIn: 'root',
})
export class PortfolioService extends BaseHttpService {
  private availableBadges = signal<Badge[]>([]);

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
      badges: [],
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

  getStudents(subjectId?: string, classId?: string): void {
      let url = Teacher_API_ENDPOINTS.Portfolio.MY_STUDENTS;
      const params: string[] = [];
      
      // Only add parameters if they are valid (not null, undefined, or "null" string)
      if (subjectId && subjectId !== 'null' && subjectId !== 'undefined') {
        params.push(`subjectId=${subjectId}`);
      }
      if (classId && classId !== 'null' && classId !== 'undefined') {
        params.push(`classId=${classId}`);
      }
      
      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }

    console.log('Loading students from:', url);
    this.get<ApiResponse<StudentPortfolioDto[]>>(url).subscribe({
      next: (response) => {
        console.log('Students API response:', response);
        let data: StudentPortfolioDto[] = [];
        
        // Handle different response formats
        if (Array.isArray(response)) {
          data = response;
        } else if (response && 'Data' in response && response.Data) {
          data = Array.isArray(response.Data) ? response.Data : [];
        } else if (response && 'data' in response && (response as any).data) {
          data = Array.isArray((response as any).data) ? (response as any).data : [];
        }
        
        console.log('Extracted students data:', data);
        const mapped = data.map((s) => this.mapStudentPortfolioDto(s));
        console.log('Mapped students:', mapped);
        this.students.set(mapped);
      },
      error: (err) => {
        console.error('Failed to load students', { subjectId, classId }, err);
        this.students.set([]);
      },
    });
  }

  /**
   * Load all students (no filters)
   */
  loadAllStudents(): void {
    this.getStudents();
  }

  /**
   * Get students signal (reactive)
   */
  getStudentsSignal() {
    return this.students.asReadonly();
  }

  loadStudentPortfolio(studentId: string, subjectId: string): void {
    // Validate inputs
    if (!studentId || !subjectId || subjectId === 'null' || subjectId === 'undefined') {
      console.error('Invalid studentId or subjectId:', { studentId, subjectId });
      this.currentPortfolio.set(null);
      return;
    }

    // IDs are strings, no need to parse them
    this.get<ApiResponse<PortfolioDto>>(
      Teacher_API_ENDPOINTS.Portfolio.STUDENT_DETAIL(studentId, subjectId)
    ).subscribe({
      next: (response) => {
        let dto: PortfolioDto;
        if (response && 'Data' in response && response.Data) {
          dto = response.Data;
        } else if (response && 'data' in response && (response as any).data) {
          dto = (response as any).data;
        } else {
          dto = response as unknown as PortfolioDto;
        }
        const portfolio = this.mapPortfolioDto(dto);
        this.currentPortfolio.set(portfolio);
      },
      error: (err) => {
        console.error('Failed to load student portfolio', err);
        this.currentPortfolio.set(null);
      },
    });
  }

  getStudentPortfolio(studentId: string, subjectId: string): Portfolio | null {
    this.loadStudentPortfolio(studentId, subjectId);
    this.get<ApiResponse<PortfolioDto> | PortfolioDto>(
      Teacher_API_ENDPOINTS.Portfolio.STUDENT_DETAIL(studentId, subjectId)
    ).subscribe({
      next: (response) => {
        let dto: PortfolioDto;
        if (response && 'Data' in response && response.Data) {
          dto = response.Data;
        } else if (response && 'data' in response && (response as any).data) {
          dto = (response as any).data;
        } else if ('Id' in response || 'StudentId' in response) {
          // It's already a PortfolioDto
          dto = response as PortfolioDto;
        } else {
          console.error('Unexpected response format:', response);
          return;
        }
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
    studentId: string,
    subjectId: string,
    content: string,
    type: 'comment' | 'revision-request' = 'comment'
  ): void {
    this.post<{ Content: string; Type: string }, ApiResponse<boolean>>(
      Teacher_API_ENDPOINTS.Portfolio.ADD_COMMENT(studentId, subjectId),
      { Content: content, Type: type }
    ).subscribe({
      next: () => {
        // Reload portfolio to get updated feedback
        this.loadStudentPortfolio(studentId, subjectId);
      },
      error: (err) => {
        console.error('Failed to add comment', err);
      },
    });
  }

  toggleLike(studentId: string, subjectId: string): void {
    this.post<{}, ApiResponse<boolean>>(
      Teacher_API_ENDPOINTS.Portfolio.TOGGLE_LIKE(studentId, subjectId),
      {}
    ).subscribe({
      next: () => {
        // Reload portfolio to get updated like status
        this.loadStudentPortfolio(studentId, subjectId);
      },
      error: (err) => {
        console.error('Failed to toggle like', err);
      },
    });
  }

  requestRevision(studentId: string, subjectId: string, feedback: string): void {
    this.post<TeacherPortfolioRevisionRequest, ApiResponse<boolean>>(
      Teacher_API_ENDPOINTS.Portfolio.REQUEST_REVISION(studentId, subjectId),
      { Feedback: feedback }
    ).subscribe({
      next: () => {
        // Reload portfolio to get updated feedback
        this.loadStudentPortfolio(studentId, subjectId);
      },
      error: (err) => {
        console.error('Failed to request revision', err);
      },
    });
  }

  awardBadge(studentId: string, subjectId: string, badgeId: string, onSuccess?: (badgeDto: any) => void): void {
    // Validate that badgeId is a numeric string (backend expects long)
 

    // Backend expects BadgeId as string representation of long (due to LongAsStringConverter)
    this.post<TeacherAwardPortfolioBadgeRequest, ApiResponse<any>>(
      Teacher_API_ENDPOINTS.Portfolio.AWARD_BADGE(studentId, subjectId),
      { BadgeId: badgeId }
    ).subscribe({
      next: (response) => {
        // Extract badge DTO from response
        let badgeDto: any = null;
        if (response && 'Data' in response && response.Data) {
          badgeDto = response.Data;
        } else if (response && 'data' in response && (response as any).data) {
          badgeDto = (response as any).data;
        }
        
        // Call success callback if provided
        if (onSuccess && badgeDto) {
          onSuccess(badgeDto);
        }
        
        // Reload portfolio to get updated badges and status
        this.loadStudentPortfolio(studentId, subjectId);
      },
      error: (err) => {
        console.error('Failed to award badge', err);
      },
    });
  }

  getAvailableBadges(): Badge[] {
    // Load badges from backend if not already loaded
    if (this.availableBadges().length === 0) {
      this.loadAvailableBadges();
    }
    return this.availableBadges();
  }

  getAvailableBadgesSignal() {
    if (this.availableBadges().length === 0) {
      this.loadAvailableBadges();
    }
    return this.availableBadges.asReadonly();
  }

  private loadAvailableBadges(): void {
    this.get<ApiResponse<BadgeDto[]>>(Teacher_API_ENDPOINTS.Portfolio.BADGES).subscribe({
      next: (response) => {
        let dtos: BadgeDto[] = [];
        if (response && 'Data' in response && response.Data) {
          dtos = Array.isArray(response.Data) ? response.Data : [];
        } else if (Array.isArray(response)) {
          dtos = response;
        } else if (response && 'data' in response && (response as any).data) {
          dtos = Array.isArray((response as any).data) ? (response as any).data : [];
        }

        const badges = dtos.map((b) => ({
          id: b.Id, // Ensure ID is string (backend sends as string due to LongAsStringConverter)
          name: b.Name,
          icon: b.Icon,
          description: b.Description,
          color: b.Color,
          category: b.Category as 'subject' | 'skill' | 'achievement',
        }));
        this.availableBadges.set(badges);
      },
      error: (err) => {
        console.error('Failed to load available badges', err);
        this.availableBadges.set([]);
      },
    });
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
        ? {
            id: dto.LatestSubmission.Id,
            title: dto.LatestSubmission.Title,
            content: dto.LatestSubmission.Content,
            submittedAt: new Date(dto.LatestSubmission.SubmittedAt),
            type: dto.LatestSubmission.Type,
            fileUrl: dto.LatestSubmission.FileUrl,
            fileName: dto.LatestSubmission.FileName,
            fileSize: dto.LatestSubmission.FileSize,
          }
        : undefined,
    };
  }

  private mapPortfolioDto(dto: PortfolioDto): Portfolio {
    return {
      id: dto.Id || `${dto.StudentId}-${dto.SubjectId}`,
      studentId: String(dto.StudentId),
      studentName: dto.StudentName,
      subjectId: String(dto.SubjectId),
      subjectName: dto.SubjectName,
      submissions: dto.Submissions.map((s) => ({
        id: String(s.Id),
        title: s.FileName,
        content: '',
        submittedAt: new Date(s.UploadDate),
        type: 'file-upload' as const,
        fileUrl: s.DownloadUrl,
        fileName: s.FileName,
        fileSize: this.formatFileSize(s.FileSize),
      })),
      feedback: dto.Feedback.map((f) => ({
        id: String(f.Id),
        teacherId: String(f.TeacherId),
        teacherName: f.TeacherName,
        content: f.Content,
        createdAt: new Date(f.CreatedAt),
        type: f.Type,
      })),
      badges: dto.Badges.map((b) => ({
        id: String(b.Id),
        name: b.Name,
        icon: b.Icon,
        description: b.Description,
        color: b.Color,
        category: b.Category,
        awardedAt: b.AwardedAt ? new Date(b.AwardedAt) : undefined,
      })),
      likes: dto.Likes,
      isLiked: dto.IsLiked,
      lastUpdated: dto.LastUpdated ? new Date(dto.LastUpdated) : new Date(),
    };
  }

  private mapStudentPortfolioDto(dto: StudentPortfolioDto): Student {
    // All IDs are strings
    const studentId = String(dto.StudentId || (dto as any).studentId || '');
    const classId = String(dto.ClassId || (dto as any).classId || '');
    
    return {
      id: studentId,
      name: dto.StudentName || (dto as any).studentName || '',
      email: dto.Email || (dto as any).email || '',
      avatar: '',
      portfolioStatus: this.mapPortfolioStatus(dto.PortfolioStatus || (dto as any).portfolioStatus || 'Pending'),
      latestSubmission: (dto.LastSubmissionDate || (dto as any).lastSubmissionDate)
        ? {
            id: 'latest',
            title: 'Latest Submission',
            content: '',
            submittedAt: new Date(dto.LastSubmissionDate || (dto as any).lastSubmissionDate),
            type: 'file-upload',
          }
        : undefined,
      // Include class information
      classId: classId,
      className: dto.ClassName || (dto as any).className || '',
    };
  }

  private mapStudentPortfolioDetailDto(dto: StudentPortfolioDetailDto): Portfolio {
    return {
      id: `portfolio-${dto.StudentId}-${dto.SubjectId}`,
      studentId: String(dto.StudentId || ''), // Ensure it's a string
      studentName: dto.StudentName,
      subjectId: String(dto.SubjectId || ''), // Ensure it's a string
      subjectName: dto.SubjectName,
      submissions: dto.Files.map((f) => ({
        id: String(f.Id || ''), // Ensure it's a string
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

