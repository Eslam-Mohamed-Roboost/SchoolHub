import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { MainLayoutComponent } from './core/layouts/main-layout.component';
import { ApplicationRole } from './core/enums/application-role.enum';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'student',
        loadChildren: () =>
          import('./features/student/student.routes').then((m) => m.STUDENT_ROUTES),
        canActivate: [roleGuard],
        data: { roles: ApplicationRole.Student },
      },
      {
        path: 'teacher',
        loadChildren: () =>
          import('./features/teacher/teacher.routes').then((m) => m.TEACHER_ROUTES),
        canActivate: [roleGuard],
        data: { roles: ApplicationRole.Teacher },
      },
      {
        path: 'admin',
        loadChildren: () => import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
        canActivate: [roleGuard],
        data: { roles: ApplicationRole.Admin },
      },
    ],
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./shared/components/profile-view/profile-view.component').then(
        (m) => m.ProfileViewComponent
      ),
  },
  {
    path: '**',
    redirectTo: '/auth/login',
  },
];
