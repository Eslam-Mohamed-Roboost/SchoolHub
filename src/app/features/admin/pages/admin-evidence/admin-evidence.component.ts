import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvidenceService } from '../../services/evidence.service';
import { EvidenceExportRequest } from '../../models/admin-analytics.model';

@Component({
  selector: 'app-admin-evidence',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-evidence.component.html',
  styleUrl: './admin-evidence.component.css',
})
export class AdminEvidenceComponent implements OnInit {
  // Force recompile
  private evidenceService = inject(EvidenceService);

  // Signals
  stats = this.evidenceService.getStats();
  isLoading = this.evidenceService.getIsLoading();

  // Form State
  dateRange = signal<string>('30');
  exportFormat = signal<'excel' | 'pdf' | 'zip'>('excel');
  selectedTypes = signal<('portfolios' | 'cpd' | 'badges')[]>(['portfolios', 'cpd', 'badges']);
  isExporting = signal(false);

  ngOnInit(): void {
    this.evidenceService.init();
  }

  // Actions
  updateDateRange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.dateRange.set(select.value);
  }

  updateFormat(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.exportFormat.set(select.value as 'excel' | 'pdf' | 'zip');
  }

  toggleType(type: 'portfolios' | 'cpd' | 'badges'): void {
    this.selectedTypes.update((types) => {
      if (types.includes(type)) {
        return types.filter((t) => t !== type);
      }
      return [...types, type];
    });
  }

  onExport(event: Event): void {
    event.preventDefault();
    if (this.selectedTypes().length === 0) {
      alert('Please select at least one evidence type.');
      return;
    }

    this.isExporting.set(true);

    const endDate = new Date();
    const startDate = new Date();

    if (this.dateRange() !== 'all') {
      startDate.setDate(endDate.getDate() - parseInt(this.dateRange()));
    } else {
      startDate.setFullYear(2020); // Arbitrary past date for "all time"
    }

    const request: EvidenceExportRequest = {
      dateRange: {
        start: startDate,
        end: endDate,
      },
      subjects: [], // Empty means all subjects
      evidenceTypes: this.selectedTypes(),
      format: this.exportFormat(),
    };

    this.evidenceService.exportEvidence(request).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `evidence-export-${this.exportFormat()}-${
          new Date().toISOString().split('T')[0]
        }.${this.getExtension()}`;
        link.click();
        window.URL.revokeObjectURL(url);
        this.isExporting.set(false);
      },
      error: (err) => {
        console.error('Export failed:', err);
        alert('Failed to generate export. Please try again.');
        this.isExporting.set(false);
      },
    });
  }

  private getExtension(): string {
    switch (this.exportFormat()) {
      case 'excel':
        return 'xlsx';
      case 'pdf':
        return 'pdf';
      case 'zip':
        return 'zip';
      default:
        return 'dat';
    }
  }
}
