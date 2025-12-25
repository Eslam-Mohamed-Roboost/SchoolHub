import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ClassService } from '../../services/class.service';
import { TeacherClass } from '../../models/class.model';

@Component({
  selector: 'app-my-classes',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mx-auto px-4 py-6">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">
          <i class="fas fa-chalkboard-teacher me-2"></i>My Classes
        </h2>
      </div>

      @if (loading()) {
        <div class="text-center py-5">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      } @else if (classes().length === 0) {
        <div class="alert alert-info">
          <i class="fas fa-info-circle me-2"></i>You are not assigned to any classes yet.
        </div>
      } @else {
        <div class="row g-4">
          @for (cls of classes(); track cls.id) {
            <div class="col-md-6 col-lg-4">
              <div class="card h-100 shadow-sm">
                <div class="card-body">
                  <h5 class="card-title">{{ cls.name }}</h5>
                  <p class="text-muted mb-2">Grade {{ cls.grade }}</p>
                  <p class="mb-3">
                    <i class="fas fa-users me-2"></i>{{ cls.studentCount }} students
                  </p>
                  <div class="mb-3">
                    <small class="text-muted d-block mb-1">Subjects:</small>
                    @for (subject of cls.subjects; track subject.subjectId) {
                      <span class="badge bg-primary me-1 mb-1">{{ subject.subjectName }}</span>
                    }
                  </div>
                  <a [routerLink]="['/teacher/class', cls.id, 'students']" class="btn btn-primary btn-sm">
                    <i class="fas fa-eye me-1"></i>View Students
                  </a>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class MyClassesComponent implements OnInit {
  private classService = inject(ClassService);

  classes = signal<TeacherClass[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.loadClasses();
  }

  loadClasses(): void {
    this.loading.set(true);
    this.classService.getMyClasses().subscribe({
      next: (classes) => {
        this.classes.set(classes);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load classes', err);
        this.loading.set(false);
      },
    });
  }
}

