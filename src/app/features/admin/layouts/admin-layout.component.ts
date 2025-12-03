import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {
  AppHeaderComponent,
  NavLink,
} from '../../../shared/components/app-header/app-header.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AppHeaderComponent],
  template: `
    <div class="admin-layout">
      <app-header [navLinks]="adminNavLinks"></app-header>
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ['../admin.css'],
})
export class AdminLayoutComponent {
  adminNavLinks: NavLink[] = [
    { path: '/admin/dashboard', label: 'Home', exact: true },
    { path: '/admin/users', label: 'Users' },
    { path: '/admin/analytics', label: 'Analytics' },
    { path: '/admin/evidence', label: 'Evidence Showcase' },
    { path: '/admin/cpd', label: 'CPD Tracking' },
    { path: '/admin/reports', label: 'Reports' },
  ];
}
