import { Routes } from '@angular/router';
import { StudentLayoutComponent } from './layouts/student-layout/student-layout.component';
import { StudentHomeComponent } from './pages/student-home/student-home.component';
import { StudentMissionsComponent } from './pages/student-missions/student-missions.component';
import { MissionDetailComponent } from './pages/mission-detail/mission-detail.component';
import { StudentBadgesComponent } from './pages/student-badges/student-badges.component';
import { ChallengeZoneComponent } from './pages/challenge-zone/challenge-zone.component';
import { StudentProgressComponent } from './pages/student-progress/student-progress.component';
import { StudentNotebookComponent } from './pages/student-notebook/student-notebook.component';
import { StudentHelpComponent } from './pages/student-help/student-help.component';

export const STUDENT_ROUTES: Routes = [
  {
    path: '',
    component: StudentLayoutComponent,
    children: [
      { path: '', redirectTo: 'hub', pathMatch: 'full' },
      { path: 'hub', component: StudentHomeComponent },
      { path: 'missions', component: StudentMissionsComponent },
      { path: 'missions/:id', component: MissionDetailComponent },
      { path: 'badges', component: StudentBadgesComponent },
      { path: 'challenge-zone', component: ChallengeZoneComponent },
      { path: 'progress', component: StudentProgressComponent },
      { path: 'notebook', component: StudentNotebookComponent },
      { path: 'help', component: StudentHelpComponent },
    ],
  },
];
