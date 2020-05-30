import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { MaterialModule } from '../modules/material-module/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorPageComponent } from './error-page/error-page.component';
import { HttpClientModule } from '@angular/common/http';

import { ToastrModule } from 'ngx-toastr';
import { AppService } from './shared/services/app/app.service';
import { ErrorHandlerModule } from '../modules/error-handler/error-handler.module';

import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { LoginModule } from '../modules/login-module/login.module';
import { UsersModule } from '../modules/users-module/users.module';
import { UploadModule } from 'src/modules/upload-module/upload.module';
import { CoursesModule } from 'src/modules/courses-module/courses.module';
import { UserModule } from 'src/modules/user-module/user.module';
import { SharedModule } from 'src/modules/shared-module/shared.module';

export function get_auth_status(appService: AppService) {
  return () => appService.getAuthUser();
}

@NgModule({
  declarations: [
    AppComponent,
    ErrorPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    ErrorHandlerModule.forRoot(),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxUiLoaderModule,
    LoginModule,
    UsersModule,
    UploadModule,
    CoursesModule,
    UserModule,
    SharedModule
  ],
  providers: [
    {provide: APP_INITIALIZER, useFactory: get_auth_status, deps: [AppService], multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
