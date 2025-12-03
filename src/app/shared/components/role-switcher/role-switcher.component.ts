import { Component, signal, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-role-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './role-switcher.component.html',
  styleUrls: ['./role-switcher.component.css'],
})
export class RoleSwitcherComponent {
  activeRole = signal<'teacher' | 'student' | 'admin'>('teacher');
  isDevMode = isDevMode();

  constructor(private router: Router) {}

  switchRole(role: 'teacher' | 'student' | 'admin') {
    this.activeRole.set(role);

    // Navigate to the respective dashboard
    switch (role) {
      case 'teacher':
        this.router.navigate(['/teacher/dashboard']);
        break;
      case 'student':
        this.router.navigate(['/student/dashboard']);
        break;
      case 'admin':
        this.router.navigate(['/admin/dashboard']);
        break;
    }
  }
}
