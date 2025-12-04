import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {
  AppHeaderComponent,
  NavLink,
} from '../../../shared/components/app-header/app-header.component';

@Component({
  selector: 'app-teacher-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AppHeaderComponent],
  template: `
    <div class="teacher-layout">
      <app-header [navLinks]="teacherNavLinks"></app-header>
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ['../teacher.css'],
})
export class TeacherLayoutComponent {
  teacherNavLinks: NavLink[] = [
    { path: '/teacher/dashboard', label: 'Home', exact: true },
    { path: '/teacher/hub', label: 'Teacher Hub' },
    { path: '/teacher/student-portfolio-hub', label: 'Student Portfolio Hub' },
    { path: '/teacher/learning-vault', label: 'Learning Vault' },
    { path: '/teacher/cpd', label: 'My CPD & Badges' },
    { path: '/teacher/teachers-lounge', label: 'Teacher Lounge' },
  ];
}
