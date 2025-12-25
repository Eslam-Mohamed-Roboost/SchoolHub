import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ClassService } from '../../services/class.service';
import { ClassStudent } from '../../models/class.model';

@Component({
  selector: 'app-class-students',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mx-auto px-4 py-6">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-0">
            <i class="fas fa-users me-2"></i>Class Students
          </h2>
          <p class="text-muted mb-0">{{ className() }}</p>
        </div>
        <a routerLink="/teacher/my-classes" class="btn btn-outline-secondary">
          <i class="fas fa-arrow-left me-1"></i>Back to Classes
        </a>
      </div>

      @if (loading()) {
        <div class="text-center py-5">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      } @else if (students().length === 0) {
        <div class="alert alert-info">
          <i class="fas fa-info-circle me-2"></i>No students found in this class.
        </div>
      } @else {
        <div class="card">
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Last Login</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (student of students(); track student.id) {
                    <tr>
                      <td>{{ student.name }}</td>
                      <td>{{ student.email }}</td>
                      <td>
                        <span [class]="student.isActive ? 'badge bg-success' : 'badge bg-secondary'">
                          {{ student.isActive ? 'Active' : 'Inactive' }}
                        </span>
                      </td>
                      <td>{{ formatDate(student.lastLogin) }}</td>
                      <td>
                        <button class="btn btn-sm btn-outline-primary me-1">
                          <i class="fas fa-graduation-cap me-1"></i>View Grades
                        </button>
                        <button class="btn btn-sm btn-outline-success me-1">
                          <i class="fas fa-tasks me-1"></i>Create Exercise
                        </button>
                        <button class="btn btn-sm btn-outline-info">
                          <i class="fas fa-clipboard-list me-1"></i>Create Exam
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class ClassStudentsComponent implements OnInit {
  private classService = inject(ClassService);
  private route = inject(ActivatedRoute);

  students = signal<ClassStudent[]>([]);
  className = signal('');
  loading = signal(true);

  ngOnInit(): void {
    const classId = this.route.snapshot.paramMap.get('id');
    if (classId) {
      this.loadStudents(classId);
    }
  }

  loadStudents(classId: string): void {
    this.loading.set(true);
    this.classService.getClassStudents(classId).subscribe({
      next: (students) => {
        this.students.set(students);
        if (students.length > 0) {
          this.className.set(students[0].className);
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load students', err);
        this.loading.set(false);
      },
    });
  }

  formatDate(date?: Date): string {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString();
  }
}

