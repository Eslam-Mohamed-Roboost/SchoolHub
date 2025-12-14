import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CpdService, TeacherCPD, CPDStats } from '../../services/cpd.service';
import { BadgeService } from '../../services/badge.service';

@Component({
  selector: 'app-admin-cpd',
  imports: [CommonModule],
  templateUrl: './admin-cpd.component.html',
  styleUrl: './admin-cpd.component.css',
})
export class AdminCpdComponent implements OnInit {
  private cpdService = inject(CpdService);
  private badgeService = inject(BadgeService);

  ngOnInit(): void {
    // Initialize services to load data from API
    this.cpdService.init();
    this.badgeService.init();
  }

  // Loading state
  isLoading = computed(() => this.cpdService.getIsLoading()());

  // Data from API
  teacherCPDData = this.cpdService.getTeacherProgress();
  cpdStats = this.cpdService.getStatistics();
  cpdByMonth = this.cpdService.getCpdByMonth();
  badgesByCategory = this.badgeService.getBadgesByCategory();

  // Participation calculated from teacher data
  teacherParticipation = computed(() => {
    const teachers = this.teacherCPDData();
    const active = teachers.filter((t) => t.badgeCount > 0).length;
    const inactive = teachers.length - active;
    return { active, inactive };
  });

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
      const aVal = a[column as keyof TeacherCPD];
      const bVal = b[column as keyof TeacherCPD];

      if (aVal === undefined || bVal === undefined) return 0;
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    return data;
  });

  // Actions
  sortBy(column: string) {
    if (this.sortColumn() === column) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('desc');
    }
    // Reload with new sort from API
    this.cpdService.loadTeacherProgress(column, this.sortDirection());
  }

  exportToExcel() {
    this.cpdService.exportCpdReport('excel', this.dateRange().from, this.dateRange().to).subscribe({
      next: (blob) => {
        // Check if blob is valid
        if (blob && blob.size > 0) {
          // Check if it's actually a blob and not an error response
          if (blob.type === 'application/json') {
            console.error('Received JSON instead of Excel file - API may not be implemented');
            alert(
              'Export API endpoint is not yet implemented on the backend. Please contact the administrator.'
            );
            return;
          }
          this.downloadFile(blob, `cpd-report-${new Date().toISOString().split('T')[0]}.xlsx`);
        } else {
          console.error('Received empty blob');
          alert('Export failed - received empty file. Please try again.');
        }
      },
      error: (err) => {
        console.error('Failed to export Excel:', err);
        alert(
          `Failed to generate Excel export: ${
            err.message || 'Unknown error'
          }. The API endpoint may not be implemented yet.`
        );
      },
    });
  }

  exportToPDF() {
    this.cpdService.exportCpdReport('pdf', this.dateRange().from, this.dateRange().to).subscribe({
      next: (blob) => {
        // Check if blob is valid
        if (blob && blob.size > 0) {
          // Check if it's actually a blob and not an error response
          if (blob.type === 'application/json') {
            console.error('Received JSON instead of PDF file - API may not be implemented');
            alert(
              'Export API endpoint is not yet implemented on the backend. Please contact the administrator.'
            );
            return;
          }
          this.downloadFile(blob, `cpd-report-${new Date().toISOString().split('T')[0]}.pdf`);
        } else {
          console.error('Received empty blob');
          alert('Export failed - received empty file. Please try again.');
        }
      },
      error: (err) => {
        console.error('Failed to export PDF:', err);
        alert(
          `Failed to generate PDF export: ${
            err.message || 'Unknown error'
          }. The API endpoint may not be implemented yet.`
        );
      },
    });
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

    return [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');
  }

  private downloadFile(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  formatDate(date: Date): string {
    if (!date || date.getTime() === 0) return 'Never';
    return new Date(date).toLocaleDateString();
  }

  getMaxChartValue(data: { hours: number }[]): number {
    if (!data || data.length === 0) return 10;
    return Math.max(...data.map((d) => d.hours), 10);
  }

  getBarWidth(value: number, max: number): number {
    if (max === 0) return 0;
    return (value / max) * 100;
  }
}
