import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoursesComponent } from './courses/courses.component';
import { CourseDetailComponent } from './courses/course-detail/course-detail.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { UsersComponent } from './users/users.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { AuthGuard } from '../shared/services/auth/auth.guard';
import { DetailPageComponent } from './detail-page/detail-page.component';
import { ErrorPageComponent } from './error-page/error-page.component';

const routes: Routes = [
  { path: 'courses', component: CoursesComponent },
  { path: 'courses/:id', component: CourseDetailComponent },
  { path: 'users', component: UsersComponent },
  { path: 'users/:id', component: UserDetailComponent },
  { path: 'users/:id/:detail', component: DetailPageComponent },
  { path: 'about', component: AboutComponent },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: '/courses', pathMatch: 'full' },
  { path: '404', component: ErrorPageComponent },
  { path: '**', redirectTo: '404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
