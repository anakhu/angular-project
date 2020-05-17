import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { MaterialModule } from '../modules/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  CourseComponent,
  CourseDetailComponent,
  CoursesComponent,
  LikeButtonComponent
} from './courses/index';
import {
  UserCoursesComponent,
  UserDetailComponent,
  UserPicComponent,
} from './user-detail/index';
import {
  UserComponent,
  UsersComponent
} from './users/index';

import {
  AboutComponent,
  LoginComponent,
  LoginFormComponent,
  AuthFormComponent,
  CountrySelectComponent,
  CredentialsFormComponent,
  ProfileFormComponent,
} from './login/index';

import { DetailPageComponent } from './detail-page/detail-page.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { ErrorService } from 'src/app/shared/services/error/error.service';
import {
  FollowBarComponent,
  FollowButtonComponent,
  FollowerComponent,
  FollowersComponent
} from './followers/index';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LogInterceptor } from './shared/interceptors/log.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { NotificationsComponent } from './shared/components/notifications/notifications.component';
import { ErrorInterceptor } from './shared/interceptors/error.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    CoursesComponent,
    CourseDetailComponent,
    AboutComponent,
    UsersComponent,
    UserDetailComponent,
    UserPicComponent,
    UserCoursesComponent,
    LoginComponent,
    DetailPageComponent,
    CourseComponent,
    UserComponent,
    ErrorPageComponent,
    FollowersComponent,
    FollowerComponent,
    FollowButtonComponent,
    FollowBarComponent,
    LoginFormComponent,
    AuthFormComponent,
    CountrySelectComponent,
    CredentialsFormComponent,
    ProfileFormComponent,
    LikeButtonComponent,
    NotificationsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    {provide: ErrorHandler, useClass: ErrorService},
    {provide: HTTP_INTERCEPTORS, useClass: LogInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
