import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoursesComponent } from './modules/courses-module/courses/courses.component';
import { CourseDetailComponent } from './modules/courses-module/courses/course-detail/course-detail.component';
import { ErrorPageComponent } from './modules/shared-module/components/error-page/error-page.component';
import { CoursesResolver } from './shared/services/courses/courses.resolver';
import { UsersResolver } from './shared/services/users/users.resolver';
import { UserDetailComponent } from 'src/app/modules/user-module/user-detail/user-detail.component';
import { FollowersResolver } from '../app/shared/services/followers/followers.resolver';
import { UserCoursesComponent } from 'src/app/modules/user-module/user-courses/user-courses.component';
import { FollowersComponent } from 'src/app/modules/user-module/followers/followers.component';

const routes: Routes = [
  {
    path: 'courses',
    component: CoursesComponent,
    resolve: { CoursesResolver, UsersResolver}
  },
  {
    path: 'courses/:id',
    component: CourseDetailComponent,
    resolve: { CoursesResolver, UsersResolver }
  },
  {
    path: 'users',
    loadChildren: () => import('./modules/users-module/users.module').then(m => m.UsersModule),
  },
  {
    path: 'users/:id',
    component: UserDetailComponent,
    resolve: { CoursesResolver, UsersResolver, FollowersResolver},
    children: [
      { path: 'courses', component: UserCoursesComponent },
      { path: 'followers', component: FollowersComponent }
    ]
  },
  {
    path: 'login',
    loadChildren: () => import('./modules/login-module/login.module').then(m => m.LoginModule),
  },
  { path: '', redirectTo: '/courses', pathMatch: 'full' },
  { path: '404', component: ErrorPageComponent },
  { path: '**', redirectTo: '404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {anchorScrolling: 'enabled'})],
  exports: [RouterModule],
})
export class AppRoutingModule { }
