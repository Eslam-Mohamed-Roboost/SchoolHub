import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  AppHeaderComponent,
  NavLink,
} from '../../../shared/components/app-header/app-header.component';

@Component({
  selector: 'app-student-layout',
  imports: [RouterOutlet, AppHeaderComponent],
  template: `
    <div class="student-layout">
      <app-header [navLinks]="navLinks" />

      <main class="main-content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [
    `
      .student-layout {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        background-color: #f8f9fa;
      }

      .main-content {
        flex: 1;
        padding: 2rem 1rem;
        max-width: 1400px;
        width: 100%;
        margin: 0 auto;
      }

      @media (max-width: 768px) {
        .main-content {
          padding: 1rem 0.5rem;
        }
      }
    `,
  ],
})
export class StudentLayoutComponent {
  navLinks: NavLink[] = [
    { path: '/student/dashboard', label: 'Home', exact: true },
    { path: '/student/missions', label: 'My Missions' },
    { path: '/student/badges', label: 'My Badges' },
    { path: '/student/portfolio-hub', label: 'Digital Portfolios' },
    { path: '/student/challenge-zone', label: 'Challenge Zone' },
    { path: '/student/progress', label: 'My Progress' },
  ];
}
