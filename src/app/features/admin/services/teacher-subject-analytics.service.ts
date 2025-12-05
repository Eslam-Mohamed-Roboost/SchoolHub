import { Injectable, signal, computed } from '@angular/core';
import {
  TeacherSubjectMatrix,
  SubjectAnalytics,
  ResourceUsageStats,
  TeacherPerformance,
  EvidenceExportRequest,
} from '../models/admin-analytics.model';

@Injectable({
  providedIn: 'root',
})
export class TeacherSubjectAnalyticsService {
  // Mock teacher-subject data
  private mockTeachers: TeacherSubjectMatrix[] = [
    {
      teacherId: 't001',
      teacherName: 'Sarah Johnson',
      email: 'sarah.johnson@school.ae',
      subjects: ['English Language Arts'],
      grades: ['6', '7'],
      cpdBadgesEarned: 8,
      portfolioActivity: 45,
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      teacherId: 't002',
      teacherName: 'Mohammed Al-Farsi',
      email: 'mohammed.alfarsi@school.ae',
      subjects: ['ICT', 'Mathematics'],
      grades: ['6', '7'],
      cpdBadgesEarned: 12,
      portfolioActivity: 67,
      lastActive: new Date(Date.now() - 1 * 60 * 60 * 1000),
    },
    {
      teacherId: 't003',
      teacherName: 'Emily Chen',
      email: 'emily.chen@school.ae',
      subjects: ['Science'],
      grades: ['6'],
      cpdBadgesEarned: 6,
      portfolioActivity: 32,
      lastActive: new Date(Date.now() - 4 * 60 * 60 * 1000),
    },
    {
      teacherId: 't004',
      teacherName: 'Ahmed Hassan',
      email: 'ahmed.hassan@school.ae',
      subjects: ['Arabic', 'Islamic Studies'],
      grades: ['6', '7'],
      cpdBadgesEarned: 10,
      portfolioActivity: 54,
      lastActive: new Date(Date.now() - 3 * 60 * 60 * 1000),
    },
    {
      teacherId: 't005',
      teacherName: 'Lisa Martinez',
      email: 'lisa.martinez@school.ae',
      subjects: ['Mathematics', 'Science'],
      grades: ['7'],
      cpdBadgesEarned: 9,
      portfolioActivity: 41,
      lastActive: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
    {
      teacherId: 't006',
      teacherName: 'Fatima Al-Mazrouei',
      email: 'fatima.almazrouei@school.ae',
      subjects: ['Social Studies'],
      grades: ['6', '7'],
      cpdBadgesEarned: 7,
      portfolioActivity: 28,
      lastActive: new Date(Date.now() - 6 * 60 * 60 * 1000),
    },
    {
      teacherId: 't007',
      teacherName: 'David Wilson',
      email: 'david.wilson@school.ae',
      subjects: ['Physical Education'],
      grades: ['6', '7'],
      cpdBadgesEarned: 5,
      portfolioActivity: 19,
      lastActive: new Date(Date.now() - 8 * 60 * 60 * 1000),
    },
    {
      teacherId: 't008',
      teacherName: 'Aisha Abdullah',
      email: 'aisha.abdullah@school.ae',
      subjects: ['English Language Arts', 'Social Studies'],
      grades: ['6'],
      cpdBadgesEarned: 11,
      portfolioActivity: 52,
      lastActive: new Date(Date.now() - 1 * 60 * 60 * 1000),
    },
  ];

  private teachersSignal = signal<TeacherSubjectMatrix[]>(this.mockTeachers);

  // Available subjects
  readonly availableSubjects = [
    'All Subjects',
    'English Language Arts',
    'ICT',
    'Mathematics',
    'Science',
    'Arabic',
    'Islamic Studies',
    'Social Studies',
    'Physical Education',
  ];

  /**
   * Get complete teacher-subject matrix
   */
  getTeacherSubjectMatrix(): TeacherSubjectMatrix[] {
    return this.teachersSignal();
  }

  /**
   * Get analytics filtered by subject
   */
  getSubjectFilteredAnalytics(subject: string): SubjectAnalytics {
    const teachers = this.getTeachersBySubject(subject);
    const totalStudents = subject === 'All Subjects' ? 99 : this.getStudentCountBySubject(subject);

    return {
      subject,
      teacherCount: teachers.length,
      studentCount: totalStudents,
      portfolioCompletionRate: this.calculatePortfolioCompletion(subject),
      cpdBadgeCompletionRate: this.calculateCPDCompletion(teachers),
      resourceUsage: this.getResourceUsageBySubject(subject),
      topTeachers: this.getTopTeachersBySubject(subject, 5),
    };
  }

  /**
   * Get teachers filtered by subject
   */
  getTeachersBySubject(subject: string): TeacherSubjectMatrix[] {
    if (subject === 'All Subjects') {
      return this.teachersSignal();
    }
    return this.teachersSignal().filter((teacher) => teacher.subjects.includes(subject));
  }

  /**
   * Get resource usage statistics by subject
   */
  getResourceUsageBySubject(subject: string): ResourceUsageStats {
    const usageMap: { [key: string]: ResourceUsageStats } = {
      'English Language Arts': {
        totalResources: 45,
        downloadsThisMonth: 128,
        uploadsThisMonth: 23,
        mostPopularResource: 'Essay Writing Guide.pdf',
      },
      ICT: {
        totalResources: 38,
        downloadsThisMonth: 156,
        uploadsThisMonth: 31,
        mostPopularResource: 'Python Basics Tutorial.mp4',
      },
      Mathematics: {
        totalResources: 52,
        downloadsThisMonth: 142,
        uploadsThisMonth: 19,
        mostPopularResource: 'Algebra Practice Set.pdf',
      },
      Science: {
        totalResources: 41,
        downloadsThisMonth: 134,
        uploadsThisMonth: 27,
        mostPopularResource: 'Lab Safety Checklist.pdf',
      },
      'All Subjects': {
        totalResources: 245,
        downloadsThisMonth: 689,
        uploadsThisMonth: 127,
        mostPopularResource: 'Digital Citizenship Guide.pdf',
      },
    };

    return (
      usageMap[subject] || {
        totalResources: 0,
        downloadsThisMonth: 0,
        uploadsThisMonth: 0,
        mostPopularResource: 'N/A',
      }
    );
  }

  /**
   * Get top performing teachers by subject
   */
  getTopTeachersBySubject(subject: string, limit: number = 5): TeacherPerformance[] {
    const teachers = this.getTeachersBySubject(subject);

    return teachers
      .map((teacher) => ({
        teacherName: teacher.teacherName,
        subject: teacher.subjects.join(', '),
        cpdBadges: teacher.cpdBadgesEarned,
        studentEngagement: Math.round((teacher.portfolioActivity / 67) * 100), // Relative to max
        portfolioReviews: teacher.portfolioActivity,
      }))
      .sort((a, b) => b.cpdBadges - a.cpdBadges)
      .slice(0, limit);
  }

  /**
   * Export evidence by subject and date range
   */
  exportEvidenceBySubject(request: EvidenceExportRequest): Blob {
    // In production, this would generate actual files
    const data = {
      request,
      exportDate: new Date(),
      message: 'Evidence export functionality - Backend integration required',
    };

    const jsonData = JSON.stringify(data, null, 2);
    return new Blob([jsonData], { type: 'application/json' });
  }

  /**
   * Get CPD completion rate for a subject
   */
  getCPDCompletionBySubject(subject: string): number {
    const teachers = this.getTeachersBySubject(subject);
    if (teachers.length === 0) return 0;

    const avgBadges = teachers.reduce((sum, t) => sum + t.cpdBadgesEarned, 0) / teachers.length;
    const maxBadges = 15; // Assuming max 15 CPD badges available
    return Math.round((avgBadges / maxBadges) * 100);
  }

  // Private helper methods
  private getStudentCountBySubject(subject: string): number {
    const countMap: { [key: string]: number } = {
      'English Language Arts': 78,
      ICT: 71,
      Mathematics: 67,
      Science: 64,
      Arabic: 49,
      'Islamic Studies': 44,
      'Social Studies': 38,
      'Physical Education': 23,
    };
    return countMap[subject] || 0;
  }

  private calculatePortfolioCompletion(subject: string): number {
    const completionMap: { [key: string]: number } = {
      'English Language Arts': 85,
      ICT: 78,
      Mathematics: 72,
      Science: 68,
      Arabic: 65,
      'Islamic Studies': 62,
      'Social Studies': 58,
      'Physical Education': 45,
      'All Subjects': 71,
    };
    return completionMap[subject] || 0;
  }

  private calculateCPDCompletion(teachers: TeacherSubjectMatrix[]): number {
    if (teachers.length === 0) return 0;
    const avgBadges = teachers.reduce((sum, t) => sum + t.cpdBadgesEarned, 0) / teachers.length;
    const maxBadges = 15;
    return Math.round((avgBadges / maxBadges) * 100);
  }
}
