import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  imports: [CommonModule],
  template: `
    <div [class]="getCardClasses()">
      @if (title() || headerContent) {
      <div class="px-6 py-4 border-b border-gray-200">
        @if (title()) {
        <h3 class="text-lg font-semibold text-gray-900">{{ title() }}</h3>
        }
        <ng-content select="[header]" />
      </div>
      }

      <div [class]="getBodyClasses()">
        <ng-content />
      </div>

      @if (footerContent) {
      <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <ng-content select="[footer]" />
      </div>
      }
    </div>
  `,
})
export class CardComponent {
  title = input<string>('');
  noPadding = input<boolean>(false);
  hoverable = input<boolean>(false);
  clickable = input<boolean>(false);

  clicked = output<MouseEvent>();

  headerContent = false;
  footerContent = false;

  getCardClasses(): string {
    const baseClasses = 'bg-white rounded-lg shadow-md overflow-hidden';
    const hoverClass = this.hoverable() ? 'hover:shadow-lg transition-shadow duration-200' : '';
    const clickClass = this.clickable() ? 'cursor-pointer' : '';

    return `${baseClasses} ${hoverClass} ${clickClass}`;
  }

  getBodyClasses(): string {
    return this.noPadding() ? '' : 'px-6 py-4';
  }
}
