import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentProgressService } from '../../services/student-progress.service';
import { LearningHoursSummary } from '../../models/learning-hours.model';

@Component({
  selector: 'app-learning-hours-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './learning-hours-widget.component.html',
  styleUrls: ['./learning-hours-widget.component.css']
})
export class LearningHoursWidgetComponent implements OnInit {
  learningHours = signal<LearningHoursSummary | null>(null);
  isLoading = signal(true);

  constructor(private progressService: StudentProgressService) {}

  ngOnInit(): void {
    this.loadLearningHours();
  }

  loadLearningHours(): void {
    this.isLoading.set(true);
    this.progressService.getLearningHours().subscribe({
      next: (data) => {
        this.learningHours.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load learning hours:', err);
        this.isLoading.set(false);
      }
    });
  }

  getActivityTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      'Mission': '🎯',
      'Challenge': '⚡',
      'Portfolio': '📚',
      'Completion': '✅',
      'Other': '📝'
    };
    return icons[type] || '📝';
  }

  getActivityTypeColor(type: string): string {
    const colors: Record<string, string> = {
      'Mission': 'text-blue-600',
      'Challenge': 'text-purple-600',
      'Portfolio': 'text-green-600',
      'Completion': 'text-yellow-600',
      'Other': 'text-gray-600'
    };
    return colors[type] || 'text-gray-600';
  }
}

