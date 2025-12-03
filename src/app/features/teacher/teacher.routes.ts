import { Routes } from '@angular/router';
import { TeacherLayoutComponent } from './layouts/teacher-layout.component';
import { TeacherHomeComponent } from './pages/teacher-home/teacher-home.component';

export const TEACHER_ROUTES: Routes = [
  {
    path: '',
    component: TeacherLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: TeacherHomeComponent },
      // Placeholders for future phases
      {
        path: 'vault',
        loadComponent: () =>
          import('./pages/teacher-home/teacher-home.component').then((m) => m.TeacherHomeComponent),
      }, // Temporary
      {
        path: 'impact',
        loadComponent: () =>
          import('./pages/teacher-home/teacher-home.component').then((m) => m.TeacherHomeComponent),
      }, // Temporary
      {
        path: 'lounge',
        loadComponent: () =>
          import('./pages/teacher-home/teacher-home.component').then((m) => m.TeacherHomeComponent),
      }, // Temporary
      {
        path: 'playground',
        loadComponent: () =>
          import('./pages/teacher-home/teacher-home.component').then((m) => m.TeacherHomeComponent),
      }, // Temporary
      {
        path: 'digital-citizenship',
        loadComponent: () =>
          import('./pages/teacher-home/teacher-home.component').then((m) => m.TeacherHomeComponent),
      }, // Temporary
      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/teacher-home/teacher-home.component').then((m) => m.TeacherHomeComponent),
      }, // Temporary
      {
        path: 'support',
        loadComponent: () =>
          import('./pages/teacher-home/teacher-home.component').then((m) => m.TeacherHomeComponent),
      }, // Temporary
      {
        path: 'help',
        loadComponent: () =>
          import('./pages/teacher-home/teacher-home.component').then((m) => m.TeacherHomeComponent),
      }, // Temporary
    ],
  },
];
