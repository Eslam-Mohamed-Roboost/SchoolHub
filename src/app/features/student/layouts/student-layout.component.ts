import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-student-layout',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="student-layout">
      <!-- Custom Header with Portfolio Dropdown -->
      <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom">
        <div class="container-fluid px-4">
          <a class="navbar-brand fw-bold" routerLink="/student/dashboard">
            <i class="fas fa-graduation-cap text-primary me-2"></i>
            School Hub
          </a>

          <button class="navbar-toggler" type="button" (click)="toggleMobileMenu()">
            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse" [class.show]="isMobileMenuOpen()">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <!-- Home -->
              <li class="nav-item">
                <a
                  class="nav-link"
                  routerLink="/student/dashboard"
                  routerLinkActive="active"
                  [routerLinkActiveOptions]="{ exact: true }"
                >
                  <i class="fas fa-home me-1"></i>Home
                </a>
              </li>

              <!-- My Missions -->
              <li class="nav-item">
                <a class="nav-link" routerLink="/student/missions" routerLinkActive="active">
                  <i class="fas fa-tasks me-1"></i>My Missions
                </a>
              </li>

              <!-- My Badges -->
              <li class="nav-item">
                <a class="nav-link" routerLink="/student/badges" routerLinkActive="active">
                  <i class="fas fa-award me-1"></i>My Badges
                </a>
              </li>

              <!-- Digital Portfolios Dropdown -->
              <li class="nav-item dropdown">
                <a
                  class="nav-link dropdown-toggle"
                  href="#"
                  id="portfolioDropdown"
                  role="button"
                  (click)="togglePortfolioDropdown($event)"
                  [class.active]="isPortfolioActive()"
                >
                  <i class="fas fa-folder-open me-1"></i>Digital Portfolios
                </a>
                <ul class="dropdown-menu" [class.show]="isPortfolioDropdownOpen()">
                  @for (subject of portfolioSubjects; track subject.id) {
                  <li>
                    <a
                      class="dropdown-item"
                      [routerLink]="['/student/portfolio', subject.id]"
                      routerLinkActive="active"
                    >
                      <i [class]="subject.icon + ' me-2'"></i>{{ subject.name }}
                    </a>
                  </li>
                  }
                  <li><hr class="dropdown-divider" /></li>
                  <li>
                    <a
                      class="dropdown-item"
                      routerLink="/student/portfolio-hub"
                      routerLinkActive="active"
                    >
                      <i class="fas fa-th-large me-2"></i>View All Portfolios
                    </a>
                  </li>
                </ul>
              </li>

              <!-- Challenge Zone -->
              <li class="nav-item">
                <a class="nav-link" routerLink="/student/challenges" routerLinkActive="active">
                  <i class="fas fa-gamepad me-1"></i>Challenge Zone
                </a>
              </li>
            </ul>

            <!-- User Profile -->
            <div class="d-flex align-items-center">
              <div class="nav-item dropdown">
                <a
                  class="nav-link dropdown-toggle"
                  href="#"
                  id="userDropdown"
                  role="button"
                  (click)="toggleUserDropdown($event)"
                >
                  <i class="fas fa-user-circle fa-lg"></i>
                </a>
                <ul class="dropdown-menu dropdown-menu-end" [class.show]="isUserDropdownOpen()">
                  <li>
                    <a class="dropdown-item" routerLink="/student/profile">
                      <i class="fas fa-user me-2"></i>My Profile
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" routerLink="/student/settings">
                      <i class="fas fa-cog me-2"></i>Settings
                    </a>
                  </li>
                  <li><hr class="dropdown-divider" /></li>
                  <li>
                    <a class="dropdown-item" routerLink="/login">
                      <i class="fas fa-sign-out-alt me-2"></i>Logout
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <router-outlet></router-outlet>
    </div>
  `,
  styles: [
    `
      .nav-link.active {
        color: #0d6efd !important;
        font-weight: 600;
      }

      .dropdown-item.active {
        background-color: #e7f1ff;
        color: #0d6efd;
      }

      .navbar {
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
    `,
  ],
})
export class StudentLayoutComponent {
  isMobileMenuOpen = signal(false);
  isPortfolioDropdownOpen = signal(false);
  isUserDropdownOpen = signal(false);

  portfolioSubjects = [
    { id: 'math', name: 'Math Hub', icon: 'fas fa-calculator' },
    { id: 'science', name: 'Science Hub', icon: 'fas fa-flask' },
    { id: 'ela', name: 'ELA Hub', icon: 'fas fa-book' },
    { id: 'arabic', name: 'Arabic Hub', icon: 'fas fa-language' },
    { id: 'islamic', name: 'Islamic Studies Hub', icon: 'fas fa-mosque' },
    { id: 'social', name: 'Social Studies Hub', icon: 'fas fa-globe' },
    { id: 'pe', name: 'PE Hub', icon: 'fas fa-running' },
    { id: 'arts', name: 'Arts Hub', icon: 'fas fa-palette' },
  ];

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((v) => !v);
  }

  togglePortfolioDropdown(event: Event): void {
    event.preventDefault();
    this.isPortfolioDropdownOpen.update((v) => !v);
    this.isUserDropdownOpen.set(false);
  }

  toggleUserDropdown(event: Event): void {
    event.preventDefault();
    this.isUserDropdownOpen.update((v) => !v);
    this.isPortfolioDropdownOpen.set(false);
  }

  isPortfolioActive(): boolean {
    return window.location.pathname.includes('/student/portfolio');
  }
}
