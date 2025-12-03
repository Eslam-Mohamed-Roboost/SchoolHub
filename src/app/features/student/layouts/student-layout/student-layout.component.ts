import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {
  AppHeaderComponent,
  NavLink,
} from '../../../../shared/components/app-header/app-header.component';

@Component({
  selector: 'app-student-layout',
  imports: [CommonModule, RouterOutlet, AppHeaderComponent],
  template: `
    <div class="student-layout">
      <app-header [navLinks]="studentLinks"></app-header>

      <div class="main-container">
        <main class="content-area">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [
    `
      .student-layout {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        background-color: #f3f2f1;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }

      .main-container {
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .content-area {
        flex: 1;
        padding: 2rem;
        width: 100%;
        max-width: 1400px;
        margin: 0 auto;
      }
    `,
  ],
})
export class StudentLayoutComponent {
  studentLinks: NavLink[] = [
    { path: '/student/hub', label: 'Hub', exact: true },
    { path: '/student/missions', label: 'Missions' },
    { path: '/student/badges', label: 'Badges' },
    { path: '/student/notebook', label: 'Notebook' },
    { path: '/student/challenge-zone', label: 'Challenges' },
    { path: '/student/progress', label: 'Progress' },
    { path: '/student/help', label: 'Help' },
  ];
}
