import { Injectable, signal, computed } from '@angular/core';
import {
  PortfolioCompletionStats,
  ClassPortfolioStats,
  SubjectPortfolioStats,
  PortfolioUpdate,
  EvidenceCollectionStats,
} from '../models/admin-analytics.model';

@Injectable({
  providedIn: 'root',
})
export class AdminPortfolioAnalyticsService {
  // Mock data - replace with API calls in production
  private mockClassStats: ClassPortfolioStats[] = [
    {
      className: 'Grade 6A',
      grade: 6,
      totalStudents: 25,
      activePortfolios: 20,
      completionRate: 80,
    },
    {
      className: 'Grade 6B',
      grade: 6,
      totalStudents: 25,
      activePortfolios: 15,
      completionRate: 60,
    },
    {
      className: 'Grade 7A',
      grade: 7,
      totalStudents: 25,
      activePortfolios: 25,
      completionRate: 100,
    },
    {
      className: 'Grade 7B',
      grade: 7,
      totalStudents: 24,
      activePortfolios: 18,
      completionRate: 75,
    },
  ];

  private mockSubjectStats: SubjectPortfolioStats[] = [
    {
      subjectName: 'English Language Arts',
      totalSubmissions: 156,
      activeStudents: 78,
      recentActivity: 23,
    },
    { subjectName: 'ICT', totalSubmissions: 142, activeStudents: 71, recentActivity: 19 },
    { subjectName: 'Mathematics', totalSubmissions: 134, activeStudents: 67, recentActivity: 15 },
    { subjectName: 'Science', totalSubmissions: 128, activeStudents: 64, recentActivity: 12 },
    { subjectName: 'Arabic', totalSubmissions: 98, activeStudents: 49, recentActivity: 8 },
    { subjectName: 'Islamic Studies', totalSubmissions: 87, activeStudents: 44, recentActivity: 6 },
    { subjectName: 'Social Studies', totalSubmissions: 76, activeStudents: 38, recentActivity: 5 },
    {
      subjectName: 'Physical Education',
      totalSubmissions: 45,
      activeStudents: 23,
      recentActivity: 3,
    },
  ];

  private mockRecentUpdates: PortfolioUpdate[] = [
    {
      studentId: 's001',
      studentName: 'Ahmed Hassan',
      className: 'Grade 7A',
      subject: 'English Language Arts',
      updateType: 'upload',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      itemCount: 3,
    },
    {
      studentId: 's002',
      studentName: 'Fatima Ali',
      className: 'Grade 6B',
      subject: 'ICT',
      updateType: 'reflection',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      itemCount: 1,
    },
    {
      studentId: 's003',
      studentName: 'Omar Khalid',
      className: 'Grade 7B',
      subject: 'Mathematics',
      updateType: 'feedback',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      itemCount: 2,
    },
    {
      studentId: 's004',
      studentName: 'Layla Ahmed',
      className: 'Grade 6A',
      subject: 'Science',
      updateType: 'upload',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      itemCount: 4,
    },
    {
      studentId: 's005',
      studentName: 'Youssef Ibrahim',
      className: 'Grade 7A',
      subject: 'Arabic',
      updateType: 'upload',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      itemCount: 2,
    },
  ];

  // Signals for reactive data
  private classStatsSignal = signal<ClassPortfolioStats[]>(this.mockClassStats);
  private subjectStatsSignal = signal<SubjectPortfolioStats[]>(this.mockSubjectStats);
  private recentUpdatesSignal = signal<PortfolioUpdate[]>(this.mockRecentUpdates);

  // Computed values
  totalStudents = computed(() => {
    return this.classStatsSignal().reduce((sum, cls) => sum + cls.totalStudents, 0);
  });

  activePortfolios = computed(() => {
    return this.classStatsSignal().reduce((sum, cls) => sum + cls.activePortfolios, 0);
  });

  overallCompletionRate = computed(() => {
    const total = this.totalStudents();
    const active = this.activePortfolios();
    return total > 0 ? Math.round((active / total) * 100) : 0;
  });

  /**
   * Get complete portfolio completion statistics
   */
  getPortfolioCompletionStats(): PortfolioCompletionStats {
    return {
      totalStudents: this.totalStudents(),
      activePortfolios: this.activePortfolios(),
      completionRate: this.overallCompletionRate(),
      byClass: this.classStatsSignal(),
      bySubject: this.subjectStatsSignal(),
      recentUpdates: this.recentUpdatesSignal(),
    };
  }

  /**
   * Get portfolio statistics filtered by class
   */
  getPortfolioStatsByClass(className?: string): ClassPortfolioStats[] {
    if (!className) {
      return this.classStatsSignal();
    }
    return this.classStatsSignal().filter((cls) => cls.className === className);
  }

  /**
   * Get portfolio statistics filtered by subject
   */
  getPortfolioStatsBySubject(subjectName?: string): SubjectPortfolioStats[] {
    if (!subjectName) {
      return this.subjectStatsSignal();
    }
    return this.subjectStatsSignal().filter((subject) => subject.subjectName === subjectName);
  }

  /**
   * Get recent portfolio updates (last N items)
   */
  getRecentPortfolioUpdates(limit: number = 5): PortfolioUpdate[] {
    return this.recentUpdatesSignal().slice(0, limit);
  }

  /**
   * Get evidence collection statistics
   */
  getEvidenceCollectionStats(): EvidenceCollectionStats {
    const totalPortfolioItems = this.subjectStatsSignal().reduce(
      (sum, subject) => sum + subject.totalSubmissions,
      0
    );

    return {
      totalEvidenceItems: totalPortfolioItems + 245, // +245 for CPD and badges
      thisMonth: 150,
      byType: {
        portfolios: totalPortfolioItems,
        cpd: 89,
        badges: 156,
      },
      pendingReview: 12,
    };
  }

  /**
   * Get portfolio activity for a specific date range
   */
  getPortfolioActivityByDateRange(startDate: Date, endDate: Date): PortfolioUpdate[] {
    return this.recentUpdatesSignal().filter((update) => {
      return update.timestamp >= startDate && update.timestamp <= endDate;
    });
  }

  /**
   * Refresh statistics (in production, this would fetch from API)
   */
  refreshStats(): void {
    // In production, this would trigger an API call
    console.log('Refreshing portfolio statistics...');
  }
}
