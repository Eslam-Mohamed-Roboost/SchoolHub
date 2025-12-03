import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../features/auth/services/auth.service';
import { ROUTES } from '../../config/constants';

@Component({
  selector: 'app-main-layout',
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="min-h-screen">
      <!-- Main Content -->
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
})
export class MainLayoutComponent {
  protected readonly routes = ROUTES;
  currentUser = signal<{ name: string; email: string } | null>(null);

  constructor(private authService: AuthService) {
    // Get current user from auth service
    this.currentUser.set(this.authService.currentUser());
  }

  handleLogout(): void {
    this.authService.logout();
  }
}
