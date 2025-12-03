import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  imports: [CommonModule],
  template: `
    @if (isOpen()) {
    <div class="fixed inset-0 z-50 overflow-y-auto" (click)="handleBackdropClick($event)">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

      <!-- Modal Container -->
      <div class="flex min-h-full items-center justify-center p-4">
        <div
          class="relative bg-white rounded-lg shadow-xl max-w-lg w-full transform transition-all"
          (click)="$event.stopPropagation()"
        >
          <!-- Header -->
          @if (title() || showClose()) {
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 class="text-xl font-semibold text-gray-900">{{ title() }}</h3>
            @if (showClose()) {
            <button
              type="button"
              (click)="handleClose()"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            }
          </div>
          }

          <!-- Body -->
          <div class="px-6 py-4">
            <ng-content />
          </div>

          <!-- Footer -->
          @if (footerContent) {
          <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
            <ng-content select="[footer]" />
          </div>
          }
        </div>
      </div>
    </div>
    }
  `,
})
export class ModalComponent {
  isOpen = input<boolean>(false);
  title = input<string>('');
  showClose = input<boolean>(true);
  closeOnBackdrop = input<boolean>(true);

  closed = output<void>();

  footerContent = false;

  handleClose(): void {
    this.closed.emit();
  }

  handleBackdropClick(event: MouseEvent): void {
    if (this.closeOnBackdrop()) {
      this.handleClose();
    }
  }
}
