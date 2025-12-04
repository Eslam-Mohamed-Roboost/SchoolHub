import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-card',
  imports: [CommonModule],
  template: `
    <div class="progress-card card border-0 shadow-sm rounded-4 p-4 h-100">
      <div class="d-flex justify-content-between align-items-start mb-3">
        <h5 class="fw-bold mb-0">{{ title() }}</h5>
        <span class="badge rounded-pill" [style.background-color]="color()">
          {{ percentage() }}%
        </span>
      </div>

      <div class="mb-2">
        <h2 class="fw-bold mb-0">
          {{ current() }}<span class="text-muted fs-5">/{{ target() }}</span>
        </h2>
        <p class="text-muted small mb-0">{{ unit() }}</p>
      </div>

      <div class="progress rounded-pill" style="height: 10px">
        <div
          class="progress-bar progress-bar-animated"
          role="progressbar"
          [style.width.%]="percentage()"
          [style.background-color]="color()"
          [attr.aria-valuenow]="current()"
          [attr.aria-valuemin]="0"
          [attr.aria-valuemax]="target()"
        ></div>
      </div>

      @if (subtitle()) {
      <small class="text-muted d-block mt-2">{{ subtitle() }}</small>
      }
    </div>
  `,
  styles: [
    `
      .progress-card {
        transition: all 0.3s ease;
      }

      .progress-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
      }

      .progress-bar {
        transition: width 1s ease-in-out;
      }

      h2 {
        font-size: 2rem;
        line-height: 1;
      }
    `,
  ],
})
export class ProgressCardComponent {
  title = input.required<string>();
  current = input.required<number>();
  target = input.required<number>();
  unit = input.required<string>();
  color = input<string>('#6366f1');
  subtitle = input<string>('');

  percentage = computed(() => {
    const percent = (this.current() / this.target()) * 100;
    return Math.min(Math.round(percent), 100);
  });
}
