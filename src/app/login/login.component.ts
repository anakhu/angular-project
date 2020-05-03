import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/shared/services/auth/auth.service';
import { fromEvent, EMPTY, Subscription } from 'rxjs';
import { tap, switchMap, catchError } from 'rxjs/operators';
import { AuthUser } from '../../shared/models/authUsers';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  email: string;
  password: string;
  authError: string;
  clickSubscription: Subscription;

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

          const user: Partial<AuthUser> = {
            email: this.email,
            password: this.password,
          };

          return this.auth.logUserIn(user)
            .pipe(
              tap((result: AuthUser | Error) => {
                if (result instanceof Error) {
                  throw result;
                }
              }),
              catchError((error: Error) => {
                this.authError = error.message;
                return EMPTY;
              })
            );
        }),
      )
      .subscribe((user: AuthUser) => {
        console.log('Login success');
        this.router.navigate(['/users', user.id]);
      });
  }

  private clearErrors(): void {
    this.authError = '';
  }
}
