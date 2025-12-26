import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExerciseService } from '../../services/exercise.service';
import { ClassService } from '../../services/class.service';
import { CreateExerciseRequest, ExerciseType, ExerciseStatus } from '../../models/exercise.model';
import { ToastService } from '../../../../shared/services/toast.service';
import { ClassSubjectInfo } from '../../models/class.model';

@Component({
  selector: 'app-create-exercise',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mx-auto px-4 py-6">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-0">
            <i class="fas fa-tasks me-2"></i>Create Exercise
          </h2>
          <p class="text-muted mb-0">Create a new exercise for your students</p>
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
              <form [formGroup]="exerciseForm" (ngSubmit)="onSubmit()">
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
                  @if (exerciseForm.get('classId')?.hasError('required') && exerciseForm.get('classId')?.touched) {
                    <div class="text-danger small mt-1">Class is required</div>
                  }
                </div>

                <!-- Subject -->
                <div class="mb-3">
                  <label class="form-label fw-bold">Subject <span class="text-danger">*</span></label>
                  <select 
                    class="form-select"
                    formControlName="subjectId"
                    [disabled]="!classId() && !exerciseForm.get('classId')?.value">
                    <option value="">Select a subject</option>
                    @for (subject of availableSubjects(); track subject.subjectId) {
                      <option [value]="subject.subjectId">{{ subject.subjectName }}</option>
                    }
                  </select>
                  @if (exerciseForm.get('subjectId')?.hasError('required') && exerciseForm.get('subjectId')?.touched) {
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
                    placeholder="Enter exercise title" />
                  @if (exerciseForm.get('title')?.hasError('required') && exerciseForm.get('title')?.touched) {
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
                    placeholder="Enter exercise description (optional)"></textarea>
                </div>

                <!-- Type -->
                <div class="mb-3">
                  <label class="form-label fw-bold">Type <span class="text-danger">*</span></label>
                  <select class="form-select" formControlName="type">
                    <option value="">Select exercise type</option>
                    <option value="Homework">Homework</option>
                    <option value="Classwork">Classwork</option>
                    <option value="Project">Project</option>
                  </select>
                  @if (exerciseForm.get('type')?.hasError('required') && exerciseForm.get('type')?.touched) {
                    <div class="text-danger small mt-1">Type is required</div>
                  }
                </div>

                <!-- Due Date -->
                <div class="mb-3">
                  <label class="form-label fw-bold">Due Date</label>
                  <input 
                    type="datetime-local" 
                    class="form-control"
                    formControlName="dueDate" />
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
                  @if (exerciseForm.get('maxScore')?.hasError('required') && exerciseForm.get('maxScore')?.touched) {
                    <div class="text-danger small mt-1">Max score is required</div>
                  }
                  @if (exerciseForm.get('maxScore')?.hasError('min') && exerciseForm.get('maxScore')?.touched) {
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
                    placeholder="Enter exercise instructions (optional)"></textarea>
                </div>

                <!-- Status -->
                <div class="mb-3">
                  <label class="form-label fw-bold">Status <span class="text-danger">*</span></label>
                  <select class="form-select" formControlName="status">
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                    <option value="Closed">Closed</option>
                  </select>
                  @if (exerciseForm.get('status')?.hasError('required') && exerciseForm.get('status')?.touched) {
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
                    [disabled]="exerciseForm.invalid || submitting()">
                    @if (submitting()) {
                      <i class="fas fa-spinner fa-spin me-1"></i>Creating...
                    } @else {
                      <i class="fas fa-save me-1"></i>Create Exercise
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
export class CreateExerciseComponent implements OnInit {
  private fb = inject(FormBuilder);
  private exerciseService = inject(ExerciseService);
  private classService = inject(ClassService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastService = inject(ToastService);

  exerciseForm!: FormGroup;
  submitting = signal(false);
  classId = signal<string | null>(null);
  className = signal<string>('');
  classes = signal<any[]>([]);
  availableSubjects = signal<ClassSubjectInfo[]>([]);

  ngOnInit(): void {
    // Initialize form
    this.exerciseForm = this.fb.group({
      classId: ['', Validators.required],
      subjectId: ['', Validators.required],
      title: ['', Validators.required],
      description: [''],
      type: ['', Validators.required],
      dueDate: [''],
      maxScore: [100, [Validators.required, Validators.min(1)]],
      instructions: [''],
      status: ['Draft', Validators.required],
    });

    // Load query params
    this.route.queryParams.subscribe(params => {
      const classId = params['classId'];
      const studentId = params['studentId'];
      
      if (classId) {
        this.classId.set(classId);
        this.exerciseForm.patchValue({ classId });
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
      this.exerciseForm.patchValue({ subjectId: '' });
    } else {
      this.availableSubjects.set([]);
    }
  }

  onSubmit(): void {
    if (this.exerciseForm.invalid) {
      this.exerciseForm.markAllAsTouched();
      this.toastService.showMessage('Please fill in all required fields', 'error');
      return;
    }

    this.submitting.set(true);
    const formValue = this.exerciseForm.value;
    
    const request: CreateExerciseRequest = {
      classId: formValue.classId,
      subjectId: formValue.subjectId,
      title: formValue.title,
      description: formValue.description || undefined,
      type: formValue.type as ExerciseType,
      dueDate: formValue.dueDate ? new Date(formValue.dueDate) : undefined,
      maxScore: formValue.maxScore,
      instructions: formValue.instructions || undefined,
      attachments: undefined, // File upload can be added later
      status: formValue.status as ExerciseStatus,
    };

    this.exerciseService.createExercise(request).subscribe({
      next: (exercise) => {
        this.toastService.showMessage(
          `Exercise "${exercise.title}" created successfully!`,
          'success'
        );
        this.goBack();
      },
      error: (err) => {
        console.error('Failed to create exercise', err);
        this.toastService.showMessage('Failed to create exercise', 'error');
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

