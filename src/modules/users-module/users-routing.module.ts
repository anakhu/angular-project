import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from '../users-module/users/users.component';
import { UsersResolver } from '../../app/shared/services/users/users.resolver';
import { FollowersResolver } from '../../app/shared/services/followers/followers.resolver';


const routes: Routes = [
  {
    path: '', component: UsersComponent,
    resolve: { UsersResolver, FollowersResolver },
  },
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
