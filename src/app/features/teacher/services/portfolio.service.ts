import { Injectable, signal } from '@angular/core';
import { Student, Portfolio, Submission, Comment, Badge } from '../models/portfolio.model';

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
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

  getStudents(subjectId: string): Student[] {
    // In production, filter by actual class/subject enrollment
    return this.students();
  }

  getStudentPortfolio(studentId: string, subjectId: string): Portfolio | null {
    let portfolio = this.portfolios().find(
      (p) => p.studentId === studentId && p.subjectId === subjectId
    );

    if (!portfolio) {
      // Create a mock portfolio if it doesn't exist
      const student = this.students().find((s) => s.id === studentId);
      if (!student) return null;

      portfolio = {
        id: `portfolio-${studentId}`,
        studentId,
        studentName: student.name,
        subjectId,
        subjectName: this.getSubjectName(subjectId),
        submissions: student.latestSubmission ? [student.latestSubmission] : [],
        feedback: [],
        badges: [],
        likes: 0,
        isLiked: false,
        lastUpdated: new Date(),
      };
    }

    return portfolio;
  }

  addComment(
    portfolioId: string,
    content: string,
    type: 'comment' | 'revision-request' = 'comment'
  ): void {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      teacherId: 'teacher-1',
      teacherName: 'Sarah Johnson',
      content,
      createdAt: new Date(),
      type,
    };

    this.portfolios.update((portfolios) =>
      portfolios.map((p) =>
        p.id === portfolioId ? { ...p, feedback: [...p.feedback, newComment] } : p
      )
    );

    // Mock notification
    console.log(`📧 Notification sent to student for portfolio ${portfolioId}`);
  }

  toggleLike(portfolioId: string): void {
    this.portfolios.update((portfolios) =>
      portfolios.map((p) =>
        p.id === portfolioId
          ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  }

  requestRevision(portfolioId: string, feedback: string): void {
    this.addComment(portfolioId, feedback, 'revision-request');

    // Update student status
    const portfolio = this.portfolios().find((p) => p.id === portfolioId);
    if (portfolio) {
      this.students.update((students) =>
        students.map((s) =>
          s.id === portfolio.studentId ? { ...s, portfolioStatus: 'needs-revision' as const } : s
        )
      );
    }
  }

  awardBadge(portfolioId: string, badgeId: string): void {
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

    // Mock notification
    console.log(`🏆 Badge "${badge.name}" awarded for portfolio ${portfolioId}`);
  }

  getAvailableBadges(): Badge[] {
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
}
