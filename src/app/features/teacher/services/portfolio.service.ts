import { Injectable, signal } from '@angular/core';
import { BaseHttpService } from '../../../core/services/base-http.service';
import { Student, Portfolio, Submission, Comment, Badge } from '../models/portfolio.model';

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

  getStudents(subjectId: string): Student[] {
    this.get<StudentDto[]>(`/Teacher/Portfolio/Students?subjectId=${subjectId}`).subscribe({
      next: (dtos) => {
        const mapped = dtos.map((s) => this.mapStudentDto(s));
        this.students.set(mapped);
      },
      error: (err) => {
        console.error('Failed to load students for subject', subjectId, err);
      },
    });

    return this.students();
  }

  getStudentPortfolio(studentId: string, subjectId: string): Portfolio | null {
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
}

