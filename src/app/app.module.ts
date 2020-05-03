import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../modules/material.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  CourseComponent,
  CourseDetailComponent,
  CoursesComponent,
} from './courses/index';
import {
  UserCoursesComponent,
  UserDetailComponent,
  UserFollowComponent,
  UserPicComponent,
  FollowBtnComponent,
} from './user-detail/index';
import {
  UserComponent,
  UsersComponent
} from './users/index';
import { AboutComponent } from './about/about.component';
// import { UserProfileComponent } from './user-profile/user-profile.component';
// import { AddCourseComponent } from './user-profile/add-course/add-course.component';
import { LoginComponent } from './login/login.component';
import { DetailPageComponent } from './detail-page/detail-page.component';
import { ErrorPageComponent } from './error-page/error-page.component';

@NgModule({
  declarations: [
    AppComponent,
    CoursesComponent,
    CourseDetailComponent,
    AboutComponent,
    // UserProfileComponent,
    // AddCourseComponent,
    UsersComponent,
    UserDetailComponent,
    UserPicComponent,
    UserFollowComponent,
    UserCoursesComponent,
    LoginComponent,
    FollowBtnComponent,
    DetailPageComponent,
    CourseComponent,
    UserComponent,
    ErrorPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
