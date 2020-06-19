import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { NotificationsService } from 'src/app/shared/services/notifications/notifications.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { finalize, take } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit  {
  @ViewChild('form', {static: true}) form: NgForm;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationsService,
    private ngxService: NgxUiLoaderService,
  ) { }

  ngOnInit(): void {}

  public onSubmit(form: NgForm) {
    this.ngxService.start();
    const credentials: { email: string, password: string} = form.value;
    const { email, password } = credentials;
    this.authService.login(email, password)
      .pipe(
        take(1),
        finalize(() => this.ngxService.stop())
      )
      .subscribe((response: string | null) => {
        if (response) {
          this.form.resetForm();
          this.notificationService.createNotification('Login Success');
        }
    });
  }
}


