import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApplicationRole } from '../../../../core/enums/application-role.enum';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent {
  email = signal('');
  password = signal('');
  selectedRole = signal<'admin' | 'teacher' | 'student'>('admin');
  errorMessage = signal('');
  isLoading = signal(false);

  constructor(private authService: AuthService, private router: Router) {}

  handleLogin() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    const role = this.selectedRole();
    const credentials = {
      UserName: this.email(),
      password: this.password(),
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        console.log('Login successful, response:', response);

        // Navigate based on user role from response
        const role = response.Role;
        console.log('User role:', role);

        let redirectPath = '/';
        switch (role) {
          case ApplicationRole.Teacher:
            redirectPath = '/teacher/dashboard';
            break;
          case ApplicationRole.Student:
            redirectPath = '/student/hub';
            break;
          case ApplicationRole.Admin:
            redirectPath = '/admin/dashboard';
            break;
          default:
            redirectPath = '/';
            console.warn('Unknown role, redirecting to home');
        }

        console.log('Redirecting to:', redirectPath);
        this.router.navigate([redirectPath]).then(
          (success) => {
            if (success) {
              console.log('Navigation successful');
            } else {
              console.error('Navigation failed');
            }
          },
          (error) => {
            console.error('Navigation error:', error);
          }
        );
      },
      error: (error) => {
        this.isLoading.set(false);
        console.error('Login error:', error);
        this.errorMessage.set(error.message || 'Invalid credentials');
      },
    });
  }

  selectRole(role: 'admin' | 'teacher' | 'student') {
    this.selectedRole.set(role);
  }
}
