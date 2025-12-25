import { Component, inject, signal, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ClassService } from '../../services/class.service';
import { UserService } from '../../services/user.service';
import { TeacherAssignmentService } from '../../services/teacher-assignment.service';
import { Class, CreateClassRequest, UpdateClassRequest } from '../../models/class.model';
import { ApplicationRole } from '../../../../core/enums/application-role.enum';
import { ToastService } from '../../../../shared/services/toast.service';
import { TeacherAssignmentInfo, ClassSubjectAssignment } from '../../models/teacher-assignment.model';
import { HttpClient } from '@angular/common/http';
import { Admin_API_ENDPOINTS } from '../../../../config/AdminConfig/AdminEndpoint';
import { environment } from '../../../../config/environment';

interface Teacher {
  id: string;
  name: string;
  email: string;
}

@Component({
  selector: 'app-admin-classes',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-classes.component.html',
  styleUrl: './admin-classes.component.css',
})
export class AdminClassesComponent implements OnInit {
  private classService = inject(ClassService);
  private userService = inject(UserService);
  private teacherAssignmentService = inject(TeacherAssignmentService);
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);

  // State
  classes = this.classService.getClasses;
  isLoading = this.classService.getIsLoading;
  teachers = signal<Teacher[]>([]);

  // Modals
  showAddClassModal = signal(false);
  showEditClassModal = signal(false);
  showDeleteConfirm = signal(false);
  selectedClass = signal<Class | null>(null);

  // Form
  classForm: FormGroup;

  // Available grades
  grades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  // Teacher assignments for current class
  classTeacherAssignments = signal<TeacherAssignmentInfo[]>([]);
  subjects = signal<Array<{ Id: string; Name: string; Icon?: string }>>([]);
  newClassAssignment = signal<{ teacherId: string; subjectId: string }>({ teacherId: '', subjectId: '' });
  isLoadingClassAssignments = signal(false);

  constructor() {
    this.classForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      grade: ['', [Validators.required, Validators.min(1), Validators.max(12)]],
      teacherId: [''],
    });
  }

  ngOnInit(): void {
    this.classService.init();
    this.loadTeachers();
    
    // Watch for users changes and update teachers list
    effect(() => {
      const allUsers = this.userService.getUsers()();
      const teacherUsers = allUsers.filter(
        (u) => u.role === ApplicationRole.Teacher && u.Status === 'Active'
      );

      this.teachers.set(
        teacherUsers.map((u) => ({
          id: u.Id || u.id || '',
          name: u.Name || u.name || '',
          email: u.Email || u.email || '',
        })).filter(t => t.id && t.name && t.email) // Filter out any with missing required fields
      );
    });
  }

  loadTeachers(): void {
    // Load teachers by filtering users with Teacher role
    this.userService.loadUsers({
      pageIndex: 1,
      pageSize: 1000,
      role: ApplicationRole.Teacher,
      isActive: true,
    });
  }

  // Modal handlers
  openAddClassModal(): void {
    this.classForm.reset();
    this.selectedClass.set(null);
    this.showAddClassModal.set(true);
  }

  openEditClassModal(cls: Class): void {
    this.selectedClass.set(cls);
    this.classForm.patchValue({
      name: cls.name,
      grade: cls.grade,
      teacherId: cls.teacherId ? String(cls.teacherId) : '',
    });
    this.showEditClassModal.set(true);
    this.loadSubjects();
    this.loadClassTeacherAssignments();
  }

  closeClassModal(): void {
    this.showAddClassModal.set(false);
    this.showEditClassModal.set(false);
    this.classForm.reset();
    this.selectedClass.set(null);
  }

  openDeleteConfirm(cls: Class): void {
    this.selectedClass.set(cls);
    this.showDeleteConfirm.set(true);
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(false);
    this.selectedClass.set(null);
  }

  // CRUD operations
  saveClass(): void {
    if (this.classForm.invalid) {
      this.classForm.markAllAsTouched();
      return;
    }

    const formValue = this.classForm.value;
    const request: CreateClassRequest | UpdateClassRequest = {
      Name: formValue.name,
      Grade: Number(formValue.grade),
      TeacherId: formValue.teacherId ? Number(formValue.teacherId) : undefined,
    };

    if (this.selectedClass()) {
      // Update existing class
      this.classService
        .updateClass(this.selectedClass()!.id, request as UpdateClassRequest)
        .subscribe({
          next: () => {
            this.toastService.showSuccessMessage('Class updated successfully');
            this.closeClassModal();
          },
          error: (err) => {
            console.error('Failed to update class', err);
            this.toastService.showErrorMessage('Failed to update class. Please try again.');
          },
        });
    } else {
      // Create new class
      this.classService.createClass(request as CreateClassRequest).subscribe({
        next: (classId) => {
          this.toastService.showSuccessMessage(`Class created successfully (ID: ${classId})`);
          this.closeClassModal();
        },
        error: (err) => {
          console.error('Failed to create class', err);
          this.toastService.showErrorMessage('Failed to create class. Please try again.');
        },
      });
    }
  }

  confirmDelete(): void {
    const cls = this.selectedClass();
    if (!cls) return;

    this.classService.deleteClass(cls.id).subscribe({
      next: () => {
        this.toastService.showSuccessMessage('Class deleted successfully');
        this.showDeleteConfirm.set(false);
        this.selectedClass.set(null);
      },
      error: (err) => {
        console.error('Failed to delete class', err);
        this.toastService.showErrorMessage('Failed to delete class. Please try again.');
      },
    });
  }

  // Helper methods
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  getTeacherName(teacherId?: number): string {
    if (!teacherId) return 'Not Assigned';
    const teacher = this.teachers().find((t) => Number(t.id) === teacherId);
    return teacher ? teacher.name : 'Unknown';
  }

  // Load teacher assignments for the current class
  loadClassTeacherAssignments(): void {
    const cls = this.selectedClass();
    if (!cls) return;

    this.isLoadingClassAssignments.set(true);
    // Get all assignments for this class by checking all teachers
    // For now, we'll show assignments when editing a class
    // In a real scenario, we might want a dedicated endpoint for class assignments
    this.classTeacherAssignments.set([]);
    this.isLoadingClassAssignments.set(false);
  }

  loadSubjects(): void {
    const url = `${environment.apiUrl}/${Admin_API_ENDPOINTS.Subjects.GET_ALL}`.replace(/\/+/g, '/').replace(':/', '://');
    this.http.get<any>(url).subscribe({
      next: (response) => {
        let subjectsData: any[] = [];
        // Handle API response wrapper
        if (response && typeof response === 'object') {
          if ('IsSuccess' in response && response.IsSuccess && response.Data) {
            subjectsData = Array.isArray(response.Data) ? response.Data : [];
          } else if ('isSuccess' in response && response.isSuccess && response.data) {
            subjectsData = Array.isArray(response.data) ? response.data : [];
          } else if (Array.isArray(response)) {
            subjectsData = response;
          } else if (response?.Data && Array.isArray(response.Data)) {
            subjectsData = response.Data;
          }
        }

        this.subjects.set(
          subjectsData.map((s) => ({
            Id: String(s.Id || s.id || ''),
            Name: s.Name || s.name || '',
            Icon: s.Icon || s.icon,
          }))
        );
      },
      error: (err) => {
        console.error('Failed to load subjects', err);
        this.subjects.set([]);
      },
    });
  }

  addClassTeacherAssignment(): void {
    const assignment = this.newClassAssignment();
    const cls = this.selectedClass();
    if (!assignment.teacherId || !assignment.subjectId || !cls) {
      this.toastService.showErrorMessage('Please select both teacher and subject');
      return;
    }

    // Get existing assignments for this teacher
    this.teacherAssignmentService.getTeacherAssignments(assignment.teacherId).subscribe({
      next: (existingAssignments) => {
        // Check if assignment already exists
        const exists = existingAssignments.some(
          (a) => a.ClassId === String(cls.id) && a.SubjectId === assignment.subjectId
        );

        if (exists) {
          this.toastService.showErrorMessage('This teacher is already assigned to this class and subject');
          return;
        }

        // Add new assignment
        const newAssignments: ClassSubjectAssignment[] = [
          ...existingAssignments.map((a) => ({
            ClassId: a.ClassId,
            SubjectId: a.SubjectId,
          })),
          {
            ClassId: String(cls.id),
            SubjectId: assignment.subjectId,
          },
        ];

        this.isLoadingClassAssignments.set(true);
        this.teacherAssignmentService.assignTeacherToClasses(assignment.teacherId, newAssignments).subscribe({
          next: (response) => {
            if (response.Errors && response.Errors.length > 0) {
              this.toastService.showErrorMessage(response.Errors.join(', '));
            } else {
              this.toastService.showSuccessMessage('Teacher assigned successfully');
              this.newClassAssignment.set({ teacherId: '', subjectId: '' });
              this.loadClassTeacherAssignments();
            }
            this.isLoadingClassAssignments.set(false);
          },
          error: (err) => {
            console.error('Failed to add assignment', err);
            this.toastService.showErrorMessage('Failed to add assignment. Please try again.');
            this.isLoadingClassAssignments.set(false);
          },
        });
      },
      error: (err) => {
        console.error('Failed to load existing assignments', err);
        this.toastService.showErrorMessage('Failed to load existing assignments');
      },
    });
  }

  onTeacherChangeForAssignment(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.newClassAssignment.update(a => ({...a, teacherId: target.value}));
  }

  onSubjectChangeForAssignment(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.newClassAssignment.update(a => ({...a, subjectId: target.value}));
  }
}

