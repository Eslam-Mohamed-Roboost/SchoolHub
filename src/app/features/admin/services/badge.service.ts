import { Injectable, signal } from '@angular/core';
import { BadgeSubmission, Badge, BadgeStatus } from '../models/admin.models';
import { ApplicationRole } from '../../../core/enums/application-role.enum';

@Injectable({
  providedIn: 'root',
})
export class BadgeService {
  private submissions = signal<BadgeSubmission[]>(this.generateMockSubmissions());
  private badges = signal<Badge[]>(this.generateMockBadges());

  getSubmissions() {
    return this.submissions.asReadonly();
  }

  getPendingSubmissions(): BadgeSubmission[] {
    return this.submissions().filter((s) => s.status === 'Pending');
  }

  getPendingTeacherSubmissions(): BadgeSubmission[] {
    return this.submissions().filter(
      (s) => s.status === 'Pending' && s.userRole === ApplicationRole.Teacher
    );
  }

  getPendingStudentSubmissions(): BadgeSubmission[] {
    return this.submissions().filter(
      (s) => s.status === 'Pending' && s.userRole === ApplicationRole.Student
    );
  }

  approveSubmission(id: string, reviewedBy: string, notes?: string): BadgeSubmission | null {
    const index = this.submissions().findIndex((s) => s.id === id);
    if (index === -1) return null;

    const updated = [...this.submissions()];
    updated[index] = {
      ...updated[index],
      status: 'Approved' as BadgeStatus,
      reviewedBy,
      reviewDate: new Date(),
      reviewNotes: notes,
    };
    this.submissions.set(updated);
    return updated[index];
  }

  rejectSubmission(id: string, reviewedBy: string, notes: string): BadgeSubmission | null {
    const index = this.submissions().findIndex((s) => s.id === id);
    if (index === -1) return null;

    const updated = [...this.submissions()];
    updated[index] = {
      ...updated[index],
      status: 'Rejected' as BadgeStatus,
      reviewedBy,
      reviewDate: new Date(),
      reviewNotes: notes,
    };
    this.submissions.set(updated);
    return updated[index];
  }

  getSubmissionById(id: string): BadgeSubmission | undefined {
    return this.submissions().find((s) => s.id === id);
  }

  filterSubmissions(
    dateFrom?: Date,
    dateTo?: Date,
    status?: BadgeStatus,
    category?: string,
    userType?: ApplicationRole
  ): BadgeSubmission[] {
    return this.submissions().filter((submission) => {
      const matchesDate =
        (!dateFrom || submission.submissionDate >= dateFrom) &&
        (!dateTo || submission.submissionDate <= dateTo);
      const matchesStatus = !status || submission.status === status;
      const matchesCategory = !category || submission.badgeCategory === category;
      const matchesUserType = !userType || submission.userRole === userType;

      return matchesDate && matchesStatus && matchesCategory && matchesUserType;
    });
  }

  getBadgeStatistics() {
    const submissions = this.submissions();
    const total = submissions.length;
    const approved = submissions.filter((s) => s.status === 'Approved').length;
    const rejected = submissions.filter((s) => s.status === 'Rejected').length;
    const pending = submissions.filter((s) => s.status === 'Pending').length;

    return {
      total,
      approved,
      rejected,
      pending,
      approvalRate: total > 0 ? Math.round((approved / total) * 100) : 0,
      rejectionRate: total > 0 ? Math.round((rejected / total) * 100) : 0,
    };
  }

  getBadgesByCategory(): { category: string; count: number }[] {
    const submissions = this.submissions();
    const categoryMap = new Map<string, number>();

    submissions.forEach((s) => {
      categoryMap.set(s.badgeCategory, (categoryMap.get(s.badgeCategory) || 0) + 1);
    });

    return Array.from(categoryMap.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);
  }

  private generateMockBadges(): Badge[] {
    return [
      {
        id: 'badge-1',
        name: 'Eduaide Explorer',
        category: 'AI Tools',
        icon: '🤖',
        cpdHours: 2,
        description: 'Master Eduaide AI tool',
      },
      {
        id: 'badge-2',
        name: 'Curipod Creator',
        category: 'AI Tools',
        icon: '🎨',
        cpdHours: 2,
        description: 'Create interactive lessons with Curipod',
      },
      {
        id: 'badge-3',
        name: 'Diffit Designer',
        category: 'AI Tools',
        icon: '📚',
        cpdHours: 2,
        description: 'Differentiate content with Diffit',
      },
      {
        id: 'badge-4',
        name: 'MagicSchool Wizard',
        category: 'AI Tools',
        icon: '✨',
        cpdHours: 2,
        description: 'Leverage MagicSchool AI',
      },
      {
        id: 'badge-5',
        name: 'Teams Expert',
        category: 'Microsoft 365',
        icon: '💼',
        cpdHours: 3,
        description: 'Advanced Microsoft Teams skills',
      },
      {
        id: 'badge-6',
        name: 'OneNote Master',
        category: 'Microsoft 365',
        icon: '📓',
        cpdHours: 2,
        description: 'Digital notebook mastery',
      },
      {
        id: 'badge-7',
        name: 'Digital Citizen',
        category: 'Digital Citizenship',
        icon: '🌐',
        description: 'Complete digital citizenship course',
      },
      {
        id: 'badge-8',
        name: 'Online Safety',
        category: 'Digital Citizenship',
        icon: '🛡️',
        description: 'Understand online safety',
      },
    ];
  }

  private generateMockSubmissions(): BadgeSubmission[] {
    const submissions: BadgeSubmission[] = [];
    const badges = this.generateMockBadges();
    const statuses: BadgeStatus[] = ['Pending', 'Approved', 'Rejected'];

    // Generate 127 mock submissions
    for (let i = 1; i <= 127; i++) {
      const badge = badges[Math.floor(Math.random() * badges.length)];
      const isTeacher = i <= 85;
      const status = i <= 5 ? 'Pending' : statuses[Math.floor(Math.random() * statuses.length)];

      submissions.push({
        id: `submission-${i}`,
        userId: isTeacher ? `teacher-${Math.floor(i / 2) + 1}` : `student-${i - 85}`,
        userName: isTeacher ? `Teacher ${Math.floor(i / 2) + 1}` : `Student ${i - 85}`,
        userRole: isTeacher ? ApplicationRole.Teacher : ApplicationRole.Student,
        userAvatar: `https://ui-avatars.com/api/?name=${isTeacher ? 'Teacher' : 'Student'}+${
          isTeacher ? Math.floor(i / 2) + 1 : i - 85
        }&background=random`,
        badgeId: badge.id,
        badgeName: badge.name,
        badgeIcon: badge.icon,
        badgeCategory: badge.category,
        cpdHours: isTeacher ? badge.cpdHours : undefined,
        evidenceLink: `https://example.com/evidence/${i}`,
        submitterNotes: i % 3 === 0 ? 'Completed with excellent results' : undefined,
        submissionDate: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
        status,
        reviewedBy: status !== 'Pending' ? 'Rahmah' : undefined,
        reviewDate:
          status !== 'Pending'
            ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
            : undefined,
        reviewNotes: status === 'Rejected' ? 'Please provide more detailed evidence' : undefined,
      });
    }

    return submissions.sort((a, b) => b.submissionDate.getTime() - a.submissionDate.getTime());
  }
}
