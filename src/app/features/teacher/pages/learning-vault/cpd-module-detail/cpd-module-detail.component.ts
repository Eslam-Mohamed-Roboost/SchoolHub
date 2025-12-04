import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CpdService } from '../../../services/cpd.service';
import { CPDModule } from '../../../models/cpd.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-cpd-module-detail',
  imports: [CommonModule, RouterLink],
  template: `
    @if (module) {
    <div class="cpd-module-detail">
      <!-- Module Header -->
      <div class="bg-white border-bottom py-3 mb-4">
        <div class="container mx-auto px-4">
          <div class="d-flex align-items-center gap-3">
            <button routerLink="/teacher/learning-vault" class="btn btn-light rounded-circle p-2">
              <i class="fas fa-arrow-left"></i>
            </button>
            <div class="flex-grow-1">
              <div class="d-flex align-items-center gap-3">
                <div
                  class="rounded-3 p-2 d-flex align-items-center justify-content-center"
                  [style.background]="module.bgColor"
                  [style.color]="module.color"
                  style="width: 50px; height: 50px;"
                >
                  <i [class]="module.icon" class="fs-4"></i>
                </div>
                <div>
                  <h4 class="fw-bold mb-0">{{ module.title }}</h4>
                  <p class="text-muted mb-0 small">
                    <i class="fas fa-clock me-1"></i>{{ module.duration }} minutes
                    <span class="ms-3">
                      @if (module.status === 'completed') {
                      <i class="fas fa-check-circle text-success me-1"></i>Completed } @else if
                      (module.status === 'in-progress') {
                      <i class="fas fa-spinner text-warning me-1"></i>In Progress } @else {
                      <i class="fas fa-circle text-secondary me-1"></i>Not Started }
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="container mx-auto px-4 py-4">
        <div class="row g-4">
          <!-- Main Content -->
          <div class="col-lg-8">
            <!-- Video Section -->
            <div class="card border-0 shadow-sm rounded-4 mb-4">
              <div class="card-header bg-white border-bottom py-3 px-4">
                <h5 class="fw-bold mb-0">
                  <i class="fas fa-play-circle text-primary me-2"></i>Training Video
                </h5>
              </div>
              <div class="card-body p-0">
                <div class="ratio ratio-16x9">
                  <iframe
                    [src]="videoUrl"
                    title="{{ module.title }} Video"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  ></iframe>
                </div>
              </div>
            </div>

            <!-- Text Guide Section -->
            <div class="card border-0 shadow-sm rounded-4 mb-4">
              <div class="card-header bg-white border-bottom py-3 px-4">
                <h5 class="fw-bold mb-0">
                  <i class="fas fa-book-open text-primary me-2"></i>Learning Guide
                </h5>
              </div>
              <div class="card-body p-4" [innerHTML]="module.guideContent"></div>
            </div>

            <!-- Microsoft Form Section -->
            <div class="card border-0 shadow-sm rounded-4 mb-4">
              <div class="card-header bg-white border-bottom py-3 px-4">
                <h5 class="fw-bold mb-0">
                  <i class="fas fa-clipboard-check text-primary me-2"></i>Completion Form
                </h5>
                <p class="mb-0 small text-muted">
                  Complete this form to demonstrate your understanding
                </p>
              </div>
              <div class="card-body p-0">
                <div class="ratio ratio-16x9">
                  <iframe
                    [src]="formUrl"
                    title="{{ module.title }} Completion Form"
                    frameborder="0"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="col-lg-4">
            <!-- Evidence Upload -->
            <div class="card border-0 shadow-sm rounded-4 mb-4">
              <div class="card-header bg-white border-bottom py-3 px-4">
                <h5 class="fw-bold mb-0">
                  <i class="fas fa-upload text-primary me-2"></i>Upload Evidence
                </h5>
                <p class="mb-0 small text-muted">Screenshots or work samples</p>
              </div>
              <div class="card-body p-4">
                <div class="mb-3">
                  <label class="form-label small fw-bold">Select files to upload</label>
                  <input
                    type="file"
                    class="form-control"
                    multiple
                    (change)="onFileSelected($event)"
                    accept="image/*,.pdf,.doc,.docx"
                  />
                </div>

                @if (module.evidenceFiles && module.evidenceFiles.length > 0) {
                <div class="mb-3">
                  <label class="form-label small fw-bold">Uploaded Files</label>
                  <div class="list-group">
                    @for (file of module.evidenceFiles; track file) {
                    <div class="list-group-item d-flex align-items-center gap-2">
                      <i class="fas fa-file text-primary"></i>
                      <span class="small flex-grow-1">{{ file }}</span>
                    </div>
                    }
                  </div>
                </div>
                } @if (selectedFiles().length > 0) {
                <button
                  class="btn btn-primary w-100 rounded-pill"
                  (click)="uploadFiles()"
                  [disabled]="uploading()"
                >
                  @if (uploading()) {
                  <i class="fas fa-spinner fa-spin me-2"></i>Uploading... } @else {
                  <i class="fas fa-upload me-2"></i>Upload {{ selectedFiles().length }} file(s) }
                </button>
                }
              </div>
            </div>

            <!-- Mark Complete -->
            <div class="card border-0 shadow-sm rounded-4 mb-4">
              <div class="card-body p-4 text-center">
                @if (module.status === 'completed') {
                <div class="mb-3">
                  <i class="fas fa-check-circle text-success" style="font-size: 3rem;"></i>
                  <h5 class="fw-bold mt-2 text-success">Module Completed!</h5>
                  <p class="text-muted small">Completed on {{ formatDate(module.completedAt!) }}</p>
                </div>
                <button
                  class="btn btn-outline-primary rounded-pill px-4"
                  (click)="markAsIncomplete()"
                >
                  <i class="fas fa-redo me-2"></i>Mark as Incomplete
                </button>
                } @else {
                <h5 class="fw-bold mb-3">Ready to complete?</h5>
                <p class="text-muted small mb-3">
                  Click the button below after watching the video, reading the guide, and submitting
                  the form.
                </p>
                <button
                  class="btn btn-success rounded-pill px-4 w-100"
                  (click)="markComplete()"
                  [disabled]="completing()"
                >
                  @if (completing()) {
                  <i class="fas fa-spinner fa-spin me-2"></i>Processing... } @else {
                  <i class="fas fa-check me-2"></i>Mark as Complete }
                </button>
                }
              </div>
            </div>

            <!-- Module Info -->
            <div class="card border-0 shadow-sm rounded-4">
              <div class="card-header bg-white border-bottom py-3 px-4">
                <h6 class="fw-bold mb-0">Module Information</h6>
              </div>
              <div class="card-body p-4">
                <div class="mb-3">
                  <label class="text-muted small">Duration</label>
                  <div class="fw-bold">{{ module.duration }} minutes</div>
                </div>
                <div class="mb-3">
                  <label class="text-muted small">Status</label>
                  <div>
                    @if (module.status === 'completed') {
                    <span class="badge bg-success">Completed</span>
                    } @else if (module.status === 'in-progress') {
                    <span class="badge bg-warning text-dark">In Progress</span>
                    } @else {
                    <span class="badge bg-secondary">Not Started</span>
                    }
                  </div>
                </div>
                @if (module.startedAt) {
                <div class="mb-3">
                  <label class="text-muted small">Started On</label>
                  <div class="fw-bold">{{ formatDate(module.startedAt) }}</div>
                </div>
                } @if (module.completedAt) {
                <div class="mb-0">
                  <label class="text-muted small">Completed On</label>
                  <div class="fw-bold">{{ formatDate(module.completedAt) }}</div>
                </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    } @else {
    <div class="container mx-auto px-4 py-8 text-center">
      <i class="fas fa-exclamation-triangle text-warning fa-3x mb-3"></i>
      <h4>Module Not Found</h4>
      <p class="text-muted">The requested CPD module could not be found.</p>
      <button routerLink="/teacher/learning-vault" class="btn btn-primary rounded-pill px-4">
        <i class="fas fa-arrow-left me-2"></i>Back to Learning Vault
      </button>
    </div>
    }
  `,
  styles: [
    `
      .cpd-module-detail {
        min-height: 100vh;
        background-color: #f8f9fa;
      }
    `,
  ],
})
export class CpdModuleDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cpdService = inject(CpdService);
  private sanitizer = inject(DomSanitizer);

  module: CPDModule | undefined;
  videoUrl: SafeResourceUrl | null = null;
  formUrl: SafeResourceUrl | null = null;

  selectedFiles = signal<File[]>([]);
  uploading = signal(false);
  completing = signal(false);

  ngOnInit(): void {
    const moduleId = this.route.snapshot.params['id'];
    this.module = this.cpdService.getModule(moduleId);

    if (this.module) {
      const currentModule = this.module;

      // Mark as in-progress when user accesses the module for the first time
      if (currentModule.status === 'not-started') {
        this.cpdService.markModuleInProgress(moduleId);
        this.module = this.cpdService.getModule(moduleId);
      }

      // Sanitize URLs for iframes
      if (currentModule.videoUrl) {
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(currentModule.videoUrl);
      }
      if (currentModule.formUrl) {
        this.formUrl = this.sanitizer.bypassSecurityTrustResourceUrl(currentModule.formUrl);
      }
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles.set(Array.from(input.files));
    }
  }

  uploadFiles(): void {
    if (!this.module || this.selectedFiles().length === 0) return;

    this.uploading.set(true);

    // Simulate upload delay
    setTimeout(() => {
      const fileList: FileList = {
        length: this.selectedFiles().length,
        item: (index: number) => this.selectedFiles()[index],
        [Symbol.iterator]: function* () {
          for (let i = 0; i < this.length; i++) {
            yield this.item(i)!;
          }
        },
      } as FileList;

      this.cpdService.uploadEvidence(this.module!.id, fileList);

      // Refresh module data
      this.module = this.cpdService.getModule(this.module!.id);
      this.selectedFiles.set([]);
      this.uploading.set(false);

      // Show success message
      alert('Evidence files uploaded successfully!');
    }, 1000);
  }

  markComplete(): void {
    if (!this.module) return;

    this.completing.set(true);

    // Simulate processing delay
    setTimeout(() => {
      this.cpdService.markModuleComplete(this.module!.id);
      this.module = this.cpdService.getModule(this.module!.id);
      this.completing.set(false);

      // Show success message and navigate back
      alert(`Congratulations! You've completed "${this.module!.title}"!`);
      this.router.navigate(['/teacher/learning-vault']);
    }, 1000);
  }

  markAsIncomplete(): void {
    if (!this.module) return;

    if (confirm('Are you sure you want to mark this module as incomplete?')) {
      this.cpdService.markModuleInProgress(this.module.id);
      this.module = this.cpdService.getModule(this.module.id);
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }
}
