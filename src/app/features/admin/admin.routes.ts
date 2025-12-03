import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './pages/admin-users/admin-users.component';
import { AdminAnalyticsComponent } from './pages/admin-analytics/admin-analytics.component';
import { AdminEvidenceComponent } from './pages/admin-evidence/admin-evidence.component';
import { AdminCpdComponent } from './pages/admin-cpd/admin-cpd.component';
import { AdminReportsComponent } from './pages/admin-reports/admin-reports.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'users', component: AdminUsersComponent },
      { path: 'analytics', component: AdminAnalyticsComponent },
      { path: 'evidence', component: AdminEvidenceComponent },
      { path: 'cpd', component: AdminCpdComponent },
      { path: 'reports', component: AdminReportsComponent },
    ],
  },
];
