import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  imports: [CommonModule],
  template: `
    <div class="stat-card card border-0 shadow-sm rounded-4 p-4 h-100 hover-card">
      <div class="d-flex align-items-center gap-3">
        <div
          class="icon-wrapper rounded-circle d-flex align-items-center justify-content-center"
          [style.background]="iconBgColor()"
          [style.color]="iconColor()"
        >
          <i [class]="icon()" class="fs-4"></i>
        </div>
        <div class="flex-grow-1">
          <p class="text-muted small mb-1">{{ label() }}</p>
          <h3 class="fw-bold mb-0">{{ value() }}</h3>
          @if (subtitle()) {
          <small class="text-muted">{{ subtitle() }}</small>
          }
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .stat-card {
        transition: all 0.3s ease;
        cursor: pointer;
      }

      .stat-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
      }

      .icon-wrapper {
        width: 50px;
        height: 50px;
        flex-shrink: 0;
      }

      h3 {
        font-size: 1.75rem;
        line-height: 1.2;
      }
    `,
  ],
})
export class StatCardComponent {
  icon = input.required<string>();
  label = input.required<string>();
  value = input.required<string | number>();
  subtitle = input<string>('');
  iconColor = input<string>('#6366f1');
  iconBgColor = input<string>('#e0e7ff');
}
