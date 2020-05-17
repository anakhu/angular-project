import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from '../../shared/services/auth/auth.service';
import { AuthResponse } from 'src/app/shared/services/auth/auth.response';
import { Router } from '@angular/router';
import { NotificationsService } from 'src/app/shared/services/notifications/notifications.service';

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
    private notificationService: NotificationsService
  ) { }

  ngOnInit(): void {
    this.initAuthForm();
  }

  private initAuthForm(): void {
    this.authForm = this.formBuilder.group({
      profile: [],
      credentials: [],
    });
  }

  public submit(): void {
    const { email, password } = this.authForm.controls.credentials.value;
    const payload = this.authForm.controls.profile.value;
    this.authService.signUp(email, password, payload)
      .subscribe((data: AuthResponse)  => {
        return data ? this.notificationService.createNotification('Sign up success') : null;
      });
    }
}
