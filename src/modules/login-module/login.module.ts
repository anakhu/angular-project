import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  AboutComponent,
  AuthFormComponent,
  CredentialsFormComponent,
  LoginComponent,
  LoginFormComponent
} from './login/index';
import { MaterialModule } from '../material-module/material.module';
import { LoginRoutingModule } from './login-routing.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared-module/shared.module';
import { CoursesModule } from '../courses-module/courses.module';


const LoginModuleComponents = [
  AboutComponent,
  AuthFormComponent,
  CredentialsFormComponent,
  LoginComponent,
  LoginFormComponent
];

@NgModule({
  declarations: [LoginModuleComponents],
  imports: [
    CommonModule,
    RouterModule,
    LoginRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CoursesModule
  ],
  exports: [LoginModuleComponents]
})
export class LoginModule { }
