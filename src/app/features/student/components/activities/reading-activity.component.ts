import { Component, input, output, signal, ChangeDetectionStrategy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MissionActivityDto } from '../../models/student-api.models';

@Component({
  selector: 'app-reading-activity',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="reading-activity">
      <div class="reading-header">
        <h2>{{ activity().Title }}</h2>
        @if (!isRead()) {
          <p class="reading-hint">📖 Read through the content below and check the box when finished.</p>
        }
      </div>

      <div class="reading-content" [innerHTML]="sanitizedContent()"></div>

      <div class="reading-confirmation">
        <label class="confirmation-checkbox">
          <input
            type="checkbox"
            [checked]="isRead()"
            (change)="toggleRead()"
            [attr.aria-label]="'Mark ' + activity().Title + ' as read'"
          />
          <span>I have read and understood this content</span>
        </label>

        @if (isRead()) {
          <div class="completion-message" role="status">
            <i class="fas fa-check-circle"></i>
            <span>Great! You can now mark this activity as complete.</span>
          </div>
        }
      </div>

      @if (estimatedTime() > 0) {
        <div class="reading-meta">
          <i class="fas fa-clock"></i>
          <span>Estimated reading time: {{ estimatedTime() }} min</span>
        </div>
      }
    </div>
  `,
  styles: [`
    .reading-activity {
      width: 100%;
    }

    .reading-header {
      margin-bottom: 1.5rem;
    }

    .reading-header h2 {
      font-size: 1.75rem;
      color: #333;
      margin: 0 0 0.75rem 0;
    }

    .reading-hint {
      color: #666;
      font-size: 0.95rem;
      margin: 0;
      padding: 0.75rem 1rem;
      background: #fff9e6;
      border-left: 3px solid #ffb900;
      border-radius: 4px;
    }

    .reading-content {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      margin-bottom: 1.5rem;
      line-height: 1.8;
      color: #333;
      font-size: 1.05rem;
    }

    .reading-content :deep(h1),
    .reading-content :deep(h2),
    .reading-content :deep(h3) {
      color: #00bcf2;
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
    }

    .reading-content :deep(p) {
      margin-bottom: 1rem;
    }

    .reading-content :deep(ul),
    .reading-content :deep(ol) {
      margin-bottom: 1rem;
      padding-left: 1.5rem;
    }

    .reading-content :deep(li) {
      margin-bottom: 0.5rem;
    }

    .reading-content :deep(strong) {
      color: #222;
      font-weight: 600;
    }

    .reading-confirmation {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 12px;
      margin-bottom: 1rem;
    }

    .confirmation-checkbox {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      font-size: 1rem;
      color: #333;
      font-weight: 500;
    }

    .confirmation-checkbox input[type="checkbox"] {
      width: 20px;
      height: 20px;
      cursor: pointer;
      accent-color: #00bcf2;
    }

    .completion-message {
      margin-top: 1rem;
      padding: 0.75rem 1rem;
      background: #d4edda;
      border: 1px solid #c3e6cb;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: #155724;
    }

    .completion-message i {
      font-size: 1.25rem;
      color: #28a745;
    }

    .reading-meta {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #666;
      font-size: 0.9rem;
    }

    .reading-meta i {
      color: #00bcf2;
    }

    @media (max-width: 768px) {
      .reading-header h2 {
        font-size: 1.5rem;
      }

      .reading-content {
        padding: 1.5rem;
        font-size: 1rem;
      }
    }
  `]
})
export class ReadingActivityComponent {
  activity = input.required<MissionActivityDto>();
  completed = output<void>();
  
  isRead = signal(false);
  sanitizedContent = signal<string>('');
  estimatedTime = signal<number>(0);

  constructor() {
    // Process content when activity changes
    effect(() => {
      const act = this.activity();
      if (act) {
        this.sanitizedContent.set(act.Content);
        this.estimatedTime.set(this.calculateReadingTime(act.Content));
      }
    });
  }

  toggleRead(): void {
    this.isRead.update(val => !val);
  }

  private calculateReadingTime(content: string): number {
    // Estimate reading time based on word count (average 200 words per minute)
    const words = content.split(/\s+/).length;
    return Math.ceil(words / 200);
  }
}

