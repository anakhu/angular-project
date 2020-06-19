import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from '../../../../shared/services/auth/auth.service';
import { NotificationsService } from 'src/app/shared/services/notifications/notifications.service';
import { User } from 'src/app/shared/models/user/user';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss']
})
export class AuthFormComponent implements OnInit {

  authForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationsService,
    private ngxService: NgxUiLoaderService,
  ) { }

  ngOnInit(): void {
    this._initAuthForm();
  }

  public submit(): void {
    this.ngxService.start();
    const { email, password } = this.authForm.controls.credentials.value;
    const payload = this.authForm.controls.profile.value;
    this.authService.signUp(email, password, payload)
      .pipe(
        finalize( () => this.ngxService.stop())
      )
      .subscribe((data: User)  => {
        return data
          ? this.notificationService.createNotification('Sign up success')
          : null;
      });
  }

  private _initAuthForm(): void {
    this.authForm = this.formBuilder.group({
      profile: [],
      credentials: [],
    });
  }
}
