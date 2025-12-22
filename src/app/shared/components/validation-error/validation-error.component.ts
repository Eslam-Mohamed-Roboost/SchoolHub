import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-validation-error',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (errorMessage()) {
      <div class="invalid-feedback d-block small text-start mt-1">
        {{ errorMessage() }}
      </div>
    }
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class ValidationErrorComponent {
  errorMessage = input<string>('');
}

