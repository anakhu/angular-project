import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UsersService } from 'src/shared/services/users/users.service';
import { User } from 'src/shared/models/user';
import { AuthService } from 'src/shared/services/auth/auth.service';
import { AuthResponse } from 'src/shared/services/auth/auth.response';
import { Router } from '@angular/router';

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
    private router: Router
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
      .subscribe((data: AuthResponse)  => console.log(data));
    }

}
