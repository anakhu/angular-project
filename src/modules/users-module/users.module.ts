import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent, UserComponent } from './users/index';
import { UsersRoutingModule } from './users-routing.module';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material-module/material.module';
import { FollowButtonComponent } from '../users-module/follow-button/follow-button.component';
import { FollowBarComponent } from '../users-module/follow-bar/follow-bar.component';
import { UserPicComponent } from '../users-module/user-pic/user-pic.component';

@NgModule({
  declarations: [
    UsersComponent,
    UserComponent,
    FollowButtonComponent,
    FollowBarComponent,
    UserPicComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    UsersRoutingModule,
  ],
  exports: [
    FollowButtonComponent,
    UserPicComponent,
    UserComponent
  ]
})
export class UsersModule { }
