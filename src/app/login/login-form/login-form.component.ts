import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { AuthUser } from 'src/app/shared/models/authUsers';
import { NotificationsService } from 'src/app/shared/services/notifications/notifications.service';


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit, OnDestroy {

  @ViewChild('form', {static: true}) form: NgForm;
  clickSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationsService
  ) { }

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  public onSubmit(form: NgForm) {
    const user: Partial <AuthUser> = form.value;
    const { email, password } = user;
    this.authService.login(email, password)
      .subscribe((uid: string) => {
        if (uid) {
          this.form.resetForm();
          this.notificationService.createNotification('Login Success');
        }
      });
  }
}


