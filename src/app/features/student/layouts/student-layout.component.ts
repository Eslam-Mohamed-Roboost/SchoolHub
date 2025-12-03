import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {
  AppHeaderComponent,
  NavLink,
} from '../../../shared/components/app-header/app-header.component';

@Component({
  selector: 'app-student-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AppHeaderComponent],
  template: `
    <div class="student-layout">
      <app-header [navLinks]="studentNavLinks"></app-header>
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ['../student.css'],
})
export class StudentLayoutComponent {
  studentNavLinks: NavLink[] = [
    { path: '/student/dashboard', label: 'Home', exact: true },
    { path: '/student/notebook', label: 'My Digital Notebook' },
    { path: '/student/dashboard', label: 'Digital Citizenship', exact: true },
    { path: '/student/badges', label: 'My Badges' },
    { path: '/student/badges', label: 'Leaderboard' },
  ];
}
