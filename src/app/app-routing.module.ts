import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoursesComponent } from './courses/courses.component';
import { CourseDetailComponent } from './courses/course-detail/course-detail.component';
import { LoginComponent } from './login/login.component';
import { UsersComponent } from './users/users.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { AuthGuard } from './shared/services/auth/auth.guard';
import { DetailPageComponent } from './detail-page/detail-page.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { CoursesResolver } from './shared/services/courses/courses.resolver';
import { UsersResolver } from './shared/services/users/users.resolver';
import { FollowersResolver } from './shared/services/followers/followers.resolver';

const routes: Routes = [
  {
    path: 'courses',
    component: CoursesComponent,
    resolve: { CoursesResolver, UsersResolver}
  },
  {
    path: 'courses/:id',
    component: CourseDetailComponent,
    resolve: { CoursesResolver }
  },
  {
    path: 'users',
    component: UsersComponent,
    resolve: { UsersResolver, FollowersResolver }
  },
  {
    path: 'users/:id',
    component: UserDetailComponent,
    resolve: { UsersResolver, CoursesResolver, FollowersResolver }
  },
  { path: 'users/:id/:detail', component: DetailPageComponent },
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
