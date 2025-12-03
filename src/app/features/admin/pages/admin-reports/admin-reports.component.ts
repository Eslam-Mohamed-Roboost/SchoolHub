import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface ReportType {
  id: string;
  name: string;
  icon: string;
  description: string;
  route?: string;
}

interface ReportParameters {
  dateFrom: Date;
  dateTo: Date;
  userType: 'All' | 'Teachers' | 'Students';
  includeCharts: boolean;
}

@Component({
  selector: 'app-admin-reports',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-reports.component.html',
  styleUrl: './admin-reports.component.css',
})
export class AdminReportsComponent {
  selectedReport = signal<string | null>(null);

  // Report parameters
  parameters = signal<ReportParameters>({
    dateFrom: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    dateTo: new Date(),
    userType: 'All',
    includeCharts: true,
  });

  // Available reports
  reports: ReportType[] = [
    {
      id: 'cpd',
      name: 'CPD Progress Report',
      icon: '📚',
      description:
        'Teacher professional development summary with CPD hours, badges, and participation rates',
      route: '/admin/cpd',
    },
    {
      id: 'student-engagement',
      name: 'Student Engagement Report',
      icon: '🎓',
      description:
        'Mission completion rates, badge earnings, and activity levels by class and student',
      route: '/admin/analytics',
    },
    {
      id: 'resource-usage',
      name: 'Resource Usage Report',
      icon: '📂',
      description: 'Most downloaded resources, category breakdown, and usage trends over time',
      route: '/admin/analytics',
    },
    {
      id: 'badge-analytics',
      name: 'Badge Analytics Report',
      icon: '🏆',
      description:
        'Badge distribution by category, submission trends, and top earners across all users',
      route: '/admin/analytics',
    },
    {
      id: 'login-activity',
      name: 'Login Activity Report',
      icon: '🔐',
      description:
        'User access patterns, login frequency, peak usage times, and engagement metrics',
      route: '/admin/analytics',
    },
  ];

  userTypes: Array<'All' | 'Teachers' | 'Students'> = ['All', 'Teachers', 'Students'];

  selectReport(reportId: string) {
    this.selectedReport.set(reportId);
  }

  getSelectedReportInfo() {
    const id = this.selectedReport();
    return this.reports.find((r) => r.id === id) || null;
  }

  updateParameter(field: keyof ReportParameters, value: any) {
    this.parameters.update((params) => ({
      ...params,
      [field]: value,
    }));
  }

  generateReport() {
    const report = this.getSelectedReportInfo();
    if (!report) return;

    console.log('Generating report:', report.name);
    console.log('Parameters:', this.parameters());

    // In a real app, this would call a service to generate the report
    alert(
      `Generating ${
        report.name
      }...\nDate Range: ${this.parameters().dateFrom.toLocaleDateString()} - ${this.parameters().dateTo.toLocaleDateString()}\nUser Type: ${
        this.parameters().userType
      }\nInclude Charts: ${this.parameters().includeCharts}`
    );
  }

  exportReport(format: 'excel' | 'pdf') {
    const report = this.getSelectedReportInfo();
    if (!report) return;

    console.log(`Exporting ${report.name} as ${format.toUpperCase()}`);
    alert(`Exporting ${report.name} to ${format.toUpperCase()}...`);
  }

  scheduleReport() {
    const report = this.getSelectedReportInfo();
    if (!report) return;

    console.log('Scheduling report:', report.name);
    alert('Report scheduling feature will be available soon.');
  }

  clearSelection() {
    this.selectedReport.set(null);
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  onDateChange(field: 'dateFrom' | 'dateTo', value: string) {
    this.updateParameter(field, new Date(value));
  }
}
