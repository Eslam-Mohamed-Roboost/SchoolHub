import { Routes } from '@angular/router';
import { TeacherLayoutComponent } from './layouts/teacher-layout.component';
import { TeacherDashboardComponent } from './pages/teacher-dashboard/teacher-dashboard.component';
import { TeacherHubComponent } from './pages/teacher-hub/teacher-hub.component';
import { LearningVaultComponent } from './pages/learning-vault/learning-vault.component';
import { TeacherCpdComponent } from './pages/teacher-cpd/teacher-cpd.component';
import { SubjectPortalComponent } from './pages/subject-portal/subject-portal.component';
import { CpdModuleDetailComponent } from './pages/learning-vault/cpd-module-detail/cpd-module-detail.component';
import { TeachersLoungeComponent } from './pages/teachers-lounge/teachers-lounge.component';
import { PortfolioDetailComponent } from './pages/portfolio-detail/portfolio-detail.component';
import { MyClassesComponent } from './pages/my-classes/my-classes.component';
import { ClassStudentsComponent } from './pages/class-students/class-students.component';
import { StudentGradesComponent } from './pages/student-grades/student-grades.component';
import { CreateExerciseComponent } from './pages/create-exercise/create-exercise.component';
import { CreateExamComponent } from './pages/create-exam/create-exam.component';

export const TEACHER_ROUTES: Routes = [
  {
    path: '',
    component: TeacherLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: TeacherDashboardComponent },
      { path: 'hub', component: TeacherHubComponent },
      { path: 'learning-vault', component: LearningVaultComponent },
      { path: 'learning-vault/module/:id', component: CpdModuleDetailComponent },
      { path: 'cpd', component: TeacherCpdComponent },
      { path: 'student-portfolio-hub/:id', component: SubjectPortalComponent },
      { path: 'student-portfolio-hub', component: SubjectPortalComponent },
      { path: 'teachers-lounge', component: TeachersLoungeComponent },
      { path: 'portfolio/:studentId/:subjectId', component: PortfolioDetailComponent },
      { path: 'my-classes', component: MyClassesComponent },
      { path: 'class/:id/students', component: ClassStudentsComponent },
      { path: 'grades', component: StudentGradesComponent },
      { path: 'exercises/create', component: CreateExerciseComponent },
      { path: 'exams/create', component: CreateExamComponent },
      // Keep home route for backward compatibility
      { path: 'home', component: TeacherDashboardComponent },
    ],
  },
];
