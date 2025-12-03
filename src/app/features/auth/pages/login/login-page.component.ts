import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent {
  email = signal('admin@school.edu');
  password = signal('password');
  selectedRole = signal<'admin' | 'teacher' | 'student'>('admin');
  errorMessage = signal('');
  isLoading = signal(false);

  constructor(private authService: AuthService, private router: Router) {}

  handleLogin() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    const role = this.selectedRole();
    const credentials = {
      email: this.email(),
      password: this.password(),
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.isLoading.set(false);

        // Navigate based on selected role
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
          default:
            this.router.navigate(['/auth/login']);
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.message || 'Invalid credentials');
      },
    });
  }

  selectRole(role: 'admin' | 'teacher' | 'student') {
    this.selectedRole.set(role);
  }
}
