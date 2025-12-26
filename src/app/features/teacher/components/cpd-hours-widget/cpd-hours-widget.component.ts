import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CpdService } from '../../services/cpd.service';
import { CpdHoursSummary } from '../../../student/models/learning-hours.model';

@Component({
  selector: 'app-cpd-hours-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cpd-hours-widget.component.html',
  styleUrls: ['./cpd-hours-widget.component.css']
})
export class CpdHoursWidgetComponent implements OnInit {
  cpdHours = signal<CpdHoursSummary | null>(null);
  isLoading = signal(true);

  constructor(private cpdService: CpdService) {}

  ngOnInit(): void {
    this.loadCpdHours();
  }

  loadCpdHours(): void {
    this.isLoading.set(true);
    this.cpdService.getCpdHoursSummary().subscribe({
      next: (data) => {
        if (data) {
          this.cpdHours.set(data);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load CPD hours:', err);
        this.isLoading.set(false);
      }
    });
  }

  exportCertificate(): void {
    this.cpdService.exportCpdCertificate().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `CPD-Certificate-${new Date().getFullYear()}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Failed to export certificate:', err);
      }
    });
  }

  getProgressColor(): string {
    const progress = this.cpdHours()?.progressPercentage || 0;
    if (progress >= 100) return 'text-green-600';
    if (progress >= 75) return 'text-blue-600';
    if (progress >= 50) return 'text-yellow-600';
    return 'text-orange-600';
  }

  getProgressBarColor(): string {
    const progress = this.cpdHours()?.progressPercentage || 0;
    if (progress >= 100) return 'bg-green-600';
    if (progress >= 75) return 'bg-blue-600';
    if (progress >= 50) return 'bg-yellow-600';
    return 'bg-orange-600';
  }
}

