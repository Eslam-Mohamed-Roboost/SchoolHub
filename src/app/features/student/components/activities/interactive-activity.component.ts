import { Component, input, output, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MissionActivityDto } from '../../models/student-api.models';

@Component({
  selector: 'app-interactive-activity',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="interactive-activity">
      <div class="interactive-header">
        <h2>{{ activity().Title }}</h2>
        <p class="interactive-description">{{ activity().Content }}</p>
      </div>

      <div class="interactive-placeholder">
        <div class="placeholder-icon">
          <i class="fas fa-gamepad fa-4x"></i>
        </div>
        <h3>Interactive Activity</h3>
        <p>
          This is a placeholder for interactive activities such as:
          drag-and-drop exercises, matching games, simulations, and more.
        </p>
        <div class="features-list">
          <div class="feature-item">
            <i class="fas fa-puzzle-piece"></i>
            <span>Drag & Drop</span>
          </div>
          <div class="feature-item">
            <i class="fas fa-arrows-alt"></i>
            <span>Matching</span>
          </div>
          <div class="feature-item">
            <i class="fas fa-mouse-pointer"></i>
            <span>Click & Sort</span>
          </div>
          <div class="feature-item">
            <i class="fas fa-code"></i>
            <span>Coding Challenges</span>
          </div>
        </div>
        
        <button 
          type="button" 
          class="btn-simulate"
          (click)="simulateCompletion()"
          [disabled]="completed()"
        >
          {{ completed() ? '✓ Completed' : 'Simulate Completion' }}
        </button>
      </div>

      @if (completed()) {
        <div class="completion-notice" role="status">
          <i class="fas fa-check-circle"></i>
          <span>Great job! You can now mark this activity as complete.</span>
        </div>
      }
    </div>
  `,
  styles: [`
    .interactive-activity {
      width: 100%;
    }

    .interactive-header {
      margin-bottom: 2rem;
    }

    .interactive-header h2 {
      font-size: 1.75rem;
      color: #333;
      margin: 0 0 0.5rem 0;
    }

    .interactive-description {
      color: #666;
      font-size: 1rem;
      margin: 0;
    }

    .interactive-placeholder {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 3rem 2rem;
      border-radius: 16px;
      text-align: center;
      color: white;
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
    }

    .placeholder-icon {
      margin-bottom: 1.5rem;
      opacity: 0.9;
    }

    .interactive-placeholder h3 {
      font-size: 2rem;
      margin: 0 0 1rem 0;
      font-weight: 600;
    }

    .interactive-placeholder > p {
      font-size: 1.1rem;
      margin: 0 auto 2rem;
      max-width: 600px;
      opacity: 0.95;
      line-height: 1.6;
    }

    .features-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
      max-width: 700px;
      margin: 2rem auto;
    }

    .feature-item {
      background: rgba(255, 255, 255, 0.15);
      padding: 1.25rem;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      transition: all 0.3s;
    }

    .feature-item:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: translateY(-3px);
    }

    .feature-item i {
      font-size: 2rem;
      opacity: 0.9;
    }

    .feature-item span {
      font-weight: 500;
      font-size: 0.95rem;
    }

    .btn-simulate {
      margin-top: 1.5rem;
      padding: 0.875rem 2.5rem;
      font-size: 1rem;
      font-weight: 600;
      background: white;
      color: #667eea;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-simulate:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .btn-simulate:disabled {
      background: #28a745;
      color: white;
      cursor: not-allowed;
    }

    .completion-notice {
      margin-top: 1.5rem;
      padding: 1rem 1.5rem;
      background: #d4edda;
      border: 1px solid #c3e6cb;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: #155724;
    }

    .completion-notice i {
      font-size: 1.25rem;
      color: #28a745;
    }

    @media (max-width: 768px) {
      .interactive-header h2 {
        font-size: 1.5rem;
      }

      .interactive-placeholder {
        padding: 2rem 1.5rem;
      }

      .interactive-placeholder h3 {
        font-size: 1.5rem;
      }

      .features-list {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class InteractiveActivityComponent {
  activity = input.required<MissionActivityDto>();
  completionOutput = output<void>();
  
  completed = signal(false);

  simulateCompletion(): void {
    // Simulate completing an interactive activity
    this.completed.set(true);
  }
}

