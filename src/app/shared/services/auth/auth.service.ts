import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { tap, concatMap, exhaustMap, catchError, mapTo, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../../models/user/user';
import { UsersService } from '../users/users.service';
import { AppService } from '../app/app.service';
import { ErrorService } from 'src/app/modules/error-handler/error.service/error.service';
import { LoggedInUser } from '../../models/user/loggedInUser';
import { FirebaseError } from 'firebase';
import { Store } from '@ngrx/store';
import * as fromAuthReducer from 'src/app/store/auth/auth.actions';
import { AppState } from 'src/app/store/app.reducer';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private fireBaseAuth: firebase.auth.Auth;

  constructor(
    private router: Router,
    private users: UsersService,
    private app: AppService,
    private errors: ErrorService,
    private store: Store<AppState>,
  ) {
    this._setFireAuthRef();
  }

  public signUp(email: string, password: string, userData: Partial<User>): Observable<User> {
    return from(this.fireBaseAuth.createUserWithEmailAndPassword(email, password))
      .pipe(
        exhaustMap((response: firebase.auth.UserCredential) => {
          if (response?.user.uid) {
            const id = response.user.uid;
            return this.users.addUser({...userData, id });
          }
        }),
        tap((user: User) => user?.id
          ? this.router.navigate(['/users', user.id])
          : null)
      );
  }

  public login(email: string, password: string): Observable<firebase.auth.UserCredential> {
    return from(this.fireBaseAuth.signInWithEmailAndPassword(email, password));
  }

  public logout(): void {
    this.fireBaseAuth.signOut();
  }

  public deleteUserAccount(): Observable<boolean> {
    const user = this.fireBaseAuth.currentUser;
    return of(user)
      .pipe(
        concatMap((loginUser: firebase.User | null) => {
          if (loginUser) {
            return from(user.delete())
              .pipe(
                mapTo(loginUser.uid),
            );
          }
        }),
        catchError((error: FirebaseError) => {
          this.errors.handleError(error);
          return of(false);
        }),
        map((response: string | boolean) => {
          if (typeof response === 'string') {
            this.users.updateLoacalUsersOnDelete(response);
            return true;
          } else {
            return response;
          }
        })
      );
  }

  private _setFireAuthRef(): void {
    this.fireBaseAuth = this.app.getFireBaseAuthReference();
    this.fireBaseAuth.onAuthStateChanged((user: firebase.User | null) => {
        if (user) {
          const loggedInUser: LoggedInUser = { uid: user.uid, email: user.email };
          this.store.dispatch(new fromAuthReducer.LoginSuccessAction(loggedInUser));
        } else {
          this.store.dispatch(new fromAuthReducer.LogoutEndAction());
        }
      });
    }
}
