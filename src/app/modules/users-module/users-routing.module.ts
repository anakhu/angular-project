import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { UsersResolver } from '../../shared/services/users/users.resolver';
import { FollowersResolver } from '../../shared/services/followers/followers.resolver';


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
