import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="w-full">
      @if (label()) {
      <label [for]="id()" class="block text-sm font-medium text-gray-700 mb-1">
        {{ label() }}
        @if (required()) {
        <span class="text-red-500">*</span>
        }
      </label>
      }

      <div class="relative">
        <input
          [id]="id()"
          [type]="type()"
          [placeholder]="placeholder()"
          [disabled]="disabled()"
          [required]="required()"
          [class]="getInputClasses()"
          [value]="value()"
          (input)="handleInput($event)"
          (blur)="handleBlur()"
          (focus)="handleFocus()"
        />

        @if (error()) {
        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        }
      </div>

      @if (error()) {
      <p class="mt-1 text-sm text-red-600">{{ error() }}</p>
      } @if (hint() && !error()) {
      <p class="mt-1 text-sm text-gray-500">{{ hint() }}</p>
      }
    </div>
  `,
})
export class InputComponent {
  id = input<string>(`input-${Math.random().toString(36).substr(2, 9)}`);
  type = input<string>('text');
  label = input<string>('');
  placeholder = input<string>('');
  value = input<string>('');
  error = input<string>('');
  hint = input<string>('');
  disabled = input<boolean>(false);
  required = input<boolean>(false);

  valueChange = output<string>();
  blurred = output<void>();
  focused = output<void>();

  isFocused = signal(false);

  handleInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.valueChange.emit(target.value);
  }

  handleBlur(): void {
    this.isFocused.set(false);
    this.blurred.emit();
  }

  handleFocus(): void {
    this.isFocused.set(true);
    this.focused.emit();
  }

  getInputClasses(): string {
    const baseClasses =
      'block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors';

    if (this.error()) {
      return `${baseClasses} border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500`;
    }

    if (this.disabled()) {
      return `${baseClasses} border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed`;
    }

    return `${baseClasses} border-gray-300 focus:ring-blue-500 focus:border-blue-500`;
  }
}
