import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler, APP_INITIALIZER } from '@angular/core';
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
  CredentialsFormComponent,
} from './login/index';

import { CountrySelectComponent } from './shared/components/forms/profile-form/country-select/country-select.component';
import { ProfileFormComponent } from './shared/components/forms/profile-form/profile-form.component';

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
import { EmailMatchValidator } from './user-detail/user-edit/delete-user/email.validator';
import { WizardComponent } from './shared/components/wizard/wizard.component';
import { AnchorDirective } from './shared/components/wizard/anchor.directive';
import { UserEditComponent } from './user-detail/user-edit/user-edit.component';
import { DeleteUserComponent } from './user-detail/user-edit/delete-user/delete-user.component';
import { UploadComponent } from './shared/components/upload/upload.component';
import { UpdatePicComponent } from './user-detail/user-edit/update-pic/update-pic.component';
import { UpdateProfileComponent } from './user-detail/user-edit/update-profile/update-profile.component';
import { AppService } from './shared/services/app/app.service';
import { AddCourseComponent } from './user-detail/user-edit/add-course/add-course.component';


export function get_auth_status(appService: AppService) {
  return () => appService.getAuthUser();
}

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
    NotificationsComponent,
    EmailMatchValidator,
    WizardComponent,
    AnchorDirective,
    UserEditComponent,
    DeleteUserComponent,
    UploadComponent,
    UpdatePicComponent,
    UpdateProfileComponent,
    AddCourseComponent,
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
    {provide: APP_INITIALIZER, useFactory: get_auth_status, deps: [AppService], multi: true},
    {provide: ErrorHandler, useClass: ErrorService},
    // {provide: HTTP_INTERCEPTORS, useClass: LogInterceptor, multi: true},
    // {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
