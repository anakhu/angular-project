import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as fromAuthActions from './auth.actions';
import { catchError, map, switchMap,finalize, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ErrorService } from 'src/app/modules/error-handler/error.service/error.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { User } from 'src/app/shared/models/user/user';
import { FirebaseError } from 'firebase';
import { NotificationsService } from 'src/app/shared/services/notifications/notifications.service';

@Injectable()
export class AuthEffects {

  @Effect()
  authLogin$ = this.actions$.pipe(
    ofType(fromAuthActions.LOGIN_START),
    switchMap((action: fromAuthActions.LoginStartAction) => {
      this.loader.start();
      return this.authService.login(action.payload.email, action.payload.password)
        .pipe(
          map((response: firebase.auth.UserCredential) => {
            if (response?.user) {
              const { uid } = response.user;
              this.router.navigate(['/users', uid]);
              this.notifications.createNotification('Login in successs');
              return new fromAuthActions.UserIsLoading();
            }
          }),
          catchError((error) => {
            this.errors.handleError(error);
            return of(new fromAuthActions.LoginFailedAction(error));
          }),
          finalize(() => this.loader.stop())
        );
    }),
  );

  @Effect()
  authSignUp$ = this.actions$.pipe(
    ofType(fromAuthActions.SIGN_UP_START),
    switchMap((action: fromAuthActions.SignUpStartAction) => {
      this.loader.start();
      const { email, password, userData } = action.payload;
      return this.authService.signUp(email, password, userData)
        .pipe(
          tap((response: User) => {
            if (response) {
              const { id } = response;
              this.router.navigate(['/users', id]);
              this.notifications.createNotification('Sign up successs');
            }
          }),
          catchError((error: FirebaseError) => {
            this.errors.handleError(error);
            return of(new fromAuthActions.SignUpFailedAction(error));
          }),
          finalize(() => this.loader.stop())
        );
    })
  );

  @Effect()
  authLogout$ = this.actions$.pipe(
    ofType(fromAuthActions.LOGOUT_START),
    switchMap((action: fromAuthActions.LogoutStartAction) => {
      this.authService.logout();
      this.router.navigate(['/login']);
      return of(new fromAuthActions.UserIsLoading());
    })
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router,
    private errors: ErrorService,
    private loader: NgxUiLoaderService,
    private notifications: NotificationsService
    ) {}
}
