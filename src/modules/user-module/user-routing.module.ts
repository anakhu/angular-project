import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersResolver } from '../../app/shared/services/users/users.resolver';
import { FollowersResolver } from '../../app/shared/services/followers/followers.resolver';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { FollowersComponent } from './followers/followers.component';
import { UserCoursesComponent } from './user-courses/user-courses.component';
import { CoursesResolver } from '../../app/shared/services/courses/courses.resolver';


const routes: Routes = [
  {
    path: '',
    // component: UserDetailComponent,
    // resolve: { UsersResolver, CoursesResolver, FollowersResolver },
    children: [
      { path: 'courses', component: UserCoursesComponent },
      { path: 'followers', component: FollowersComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }

