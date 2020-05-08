import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/shared/services/auth/auth.service';
import { fromEvent, Subscription, EMPTY } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { AuthUser } from '../../shared/models/authUsers';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  email: string;
  password: string;
  clickSubscription: Subscription;
  errorSubscription: Subscription;
  authError = '';

  constructor(
    private auth: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.createBtnSubscription();
  }

  ngOnDestroy(): void {
    this.clickSubscription.unsubscribe();
  }

  private createBtnSubscription(): void {
    const btn = document.getElementById('btnLogin');

    this.clickSubscription = fromEvent(btn, 'click')
      .pipe(
        switchMap((event: Event) => {
          this.clearErrors();
          return this.auth.logUserIn(this.getFormData())
            .pipe(
             catchError((error: Error) => {
              this.authError = error.message;
              return EMPTY;
             })
            );
        }),
      )
      .subscribe((user: AuthUser) => this.router.navigate(['/users', user.id]));
  }

  private getFormData(): Partial<AuthUser> {
   const user: Partial<AuthUser> = {
      email: this.email,
      password: this.password,
    };

   return user;
  }

  private clearErrors(): void {
    this.authError = '';
  }
}
