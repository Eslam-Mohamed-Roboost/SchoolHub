import { Routes } from '@angular/router';
import { StudentLayoutComponent } from './layouts/student-layout.component';
import { StudentDashboardComponent } from './pages/student-dashboard/student-dashboard.component';
import { StudentNotebookComponent } from './pages/student-notebook/student-notebook.component';
import { StudentBadgesComponent } from './pages/student-badges/student-badges.component';
import { StudentDigitalCitizenshipComponent } from './pages/student-digital-citizenship/student-digital-citizenship.component';

export const STUDENT_ROUTES: Routes = [
  {
    path: '',
    component: StudentLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: StudentDashboardComponent,
      },
      {
        path: 'notebook',
        component: StudentNotebookComponent,
      },
      {
        path: 'badges',
        component: StudentBadgesComponent,
      },
      {
        path: 'digital-citizenship',
        component: StudentDigitalCitizenshipComponent,
      },
    ],
  },
];
