import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="toast-container" role="region" aria-label="Notifications">
      @for (toast of toastService.currentToasts(); track toast.id) {
        <div 
          class="toast" 
          [class]="'toast-' + toast.type"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          @if (toast.type === 'badge' && toast.badge) {
            <!-- Special Badge Toast -->
            <div class="badge-toast">
              <div class="badge-animation">
                <div class="badge-icon" [style.color]="toast.badge.Color">
                  {{ toast.badge.Icon }}
                </div>
              </div>
              <div class="badge-content">
                <h4 class="toast-title">{{ toast.title }}</h4>
                <p class="badge-name">{{ toast.badge.Name }}</p>
                <p class="badge-description">{{ toast.badge.Description }}</p>
              </div>
            </div>
          } @else {
            <!-- Regular Toast -->
            <div class="toast-content">
              <div class="toast-icon">
                @switch (toast.type) {
                  @case ('success') { <i class="fas fa-check-circle"></i> }
                  @case ('error') { <i class="fas fa-exclamation-circle"></i> }
                  @case ('warning') { <i class="fas fa-exclamation-triangle"></i> }
                  @case ('info') { <i class="fas fa-info-circle"></i> }
                }
              </div>
              <div class="toast-message">
                <h4 class="toast-title">{{ toast.title }}</h4>
                <p class="toast-text">{{ toast.message }}</p>
              </div>
            </div>
          }
          
          <button 
            type="button" 
            class="toast-close"
            (click)="toastService.remove(toast.id)"
            [attr.aria-label]="'Close ' + toast.title"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 80px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-width: 400px;
      pointer-events: none;
    }

    .toast {
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      padding: 1.25rem;
      display: flex;
      gap: 1rem;
      align-items: flex-start;
      position: relative;
      pointer-events: all;
      animation: slideIn 0.3s ease-out;
      border-left: 4px solid #ccc;
    }

    @keyframes slideIn {
      from {
        transform: translateX(120%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .toast-success {
      border-left-color: #28a745;
    }

    .toast-error {
      border-left-color: #dc3545;
    }

    .toast-warning {
      border-left-color: #ffc107;
    }

    .toast-info {
      border-left-color: #17a2b8;
    }

    .toast-badge {
      border-left-color: #ffb900;
      background: linear-gradient(135deg, #fff9e6 0%, #ffffff 100%);
    }

    .toast-content {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
      flex: 1;
    }

    .toast-icon {
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .toast-success .toast-icon {
      color: #28a745;
    }

    .toast-error .toast-icon {
      color: #dc3545;
    }

    .toast-warning .toast-icon {
      color: #ffc107;
    }

    .toast-info .toast-icon {
      color: #17a2b8;
    }

    .toast-message {
      flex: 1;
    }

    .toast-title {
      font-size: 1rem;
      font-weight: 600;
      color: #333;
      margin: 0 0 0.25rem 0;
    }

    .toast-text {
      font-size: 0.9rem;
      color: #666;
      margin: 0;
      line-height: 1.4;
    }

    .toast-close {
      background: none;
      border: none;
      color: #999;
      cursor: pointer;
      padding: 0.25rem;
      font-size: 1rem;
      line-height: 1;
      transition: color 0.2s;
      flex-shrink: 0;
    }

    .toast-close:hover {
      color: #333;
    }

    /* Badge Toast Styles */
    .badge-toast {
      display: flex;
      gap: 1.25rem;
      align-items: center;
      flex: 1;
    }

    .badge-animation {
      flex-shrink: 0;
    }

    .badge-icon {
      font-size: 3.5rem;
      animation: badgeBounce 0.6s ease-out;
    }

    @keyframes badgeBounce {
      0%, 100% {
        transform: scale(1);
      }
      25% {
        transform: scale(1.2);
      }
      50% {
        transform: scale(0.95);
      }
      75% {
        transform: scale(1.05);
      }
    }

    .badge-content {
      flex: 1;
    }

    .badge-name {
      font-size: 1.1rem;
      font-weight: 700;
      color: #ffb900;
      margin: 0.25rem 0 0.5rem 0;
    }

    .badge-description {
      font-size: 0.9rem;
      color: #666;
      margin: 0;
      line-height: 1.4;
    }

    @media (max-width: 768px) {
      .toast-container {
        top: 10px;
        right: 10px;
        left: 10px;
        max-width: none;
      }

      .toast {
        padding: 1rem;
      }

      .badge-icon {
        font-size: 2.5rem;
      }
    }
  `]
})
export class ToastContainerComponent {
  toastService = inject(ToastService);
}

