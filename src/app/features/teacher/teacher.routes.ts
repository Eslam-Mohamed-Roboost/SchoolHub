import { Routes } from '@angular/router';
import { TeacherLayoutComponent } from './layouts/teacher-layout.component';
import { TeacherDashboardComponent } from './pages/teacher-dashboard/teacher-dashboard.component';
import { TeacherHubComponent } from './pages/teacher-hub/teacher-hub.component';
import { LearningVaultComponent } from './pages/learning-vault/learning-vault.component';
import { TeacherCpdComponent } from './pages/teacher-cpd/teacher-cpd.component';
import { SubjectPortalComponent } from './pages/subject-portal/subject-portal.component';

export const TEACHER_ROUTES: Routes = [
  {
    path: '',
    component: TeacherLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: TeacherDashboardComponent },
      { path: 'hub', component: TeacherHubComponent },
      { path: 'learning-vault', component: LearningVaultComponent },
      { path: 'cpd', component: TeacherCpdComponent },
      { path: 'subject-portals', component: SubjectPortalComponent },
      // Keep home route for backward compatibility
      { path: 'home', component: TeacherDashboardComponent },
    ],
  },
];
