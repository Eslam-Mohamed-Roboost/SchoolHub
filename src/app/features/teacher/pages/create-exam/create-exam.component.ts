import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExaminationService } from '../../services/examination.service';
import { ClassService } from '../../services/class.service';
import { CreateExaminationRequest, ExaminationType, ExaminationStatus } from '../../models/examination.model';
import { ToastService } from '../../../../shared/services/toast.service';
import { ClassSubjectInfo } from '../../models/class.model';

@Component({
  selector: 'app-create-exam',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mx-auto px-4 py-6">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-0">
            <i class="fas fa-clipboard-list me-2"></i>Create Examination
          </h2>
          <p class="text-muted mb-0">Create a new examination for your students</p>
        </div>
        <button 
          class="btn btn-outline-secondary"
          (click)="goBack()">
          <i class="fas fa-arrow-left me-1"></i>Cancel
        </button>
      </div>

      <div class="row">
        <div class="col-lg-8 mx-auto">
          <div class="card">
            <div class="card-body">
              <form [formGroup]="examForm" (ngSubmit)="onSubmit()">
                <!-- Class (read-only if pre-filled) -->
                <div class="mb-3">
                  <label class="form-label fw-bold">Class</label>
                  @if (classId()) {
                    <input 
                      type="text" 
                      class="form-control" 
                      [value]="className()"
                      readonly />
                  } @else {
                    <select 
                      class="form-select"
                      formControlName="classId"
                      (change)="onClassChange($any($event.target).value)">
                      <option value="">Select a class</option>
                      @for (cls of classes(); track cls.id) {
                        <option [value]="cls.id">{{ cls.name }} (Grade {{ cls.grade }})</option>
                      }
                    </select>
                  }
                  @if (examForm.get('classId')?.hasError('required') && examForm.get('classId')?.touched) {
                    <div class="text-danger small mt-1">Class is required</div>
                  }
                </div>

                <!-- Subject -->
                <div class="mb-3">
                  <label class="form-label fw-bold">Subject <span class="text-danger">*</span></label>
                  <select 
                    class="form-select"
                    formControlName="subjectId"
                    [disabled]="!classId() && !examForm.get('classId')?.value">
                    <option value="">Select a subject</option>
                    @for (subject of availableSubjects(); track subject.subjectId) {
                      <option [value]="subject.subjectId">{{ subject.subjectName }}</option>
                    }
                  </select>
                  @if (examForm.get('subjectId')?.hasError('required') && examForm.get('subjectId')?.touched) {
                    <div class="text-danger small mt-1">Subject is required</div>
                  }
                  @if (availableSubjects().length === 0 && classId()) {
                    <div class="text-warning small mt-1">
                      <i class="fas fa-exclamation-triangle me-1"></i>No subjects available for this class
                    </div>
                  }
                </div>

                <!-- Title -->
                <div class="mb-3">
                  <label class="form-label fw-bold">Title <span class="text-danger">*</span></label>
                  <input 
                    type="text" 
                    class="form-control"
                    formControlName="title"
                    placeholder="Enter examination title" />
                  @if (examForm.get('title')?.hasError('required') && examForm.get('title')?.touched) {
                    <div class="text-danger small mt-1">Title is required</div>
                  }
                </div>

                <!-- Description -->
                <div class="mb-3">
                  <label class="form-label fw-bold">Description</label>
                  <textarea 
                    class="form-control"
                    formControlName="description"
                    rows="3"
                    placeholder="Enter examination description (optional)"></textarea>
                </div>

                <!-- Type -->
                <div class="mb-3">
                  <label class="form-label fw-bold">Type <span class="text-danger">*</span></label>
                  <select class="form-select" formControlName="type">
                    <option value="">Select examination type</option>
                    <option value="Quiz">Quiz</option>
                    <option value="Test">Test</option>
                    <option value="Exam">Exam</option>
                  </select>
                  @if (examForm.get('type')?.hasError('required') && examForm.get('type')?.touched) {
                    <div class="text-danger small mt-1">Type is required</div>
                  }
                </div>

                <!-- Scheduled Date -->
                <div class="mb-3">
                  <label class="form-label fw-bold">Scheduled Date & Time</label>
                  <input 
                    type="datetime-local" 
                    class="form-control"
                    formControlName="scheduledDate" />
                </div>

                <!-- Duration -->
                <div class="mb-3">
                  <label class="form-label fw-bold">Duration (minutes)</label>
                  <input 
                    type="number" 
                    class="form-control"
                    formControlName="duration"
                    min="1"
                    placeholder="Enter duration in minutes" />
                  <small class="text-muted">Leave empty if no time limit</small>
                </div>

                <!-- Max Score -->
                <div class="mb-3">
                  <label class="form-label fw-bold">Max Score <span class="text-danger">*</span></label>
                  <input 
                    type="number" 
                    class="form-control"
                    formControlName="maxScore"
                    min="1"
                    placeholder="Enter maximum score" />
                  @if (examForm.get('maxScore')?.hasError('required') && examForm.get('maxScore')?.touched) {
                    <div class="text-danger small mt-1">Max score is required</div>
                  }
                  @if (examForm.get('maxScore')?.hasError('min') && examForm.get('maxScore')?.touched) {
                    <div class="text-danger small mt-1">Max score must be at least 1</div>
                  }
                </div>

                <!-- Instructions -->
                <div class="mb-3">
                  <label class="form-label fw-bold">Instructions</label>
                  <textarea 
                    class="form-control"
                    formControlName="instructions"
                    rows="4"
                    placeholder="Enter examination instructions (optional)"></textarea>
                </div>

                <!-- Questions (JSON) -->
                <div class="mb-3">
                  <label class="form-label fw-bold">Questions (JSON)</label>
                  <textarea 
                    class="form-control font-monospace"
                    formControlName="questions"
                    rows="6"
                    placeholder='Enter questions as JSON array, e.g., [{"id":"1","type":"multiple-choice","question":"What is 2+2?","options":["3","4","5"],"correctAnswer":1,"points":10}]'></textarea>
                  <small class="text-muted">
                    Enter questions as a JSON array. Leave empty if questions will be added later.
                  </small>
                </div>

                <!-- Status -->
                <div class="mb-3">
                  <label class="form-label fw-bold">Status <span class="text-danger">*</span></label>
                  <select class="form-select" formControlName="status">
                    <option value="Draft">Draft</option>
                    <option value="Scheduled">Scheduled</option>
                  </select>
                  @if (examForm.get('status')?.hasError('required') && examForm.get('status')?.touched) {
                    <div class="text-danger small mt-1">Status is required</div>
                  }
                </div>

                <!-- Submit Buttons -->
                <div class="d-flex gap-2 justify-content-end">
                  <button 
                    type="button"
                    class="btn btn-outline-secondary"
                    (click)="goBack()">
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    class="btn btn-primary"
                    [disabled]="examForm.invalid || submitting()">
                    @if (submitting()) {
                      <i class="fas fa-spinner fa-spin me-1"></i>Creating...
                    } @else {
                      <i class="fas fa-save me-1"></i>Create Examination
                    }
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CreateExamComponent implements OnInit {
  private fb = inject(FormBuilder);
  private examinationService = inject(ExaminationService);
  private classService = inject(ClassService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastService = inject(ToastService);

  examForm!: FormGroup;
  submitting = signal(false);
  classId = signal<string | null>(null);
  className = signal<string>('');
  classes = signal<any[]>([]);
  availableSubjects = signal<ClassSubjectInfo[]>([]);

  ngOnInit(): void {
    // Initialize form
    this.examForm = this.fb.group({
      classId: ['', Validators.required],
      subjectId: ['', Validators.required],
      title: ['', Validators.required],
      description: [''],
      type: ['', Validators.required],
      scheduledDate: [''],
      duration: [''],
      maxScore: [100, [Validators.required, Validators.min(1)]],
      instructions: [''],
      questions: [''],
      status: ['Draft', Validators.required],
    });

    // Load query params
    this.route.queryParams.subscribe(params => {
      const classId = params['classId'];
      const studentId = params['studentId'];
      
      if (classId) {
        this.classId.set(classId);
        this.examForm.patchValue({ classId });
        this.loadClassSubjects(classId);
        this.loadClassName(classId);
      } else {
        // Load all classes if no classId provided
        this.loadClasses();
      }
    });
  }

  loadClasses(): void {
    this.classService.getMyClasses().subscribe({
      next: (classes) => {
        this.classes.set(classes);
      },
      error: (err) => {
        console.error('Failed to load classes', err);
        this.toastService.showMessage('Failed to load classes', 'error');
      },
    });
  }

  loadClassName(classId: string): void {
    this.classService.getMyClasses().subscribe({
      next: (classes) => {
        const classData = classes.find(c => c.id === classId);
        if (classData) {
          this.className.set(`${classData.name} (Grade ${classData.grade})`);
        }
      },
      error: (err) => {
        console.error('Failed to load class name', err);
      },
    });
  }

  loadClassSubjects(classId: string): void {
    this.classService.getClassSubjects(classId).subscribe({
      next: (subjects) => {
        this.availableSubjects.set(subjects);
        if (subjects.length === 0) {
          this.toastService.showMessage('No subjects available for this class', 'warning');
        }
      },
      error: (err) => {
        console.error('Failed to load subjects', err);
        this.toastService.showMessage('Failed to load subjects', 'error');
      },
    });
  }

  onClassChange(classId: string): void {
    if (classId) {
      this.loadClassSubjects(classId);
      // Reset subject selection when class changes
      this.examForm.patchValue({ subjectId: '' });
    } else {
      this.availableSubjects.set([]);
    }
  }

  onSubmit(): void {
    if (this.examForm.invalid) {
      this.examForm.markAllAsTouched();
      this.toastService.showMessage('Please fill in all required fields', 'error');
      return;
    }

    // Validate questions JSON if provided
    const questionsValue = this.examForm.value.questions?.trim();
    if (questionsValue) {
      try {
        JSON.parse(questionsValue);
      } catch (e) {
        this.toastService.showMessage('Invalid JSON format for questions', 'error');
        return;
      }
    }

    this.submitting.set(true);
    const formValue = this.examForm.value;
    
    const request: CreateExaminationRequest = {
      classId: formValue.classId,
      subjectId: formValue.subjectId,
      title: formValue.title,
      description: formValue.description || undefined,
      type: formValue.type as ExaminationType,
      scheduledDate: formValue.scheduledDate ? new Date(formValue.scheduledDate) : undefined,
      duration: formValue.duration ? parseInt(formValue.duration, 10) : undefined,
      maxScore: formValue.maxScore,
      instructions: formValue.instructions || undefined,
      questions: questionsValue || undefined,
      status: formValue.status as ExaminationStatus,
    };

    this.examinationService.createExamination(request).subscribe({
      next: (examination) => {
        this.toastService.showMessage(
          `Examination "${examination.title}" created successfully!`,
          'success'
        );
        this.goBack();
      },
      error: (err) => {
        console.error('Failed to create examination', err);
        this.toastService.showMessage('Failed to create examination', 'error');
        this.submitting.set(false);
      },
    });
  }

  goBack(): void {
    const classId = this.classId();
    if (classId) {
      this.router.navigate(['/teacher/class', classId, 'students']);
    } else {
      this.router.navigate(['/teacher/my-classes']);
    }
  }
}

