import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../config/environment';
import { Admin_API_ENDPOINTS } from '../../../../config/AdminConfig/AdminEndpoint';

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
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

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
    if (!report) {
      alert('Please select a report first');
      return;
    }

    const params = this.parameters();
    const requestBody = {
      ReportType: report.id,
      DateFrom: params.dateFrom.toISOString(),
      DateTo: params.dateTo.toISOString(),
      UserType: params.userType,
      IncludeCharts: params.includeCharts,
      Format: format,
    };

    console.log(`Exporting ${report.name} as ${format.toUpperCase()}`);

    // Construct full URL
    const endpoint = Admin_API_ENDPOINTS.Reports.EXPORT.startsWith('/')
      ? Admin_API_ENDPOINTS.Reports.EXPORT.slice(1)
      : Admin_API_ENDPOINTS.Reports.EXPORT;
    const cleanBaseUrl = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl;
    const url = `${cleanBaseUrl}/${endpoint}`;

    this.http
      .post(url, requestBody, {
        responseType: 'blob',
      })
      .subscribe({
        next: (blob) => {
          // Validate blob
          if (blob && blob.size > 0) {
            // Check if it's actually a blob and not an error response
            if (blob.type === 'application/json' || blob.type === 'text/html') {
              console.error('Received incorrect content type - API may not be implemented');
              alert(
                'Export API endpoint is not yet implemented on the backend. Please contact the administrator.'
              );
              return;
            }

            // Download the file
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            const extension = format === 'excel' ? 'xlsx' : 'pdf';
            const filename = `${report.id}-report-${
              new Date().toISOString().split('T')[0]
            }.${extension}`;
            link.download = filename;
            link.click();
            window.URL.revokeObjectURL(downloadUrl);

            console.log(`Successfully downloaded ${filename}`);
          } else {
            console.error('Received empty blob');
            alert('Export failed - received empty file. Please try again.');
          }
        },
        error: (err) => {
          console.error('Failed to export report:', err);
          alert(
            `Failed to generate export: ${
              err.message || 'Unknown error'
            }. The API endpoint may not be implemented yet.`
          );
        },
      });
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
