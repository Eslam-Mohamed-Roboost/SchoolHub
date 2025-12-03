import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { BadgeService } from '../../services/badge.service';

interface TeacherCPD {
  id: string;
  name: string;
  email: string;
  badgeCount: number;
  cpdHours: number;
  lastBadgeDate: Date;
  categories: string[];
}

interface CPDStats {
  totalTeachers: number;
  activeTeachers: number;
  totalCPDHours: number;
  averageHoursPerTeacher: number;
  topPerformer: string;
  topPerformerHours: number;
}

@Component({
  selector: 'app-admin-cpd',
  imports: [CommonModule],
  templateUrl: './admin-cpd.component.html',
  styleUrl: './admin-cpd.component.css',
})
export class AdminCpdComponent {
  private userService = inject(UserService);
  private badgeService = inject(BadgeService);

  // Data
  teachers = computed(() =>
    this.userService
      .getUsers()()
      .filter((u) => u.role === 'Teacher')
  );
  badgeSubmissions = this.badgeService.getSubmissions();

  // Teacher CPD data
  teacherCPDData = computed(() => this.calculateTeacherCPD());

  // Stats
  cpdStats = computed(() => this.calculateStats());

  // Charts data
  cpdByMonth = computed(() => this.calculateCPDByMonth());
  badgesByCategory = computed(() => this.badgeService.getBadgesByCategory());
  teacherParticipation = computed(() => this.calculateParticipation());

  // Filters
  dateRange = signal<{ from: Date; to: Date }>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 12)),
    to: new Date(),
  });

  sortColumn = signal<string>('cpdHours');
  sortDirection = signal<'asc' | 'desc'>('desc');

  // Sorted teachers
  sortedTeachers = computed(() => {
    const data = [...this.teacherCPDData()];
    const column = this.sortColumn();
    const direction = this.sortDirection();

    data.sort((a, b) => {
      let aVal: any = a[column as keyof TeacherCPD];
      let bVal: any = b[column as keyof TeacherCPD];

      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    return data;
  });

  private calculateTeacherCPD(): TeacherCPD[] {
    const teachers = this.teachers();
    const submissions = this.badgeSubmissions();

    return teachers.map((teacher) => {
      const teacherSubmissions = submissions.filter(
        (s) => s.userId === teacher.id && s.status === 'Approved'
      );

      const cpdHours = teacherSubmissions.reduce((sum, s) => sum + (s.cpdHours || 0), 0);
      const categories = [...new Set(teacherSubmissions.map((s) => s.badgeCategory))];
      const lastBadgeDate =
        teacherSubmissions.length > 0
          ? new Date(Math.max(...teacherSubmissions.map((s) => s.submissionDate.getTime())))
          : new Date(0);

      return {
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
        badgeCount: teacherSubmissions.length,
        cpdHours,
        lastBadgeDate,
        categories,
      };
    });
  }

  private calculateStats(): CPDStats {
    const teacherData = this.teacherCPDData();
    const activeTeachers = teacherData.filter((t) => t.badgeCount > 0);
    const totalCPDHours = teacherData.reduce((sum, t) => sum + t.cpdHours, 0);

    const topPerformer = teacherData.reduce((max, t) => (t.cpdHours > max.cpdHours ? t : max), {
      cpdHours: 0,
      name: 'N/A',
    });

    return {
      totalTeachers: teacherData.length,
      activeTeachers: activeTeachers.length,
      totalCPDHours,
      averageHoursPerTeacher:
        teacherData.length > 0 ? Math.round(totalCPDHours / teacherData.length) : 0,
      topPerformer: topPerformer.name,
      topPerformerHours: topPerformer.cpdHours,
    };
  }

  private calculateCPDByMonth(): { month: string; hours: number }[] {
    const submissions = this.badgeSubmissions().filter(
      (s) => s.status === 'Approved' && s.userRole === 'Teacher'
    );

    const monthlyData = new Map<string, number>();
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    // Initialize last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const key = `${months[date.getMonth()]} ${date.getFullYear()}`;
      monthlyData.set(key, 0);
    }

    // Add CPD hours
    submissions.forEach((s) => {
      const date = new Date(s.submissionDate);
      const key = `${months[date.getMonth()]} ${date.getFullYear()}`;
      if (monthlyData.has(key)) {
        monthlyData.set(key, monthlyData.get(key)! + (s.cpdHours || 0));
      }
    });

    return Array.from(monthlyData.entries()).map(([month, hours]) => ({ month, hours }));
  }

  private calculateParticipation(): { active: number; inactive: number } {
    const teacherData = this.teacherCPDData();
    const active = teacherData.filter((t) => t.badgeCount > 0).length;
    const inactive = teacherData.length - active;

    return { active, inactive };
  }

  // Actions
  sortBy(column: string) {
    if (this.sortColumn() === column) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('desc');
    }
  }

  exportToExcel() {
    const teachers = this.sortedTeachers();
    const csv = this.convertToCSV(teachers);
    this.downloadFile(csv, 'cpd-report.csv', 'text/csv');
  }

  exportToPDF() {
    console.log('Export to PDF functionality - to be implemented with PDF library');
    alert('PDF export will be available soon. Use Excel export for now.');
  }

  emailToTeachers() {
    console.log('Email to teachers functionality');
    alert('Email functionality will send this report to selected teachers.');
  }

  private convertToCSV(teachers: TeacherCPD[]): string {
    const headers = ['Name', 'Email', 'Badge Count', 'CPD Hours', 'Last Badge Date', 'Categories'];
    const rows = teachers.map((t) => [
      t.name,
      t.email,
      t.badgeCount.toString(),
      t.cpdHours.toString(),
      t.lastBadgeDate.toLocaleDateString(),
      t.categories.join('; '),
    ]);

    return [headers.join(','), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(','))].join(
      '\n'
    );
  }

  private downloadFile(content: string, filename: string, type: string) {
    const blob = new Blob([content], { type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  formatDate(date: Date): string {
    if (date.getTime() === 0) return 'Never';
    return new Date(date).toLocaleDateString();
  }

  getMaxChartValue(data: { hours: number }[]): number {
    return Math.max(...data.map((d) => d.hours), 10);
  }

  getBarWidth(value: number, max: number): number {
    return (value / max) * 100;
  }
}
