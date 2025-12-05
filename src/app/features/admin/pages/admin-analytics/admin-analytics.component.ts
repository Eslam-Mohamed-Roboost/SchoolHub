import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherSubjectAnalyticsService } from '../../services/teacher-subject-analytics.service';
import { TeacherSubjectMatrix } from '../../models/admin-analytics.model';

@Component({
  selector: 'app-admin-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-analytics.component.html',
  styleUrl: './admin-analytics.component.css',
})
export class AdminAnalyticsComponent implements OnInit {
  private analyticsService = inject(TeacherSubjectAnalyticsService);

  // Signals from Service
  teacherMatrix = this.analyticsService.getTeacherMatrix();
  subjectAnalytics = this.analyticsService.getSubjectAnalytics();
  availableSubjects = this.analyticsService.availableSubjects;
  isLoading = this.analyticsService.getIsLoading();
  selectedSubject = this.analyticsService.getSelectedSubject();

  // Local State
  sortColumn = signal<keyof TeacherSubjectMatrix>('cpdBadgesEarned');
  sortDirection = signal<'asc' | 'desc'>('desc');

  ngOnInit(): void {
    this.analyticsService.init();
    // Load initial analytics for "All Subjects"
    this.analyticsService.loadAnalyticsBySubject('All Subjects');
  }

  // Computed Sorted Teachers
  sortedTeachers = computed(() => {
    const matrix = this.teacherMatrix();
    const subject = this.selectedSubject();
    const column = this.sortColumn();
    const direction = this.sortDirection();

    // Filter by subject first
    let filtered = matrix;
    if (subject !== 'All Subjects') {
      filtered = matrix.filter((t) => t.subjects.includes(subject));
    }

    // Sort
    return [...filtered].sort((a, b) => {
      const aVal = a[column];
      const bVal = b[column];

      if (aVal === bVal) return 0;

      // Handle array comparisons (e.g. subjects count) if needed, but for now simple types
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      return direction === 'asc' ? (aVal > bVal ? 1 : -1) : aVal < bVal ? 1 : -1;
    });
  });

  // Actions
  onSubjectChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const subject = select.value;
    this.analyticsService.loadAnalyticsBySubject(subject);
  }

  sortBy(column: keyof TeacherSubjectMatrix): void {
    if (this.sortColumn() === column) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('desc');
    }
  }

  exportData(): void {
    const request = {
      dateRange: {
        start: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        end: new Date(),
      },
      subjects: [this.selectedSubject()],
      evidenceTypes: ['portfolios', 'cpd', 'badges'] as ('portfolios' | 'cpd' | 'badges')[],
      format: 'excel' as const,
    };

    this.analyticsService.exportEvidenceBySubject(request).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `analytics-${this.selectedSubject()}-${
        new Date().toISOString().split('T')[0]
      }.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
    });
  }

  formatDate(date: Date | string): string {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString();
  }
}
