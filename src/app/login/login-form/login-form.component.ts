import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/shared/services/auth/auth.service';
import { Router } from '@angular/router';
import { AuthUser } from 'src/shared/models/authUsers';
import { CoursesService } from 'src/shared/services/courses/courses.service';


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit, OnDestroy {

  @ViewChild('form', {static: true}) form: NgForm;
  clickSubscription: Subscription;
  authError = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  public onSubmit(form: NgForm) {
    this.clearAuthErrors();
    const user: Partial <AuthUser> = form.value;
    const { email, password } = user;
    this.authService.login(email, password)
      .subscribe(
        (uid: string) => this.form.resetForm(),
        (error: Error) => this.authError = error.message,
      );
  }

  private clearAuthErrors(): void {
    this.authError = '';
  }
}


