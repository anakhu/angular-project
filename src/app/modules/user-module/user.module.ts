import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FollowersComponent } from './followers/followers.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { AddCourseComponent } from './user-edit/add-course/add-course.component';
import { DeleteUserComponent } from './user-edit/delete-user/delete-user.component';
import { EmailMatchValidator } from './user-edit/delete-user/email.validator';
import { UpdatePicComponent } from './user-edit/update-pic/update-pic.component';
import { UpdateProfileComponent } from './user-edit/update-profile/update-profile.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from '../material-module/material.module';
import { UserCoursesComponent } from './user-courses/user-courses.component';
import { UsersModule } from '../users-module/users.module';
import { CoursesModule } from '../courses-module/courses.module';
import { UploadModule } from '../upload-module/upload.module';
import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from '../shared-module/shared.module';
import { UserNotificationsComponent } from './notifications/user-notifications.component';


@NgModule({
  declarations: [
    FollowersComponent,
    UserDetailComponent,
    UserEditComponent,
    AddCourseComponent,
    DeleteUserComponent,
    EmailMatchValidator,
    UpdatePicComponent,
    UpdateProfileComponent,
    UserCoursesComponent,
    UserNotificationsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    UsersModule,
    CoursesModule,
    UploadModule,
    SharedModule,
    UserRoutingModule
  ]
})
export class UserModule { }
