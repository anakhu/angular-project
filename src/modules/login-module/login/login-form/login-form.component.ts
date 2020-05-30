import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { AuthUser } from 'src/app/shared/models/authUsers';
import { NotificationsService } from 'src/app/shared/services/notifications/notifications.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { finalize } from 'rxjs/operators';

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
    const user: Partial <AuthUser> = form.value;
    const { email, password } = user;
    this.authService.login(email, password)
      .pipe(
        finalize(() => this.ngxService.stop())
      )
      .subscribe((uid: string) => {
        if (uid) {
          this.form.resetForm();
          this.notificationService.createNotification('Login Success');
        }
      });
  }
}


