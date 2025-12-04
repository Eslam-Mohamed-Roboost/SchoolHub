import { Component, OnInit, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StudentPortfolioService } from '../../services/student-portfolio.service';
import { SubjectPortfolio, PortfolioFile } from '../../models/student-portfolio.model';
import { RichTextEditorComponent } from '../../../../shared/ui/rich-text-editor/rich-text-editor.component';

@Component({
  selector: 'app-subject-portfolio',
  imports: [CommonModule, RouterLink, FormsModule, RichTextEditorComponent],
  template: `
    @if (portfolio) {
    <div class="subject-portfolio container mx-auto px-4 py-6">
      <!-- Header -->
      <div class="d-flex align-items-center gap-3 mb-4">
        <button routerLink="/student/portfolio-hub" class="btn btn-light rounded-circle">
          <i class="fas fa-arrow-left"></i>
        </button>
        <div>
          <h2 class="fw-bold mb-0">
            <i [class]="portfolio.subjectIcon + ' me-2'"></i>{{ portfolio.subjectName }}
          </h2>
          <p class="text-muted mb-0">My Portfolio</p>
        </div>
      </div>

      <div class="row g-4">
        <!-- Main Content -->
        <div class="col-lg-8">
          <!-- Quick Stats -->
          <div class="card border-0 shadow-sm rounded-4 mb-4">
            <div class="card-body">
              <div class="row text-center">
                <div class="col-4">
                  <i class="fas fa-file-alt text-primary fa-2x mb-2"></i>
                  <div class="fw-bold">{{ portfolio.stats.filesCount }}</div>
                  <small class="text-muted">Files</small>
                </div>
                <div class="col-4">
                  <i class="fas fa-comments text-success fa-2x mb-2"></i>
                  <div class="fw-bold">{{ portfolio.stats.feedbackCount }}</div>
                  <small class="text-muted">Feedback</small>
                </div>
                <div class="col-4">
                  <i class="fas fa-award text-warning fa-2x mb-2"></i>
                  <div class="fw-bold">{{ portfolio.stats.badgesCount }}</div>
                  <small class="text-muted">Badges</small>
                </div>
              </div>
            </div>
          </div>

          <!-- My Work Section -->
          <div class="card border-0 shadow-sm rounded-4 mb-4">
            <div class="card-header bg-white border-bottom py-3 px-4">
              <h5 class="fw-bold mb-0">
                <i class="fas fa-folder-open text-primary me-2"></i>My Work
              </h5>
            </div>
            <div class="card-body p-4">
              <!-- Upload Zone -->
              <div
                class="upload-zone border-2 border-dashed rounded-4 p-5 text-center mb-4"
                (click)="fileInput.click()"
                (dragover)="onDragOver($event)"
                (drop)="onDrop($event)"
              >
                <i class="fas fa-cloud-upload-alt fa-3x text-primary mb-3"></i>
                <p class="mb-2">Drag & drop files here or click to browse</p>
                <small class="text-muted">PDF, DOCX, PPTX, JPG, PNG, MP4 (Max 50MB)</small>
                <input
                  #fileInput
                  type="file"
                  hidden
                  (change)="onFileSelected($event)"
                  accept=".pdf,.docx,.pptx,.jpg,.jpeg,.png,.mp4"
                />
              </div>

              <!-- Files Grid -->
              @if (portfolio.files.length > 0) {
              <div class="row g-3">
                @for (file of portfolio.files; track file.id) {
                <div class="col-md-6">
                  <div class="card border">
                    <div class="card-body p-3">
                      <div class="d-flex align-items-start gap-3">
                        <i [class]="getFileIcon(file.fileType) + ' fa-2x'"></i>
                        <div class="flex-grow-1">
                          <h6 class="mb-1 small">{{ file.fileName }}</h6>
                          <small class="text-muted">
                            {{ formatFileSize(file.fileSize) }} • {{ formatDate(file.uploadDate) }}
                          </small>
                        </div>
                        <div class="btn-group btn-group-sm">
                          <button class="btn btn-outline-primary" (click)="previewFile(file)">
                            <i class="fas fa-eye"></i>
                          </button>
                          <button class="btn btn-outline-danger" (click)="deleteFile(file.id)">
                            <i class="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                }
              </div>
              } @else {
              <p class="text-muted text-center">No files uploaded yet</p>
              }
            </div>
          </div>

          <!-- Teacher Feedback -->
          <div class="card border-0 shadow-sm rounded-4 mb-4">
            <div class="card-header bg-white border-bottom py-3 px-4">
              <h5 class="fw-bold mb-0">
                <i class="fas fa-comments text-success me-2"></i>Teacher Feedback
              </h5>
            </div>
            <div class="card-body p-4">
              @if (portfolio.feedback.length > 0) { @for (fb of portfolio.feedback; track fb.id) {
              <div class="mb-3 pb-3 border-bottom">
                <div class="d-flex justify-content-between mb-2">
                  <strong>{{ fb.teacherName }}</strong>
                  <small class="text-muted">{{ formatDate(fb.date) }}</small>
                </div>
                <p class="mb-0">{{ fb.comment }}</p>
              </div>
              } } @else {
              <p class="text-muted text-center mb-0">No feedback yet</p>
              }
            </div>
          </div>

          <!-- My Reflections -->
          <div class="card border-0 shadow-sm rounded-4">
            <div class="card-header bg-white border-bottom py-3 px-4">
              <h5 class="fw-bold mb-0">
                <i class="fas fa-pen-fancy text-purple me-2"></i>My Reflections
              </h5>
            </div>
            <div class="card-body p-4">
              <app-rich-text-editor
                [initialContent]="reflectionContent"
                (contentChange)="onReflectionChange($event)"
                #richEditor
              ></app-rich-text-editor>
              <button class="btn btn-primary mt-3" (click)="saveReflection()">
                <i class="fas fa-save me-2"></i>Save Reflection
              </button>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="col-lg-4">
          <!-- Achievements -->
          <div class="card border-0 shadow-sm rounded-4 mb-4">
            <div class="card-header bg-white border-bottom py-3 px-4">
              <h6 class="fw-bold mb-0">
                <i class="fas fa-award text-warning me-2"></i>Achievements
              </h6>
            </div>
            <div class="card-body p-4">
              @if (portfolio.badges.length > 0) {
              <div class="d-flex flex-wrap gap-2">
                @for (badge of portfolio.badges; track badge.id) {
                <div class="badge p-2" [style.background]="badge.color">
                  <i [class]="badge.icon + ' me-1'"></i>{{ badge.name }}
                </div>
                }
              </div>
              } @else {
              <p class="text-muted small text-center mb-0">No badges yet</p>
              }
            </div>
          </div>

          <!-- Portfolio Info -->
          <div class="card border-0 shadow-sm rounded-4">
            <div class="card-header bg-white border-bottom py-3 px-4">
              <h6 class="fw-bold mb-0">Portfolio Info</h6>
            </div>
            <div class="card-body p-4">
              <div class="mb-3">
                <label class="text-muted small">Subject</label>
                <div class="fw-bold">{{ portfolio.subjectName }}</div>
              </div>
              <div class="mb-3">
                <label class="text-muted small">Files Uploaded</label>
                <div class="fw-bold">{{ portfolio.stats.filesCount }}</div>
              </div>
              @if (portfolio.stats.latestUploadDate) {
              <div>
                <label class="text-muted small">Last Upload</label>
                <div class="fw-bold">{{ formatDate(portfolio.stats.latestUploadDate) }}</div>
              </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
    }
    <!-- File Preview Modal -->
    @if (selectedFile()) {
    <div class="modal show d-block" (click)="closePreview()">
      <div class="modal-dialog modal-lg" (click)="$event.stopPropagation()">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ selectedFile()!.fileName }}</h5>
            <button type="button" class="btn-close" (click)="closePreview()"></button>
          </div>
          <div class="modal-body text-center">
            @if (isImage(selectedFile()!.fileType)) {
            <img [src]="selectedFile()!.previewUrl" class="img-fluid" alt="Preview" />
            } @else if (selectedFile()!.fileType === 'pdf') {
            <p class="text-muted">PDF Preview (requires browser PDF viewer)</p>
            <a [href]="selectedFile()!.downloadUrl" target="_blank" class="btn btn-primary">
              <i class="fas fa-external-link-alt me-2"></i>Open PDF
            </a>
            } @else {
            <i [class]="getFileIcon(selectedFile()!.fileType) + ' fa-5x mb-3'"></i>
            <p class="text-muted">Preview not available for this file type</p>
            <a [href]="selectedFile()!.downloadUrl" download class="btn btn-primary">
              <i class="fas fa-download me-2"></i>Download File
            </a>
            }
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop show"></div>
    } @else {
    <div class="container mx-auto px-4 py-8 text-center">
      <i class="fas fa-folder-open fa-3x text-muted mb-3"></i>
      <h4>Portfolio Not Found</h4>
      <button routerLink="/student/portfolio-hub" class="btn btn-primary mt-3">
        Back to Portfolio Hub
      </button>
    </div>
    }
  `,
  styles: [
    `
      .upload-zone {
        cursor: pointer;
        transition: all 0.3s;
        background: #f8f9fa;
      }
      .upload-zone:hover {
        background: #e9ecef;
        border-color: #0d6efd !important;
      }
      .upload-zone.drag-over {
        background: #cfe2ff;
        border-color: #0d6efd !important;
      }
    `,
  ],
})
export class SubjectPortfolioComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private portfolioService = inject(StudentPortfolioService);

  @ViewChild('richEditor') richEditor!: RichTextEditorComponent;

  portfolio: SubjectPortfolio | null = null;
  selectedFile = signal<PortfolioFile | null>(null);
  reflectionContent = '';
  lastSaved: Date | null = null;

  ngOnInit(): void {
    const subjectId = this.route.snapshot.params['subjectId'];
    this.portfolio = this.portfolioService.getSubjectPortfolio(subjectId);

    // Load existing reflection if any
    if (this.portfolio && this.portfolio.reflections.length > 0) {
      this.reflectionContent = this.portfolio.reflections[0].content;
      this.lastSaved = this.portfolio.reflections[0].date;
    }
  }

  onReflectionChange(content: string): void {
    this.reflectionContent = content;
    // Auto-save handled by editor component
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.uploadFile(files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadFile(input.files[0]);
    }
  }

  uploadFile(file: File): void {
    if (!this.portfolio) return;

    // Validate file size (50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert('File size exceeds 50MB limit');
      return;
    }

    // Validate file type
    const allowedTypes = ['pdf', 'docx', 'pptx', 'jpg', 'jpeg', 'png', 'mp4'];
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !allowedTypes.includes(ext)) {
      alert('File type not allowed');
      return;
    }

    this.portfolioService.uploadFile(this.portfolio.subjectId, file);
    this.portfolio = this.portfolioService.getSubjectPortfolio(this.portfolio.subjectId);
    alert('File uploaded successfully!');
  }

  deleteFile(fileId: string): void {
    if (!this.portfolio) return;
    if (confirm('Are you sure you want to delete this file?')) {
      this.portfolioService.deleteFile(this.portfolio.subjectId, fileId);
      this.portfolio = this.portfolioService.getSubjectPortfolio(this.portfolio.subjectId);
    }
  }

  previewFile(file: PortfolioFile): void {
    this.selectedFile.set(file);
  }

  closePreview(): void {
    this.selectedFile.set(null);
  }

  saveReflection(): void {
    if (!this.portfolio || !this.reflectionContent.trim()) return;

    this.portfolioService.saveReflection(this.portfolio.subjectId, this.reflectionContent);
    this.lastSaved = new Date();
    alert('Reflection saved successfully!');
  }

  getFileIcon(fileType: string): string {
    const icons: { [key: string]: string } = {
      pdf: 'fas fa-file-pdf text-danger',
      docx: 'fas fa-file-word text-primary',
      pptx: 'fas fa-file-powerpoint text-warning',
      jpg: 'fas fa-file-image text-info',
      png: 'fas fa-file-image text-info',
      mp4: 'fas fa-file-video text-purple',
    };
    return icons[fileType] || 'fas fa-file';
  }

  isImage(fileType: string): boolean {
    return ['jpg', 'png'].includes(fileType);
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - d.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}
