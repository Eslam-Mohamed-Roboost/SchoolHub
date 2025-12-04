import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  Output,
  EventEmitter,
  Input,
  OnDestroy,
} from '@angular/core';
import Quill from 'quill';

@Component({
  selector: 'app-rich-text-editor',
  template: `
    <div>
      <div #editor style="height: 300px; background: white;"></div>
      <small class="text-muted mt-2 d-block">
        @if (lastSaved) {
        <i class="fas fa-check-circle text-success me-1"></i>Auto-saved {{ formatTime(lastSaved) }}
        }
      </small>
    </div>
  `,
  styles: [
    `
      :host ::ng-deep .ql-toolbar {
        background: #f8f9fa;
        border-radius: 8px 8px 0 0;
      }
      :host ::ng-deep .ql-container {
        border-radius: 0 0 8px 8px;
        font-family: inherit;
      }
    `,
  ],
})
export class RichTextEditorComponent implements AfterViewInit, OnDestroy {
  @ViewChild('editor', { static: false }) editorElement!: ElementRef;
  @Input() initialContent: string = '';
  @Output() contentChange = new EventEmitter<string>();

  private quill!: Quill;
  private autoSaveInterval: any;
  lastSaved: Date | null = null;

  ngAfterViewInit(): void {
    this.quill = new Quill(this.editorElement.nativeElement, {
      theme: 'snow',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['clean'],
        ],
      },
      placeholder: 'Write your reflections on your learning...',
    });

    // Set initial content
    if (this.initialContent) {
      this.quill.root.innerHTML = this.initialContent;
    }

    // Auto-save every 30 seconds
    this.quill.on('text-change', () => {
      if (this.autoSaveInterval) clearTimeout(this.autoSaveInterval);

      this.autoSaveInterval = setTimeout(() => {
        const content = this.quill.root.innerHTML;
        this.contentChange.emit(content);
        this.lastSaved = new Date();
      }, 30000); // 30 seconds
    });
  }

  ngOnDestroy(): void {
    if (this.autoSaveInterval) {
      clearTimeout(this.autoSaveInterval);
    }
  }

  getContent(): string {
    return this.quill ? this.quill.root.innerHTML : '';
  }

  formatTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);

    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  }
}
